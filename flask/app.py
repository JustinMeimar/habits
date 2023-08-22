import os
import json
import random

from flask import Flask, Blueprint, request, jsonify
from flask_migrate import Migrate
from dotenv import load_dotenv 
from database import db
from models import User, HabitData, Habit, HabitType
from datetime import datetime, timedelta
from sqlalchemy import and_
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime, timedelta
from enum import Enum

class HabitType(Enum):
    Boolean = 1
    Qualitative = 2
    Quantitative = 3

def get_type_id(type_string: str) -> int:
    match (type_string):
        case "boolean":
            return HabitType.Boolean.value
        case "quantitative":
            return HabitType.Quantitative.value
        case "qualitative":
            return HabitType.Qualitative.value
    return None

def get_uninitialized_week_data(start_date: str):

    week_data = {}
    start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()

    for i in range(0, 7):
        date = start_date_obj + timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')
        week_data.update({
            date_str: None
        })

    return week_data

def get_db_uri():
    PG_USER = os.environ.get('PG_USER')
    PG_PWD = os.environ.get('PG_PWD')
    
    return f"postgresql://{PG_USER}:{PG_PWD}@localhost/habits_db"

def install_routes(app: Flask):

    app_bp = Blueprint('api_blueprint', __name__)

    @app_bp.route('/')
    def index():
        return "login here D:"

    @app_bp.route('/api/add-habit-week/<int:user_id>/<int:habit_id>', methods=['POST'])
    def init_week(user_id, habit_id):
        response = {'ok': False}
        
        new_week = request.args.get(key='start-week') 
        user = User.query.get(user_id)

        if user: 
            habit_data = HabitData.query.filter_by(
                habit_id=habit_id, start_date=new_week
            ).first()

            if habit_data != None:
                response['message'] = "habit week already exists"
                return

            empty_week_data = get_uninitialized_week_data(new_week)

            new_habit_data = HabitData(habit_id=habit_id, start_date=new_week, data=empty_week_data) 
            db.session.add(new_habit_data)
            db.session.commit()
            response = {'ok': True}

        return jsonify(response)

    @app_bp.route('/api/update-habit-title/<int:user_id>/<int:habit_id>', methods=['POST'])
    def update_habit_title(user_id, habit_id):
        response = {'ok': False}
        
        new_title = request.args.get(key='new-title') 
        user = User.query.get(user_id)

        if user: 
            existing_habit = Habit.query.filter_by(id=habit_id).first()
            if existing_habit:
                existing_habit.habit_title = new_title
                
                db.session.add(existing_habit)
                db.session.commit()
                response = {'ok': True}
            else:
                response['message'] = f"no habit found with id: {habit_id} for user {user_id}"

             
        return jsonify(response)

    @app_bp.route('/api/remove-habit/<int:user_id>/<int:habit_id>', methods=['POST'])
    def remove_habit(user_id, habit_id):
        # TODO: implement remove habit
        
        response = {'ok': False}
        
        print(user_id, habit_id)

        user = User.query.get(user_id)

        if user: 
            habit_data = HabitData.query.filter_by(habit_id=habit_id).all()

            print(habit_data)

        return jsonify(response)

    @app_bp.route('/api/add-habit/<int:user_id>', methods=['POST'])
    def add_habit(user_id):
        new_habit_json = request.json.get('habit')

        response = {'ok': False}

        user = User.query.get(user_id)
        if user:
            try:
                habit_title = new_habit_json['title']
                habit_type = get_type_id(new_habit_json['habitType'])

                assert habit_type is not None 

                new_habit = Habit(user_id=user.id, type_id=habit_type, habit_title=habit_title)
                db.session.add(new_habit)
                db.session.commit()

                start_date = new_habit_json['weeks'][0]['startWeek']
                json_data = new_habit_json['weeks'][0]['data']
                
                newHabitData = HabitData(habit_id=new_habit.id, start_date=start_date, data=json_data)
                db.session.add(newHabitData)
                db.session.commit()

                response['ok'] = True
                response['habit_id'] = str(newHabitData.id)

            except Exception as e:
                print(f"ecountered error: {e}")
                db.session.rollback()
        else:
            response['meessage'] = f"user {user_id} does not exist"
        return jsonify(response)


    @app_bp.route('/api/update-atom/<int:user_id>/<int:habit_id>', methods=['POST'])
    def update_habit_atom(user_id, habit_id):
        
        weekKey = request.args.get(key="week-key")
        dayKey = request.args.get(key="day-key") 
        newValue = request.json.get('value')

        response = {"ok": False}

        user = User.query.get(user_id)
        if user: 
            habit_data = HabitData.query.filter_by(
                habit_id=habit_id, start_date=weekKey
            ).first()

            if habit_data: 
                try:
                    print("Before update:", habit_data.data)
                    
                    dataCopy = habit_data.data
                    dataCopy[dayKey] = newValue 
                    habit_data.data = dataCopy

                    flag_modified(habit_data, 'data') 
                    db.session.commit()
                    
                    print("aftter update:", habit_data.data)

                    response['ok'] = True
                except Exception as e:
                    db.session.rollback()
                    print("An error occurred:", e)
        
        return jsonify(response)

    @app_bp.route('/api/get-user-habits/<int:user_id>')
    def get_user_habits(user_id):
        # TODO: use the start weekk 

        startDate = request.args.get(key="start-date")

        user = User.query.get(user_id)
        if user:
            return jsonify(
                habits=[habit.get_all() for habit in user.habits]
            )

    @app_bp.route('/api/get-habit-data/<int:habit_id>')
    def get_habit_data(habit_id):
        
        start_week = request.args.get(key="start-week")
        end_week = request.args.get(key="end-week") 

        print(start_week, end_week)

        if start_week is None or end_week is None:
            return "Error" 

        habit_data = HabitData.query.filter(
            and_(
                HabitData.habit_id == habit_id,
                HabitData.start_date >= start_week,
                HabitData.start_date <= end_week 
            )
        ).all()

        result = [hd.to_dict() for hd in habit_data]

        return jsonify(result)
    
    
    @app_bp.route("/login", methods=['POST'])
    def login():
        data = request.json
        username = data['username']
        password = data['password']

        print(username, password)

        return "hello?"
        # user = User.query.filter_by(username=username).first()

        # if user and check_password_hash(user.password_hash, password):
        #     login_user(user)
        #     return jsonify(success=True, user=user.to_dict())
        # return jsonify(success=False, message="Invalid credentials"), 401

    @cross_origin(supports_credenitals=True) 
    @login_required
    @app_bp.route('/logout')
    def logout():
        logout_user()
        return jsonify(success=True)


    # register blueprint
    app.register_blueprint(app_bp)

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS, cross_origin

def create_app() -> Flask:
    app = Flask(__name__)

    CORS(app)

    migrate = Migrate()
    login_manager = LoginManager()
    login_manager.init_app(app)   
    
    load_dotenv() 
    app.config['SQLALCHEMY_DATABASE_URI'] = get_db_uri() 
    
    db.init_app(app)
    
    migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
    migrate.init_app(app=app, db=db, directory=migrations_dir)

    with app.app_context():
        db.create_all()

    install_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
