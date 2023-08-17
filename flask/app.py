from flask import Flask, Blueprint, request, jsonify
import os
import json
from dotenv import load_dotenv 
from database import db
from models import User, HabitData, Habit, HabitType
from datetime import datetime, timedelta
from sqlalchemy import and_
import random

def install_routes(app: Flask):

    app_bp = Blueprint('flask', __name__)

    @app_bp.route('/')
    def index():
        return "Hello, Flask"

    @app_bp.route('/insert-test-data', methods=['POST'])
    def insert_test_data():
        habit_id = 1
        
        # Start from the first Sunday in July, 2023 (July 2nd)
        start_date_obj = datetime.strptime("2023-07-02", '%Y-%m-%d')
        
        # End on the most recent Sunday in August, 2023 (August 13th)
        end_date_obj = datetime.strptime("2023-08-13", '%Y-%m-%d')

        while start_date_obj <= end_date_obj:
            # Generate random boolean data for the week
            data_json = {}
            for i in range(7): # 7 days in a week
                day = start_date_obj + timedelta(days=i)
                day_str = day.strftime('%Y-%m-%d')
                data_json[day_str] = bool(random.getrandbits(1)) # random boolean

            # Create a HabitData object
            habit_data = HabitData(habit_id=habit_id, start_date=start_date_obj, data=data_json)
            print(habit_data)

            # Add to session
            db.session.add(habit_data)

            # Move to the next Sunday
            start_date_obj += timedelta(weeks=1)

        # Commit the transaction
        db.session.commit()
        print("committed")

        return "Habit data updated", 200
        # #1,2023-08-15,{"2023-08-15": true, "2023-08-16": false}
        # habit_id = 1
        # start_date = "2023-08-13"
        # data_string = "{\"2023-08-13\": true, \"2023-08-16\": false}"

        # # Parse the date and JSON data
        # start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        # data_json = json.loads(data_string)

        # # Create a HabitData object
        # habit_data = HabitData(habit_id=habit_id, start_date=start_date_obj, data=data_json)
        # print(habit_data)

        # # Add to session
        # db.session.add(habit_data)

        # # Commit the transaction
        # db.session.commit()
        # print("commited")

        # return "Habit data updated", 200       

    @app_bp.route('/update-habits', methods=['POST']) 
    def update_habits():
        pass
        
    @app_bp.route('/get-habit-data/<int:habit_id>')
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

    @app_bp.route('/get-habit-descriptors/<int:user_id>', methods=['GET'])
    def get_habits(user_id):
        page = request.args.get(key='page', default=1, type=int)
        per_page = request.args.get(key='per_page', default=3, type=int)

        user = User.query.get(user_id)
        if user:
            return jsonify(
                habits=[habit.get_habit_descriptor() for habit in user.habits]
            )
        else:
            return jsonify(error='User not found'), 404

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


def insert_test_data_helper():
    pass

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