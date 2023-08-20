from flask import Flask, Blueprint, request, jsonify
import os
import json
from dotenv import load_dotenv 
from database import db
from models import User, HabitData, Habit, HabitType
from datetime import datetime, timedelta
from sqlalchemy import and_
from sqlalchemy.orm.attributes import flag_modified
import random
from enum import Enum

class HabitType(Enum):
    Boolean = 1
    Qualitative = 2
    Quantitative = 3

def get_type_id(type_string: str) -> int:
    match (type_string):
        case "boolean":
            return HabitType.Boolean
        case "quantitative":
            return HabitType.Quantitative
        case "qualitative":
            return HabitType.Qualitative
    return None

def install_routes(app: Flask):

    app_bp = Blueprint('flask', __name__)

    @app_bp.route('/')
    def index():
        return "login here D:"

    @app_bp.route('/api/add-habit/<int:user_id>', methods=['POST'])
    def add_habit(user_id):
        new_habit_json = request.json.get('habit')

        response = {'ok': False}

        user = User.query.get(user_id)
        if user:
            try:
                habit_id = new_habit_json['habitId']
                habit_title = new_habit_json['title']
                habit_type = get_type_id(new_habit_json['habitType'])

                assert habit_type is not None 

                new_habit = Habit(user_id=user.id, type_id=habit_type, habit_title=habit_title)
                db.session.add(new_habit)

                start_date = new_habit_json['weeks'][0]['startWeek']
                json_data = new_habit_json['weeks'][0]['data']
                
                newHabitData = HabitData(habit_id=habit_id, start_date=start_date, data=json_data)
                db.session.add(newHabitData)

                db.session.commit()
                response['ok'] = True

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

    # register blueprint
    app.register_blueprint(app_bp)

def get_db_uri():
    PG_USER = os.environ.get('PG_USER')
    PG_PWD = os.environ.get('PG_PWD')
    
    return f"postgresql://{PG_USER}:{PG_PWD}@localhost/habits_db"

from flask_cors import CORS

def create_app() -> Flask:
    app = Flask(__name__)

    # CORS(app, origins="localhost:3000, 127.0.0.1:3000")
    CORS(app, origins="*")
    
    load_dotenv() 
    app.config['SQLALCHEMY_DATABASE_URI'] = get_db_uri() 

    db.init_app(app)
    with app.app_context():
        db.create_all()

    install_routes(app)

    return app

# from flask import Flask, render_template, redirect, url_for, flash
# from flask_login import current_user, login_user, logout_user, login_required

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         return redirect(url_for('index'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(username=form.username.data).first()
#         if user is None or not user.check_password(form.password.data):
#             flash('Invalid username or password')
#             return redirect(url_for('login'))
#         login_user(user)
#         return redirect(url_for('index'))
#     return render_template('login.html', form=form)

# @app.route('/logout')
# def logout():
#     logout_user()
#     return redirect(url_for('index'))

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if current_user.is_authenticated:
#         return redirect(url_for('index'))
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         user = User(username=form.username.data)
#         user.set_password(form.password.data)
#         db.session.add(user)
#         db.session.commit()
#         flash('Congratulations, you are now a registered user!')
#         return redirect(url_for('login'))
#     return render_template('register.html', form=form)

# @app.route('/')
# # @login_required
# def index():
#     return "Hello, {}!".format(current_user.username)

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)