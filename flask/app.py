from flask import Flask, request, jsonify

# from auth import *

app = Flask(__name__, static_folder="../app/b")
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Using SQLite for simplicity

# db.init_app(app)
# login_manager.init_app(app)

@app.route('/get-habits', methods=['GET'])
def get_habits():
    habit_id = request.args.get('habit_id', None)
    date = request.args.get('date', None)
    
    if habit_id is None or date is None:
        return jsonify(error="Missing parameters"), 400
    
    return jsonify(date=date, habit_id=habit_id)

from flask import send_from_directory

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")
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