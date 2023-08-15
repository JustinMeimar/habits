from database import db
from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

class User(db.Model): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(30), nullable=False)
    password_hash = db.Column(db.String(128)) 
    email = db.Column(db.String(75))

    habits = relationship('Habit', backref='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'habits': [habit.to_dict() for habit in self.habits]
        }
        
class HabitType(db.Model): 
    __tablename__ = "habit_type"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(30), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type
        }

class Habit(db.Model):
    __tablename__ = "habit"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    type_id = db.Column(db.Integer, db.ForeignKey('habit_type.id'))

    habit_title = db.Column(db.String(30)) 
    habit_data = relationship('HabitData', backref='habit')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type_id': self.type_id,
            'habit_title': self.habit_title,
            'habit_data': [data.to_dict() for data in self.habit_data]
        }

class HabitData(db.Model): 
    __tablename__ = "habit_data"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'))
    start_date = db.Column(db.Date)
    data = db.Column(JSON)

    Index('idx_habit_id', habit_id)
    Index('idx_date', start_date)
    Index('idx_habit_date', habit_id, start_date)

    def to_dict(self):
        return {
            'id': self.id,
            'habit_id': self.habit_id,
            'start_date': self.start_date.isoformat(),
            'data': self.data
        }