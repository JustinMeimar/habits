from flask import Flask, request

# from auth import *

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Using SQLite for simplicity

# db.init_app(app)
# login_manager.init_app(app)

@app.route('/get-habits')
def get_habits():
    """
    query parameters:
    habit_id: the habit_id from the DB we want to retrieve the data fro
    week_no: the week_no to retreive for  
    year: the year to retrieve for 
    """
    habit_id = request.args.get('habit_id', None)
    week_no = request.args.get('week_no', None)
    year = request.args.get('year', None)

    assert habit_id is not None and year is not None

    if week_no == None:
        week_no = 1

    return f"{week_no}, {habit_id}, {year}"

@app.route("/")
def index():
    return "Hello, flask"
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
    app.run(debug=True)