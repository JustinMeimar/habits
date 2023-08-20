from database import db
from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

class User(db.Model): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(30), nullable=False, unique=True)
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
    type_data = relationship('HabitType', backref='habit')

    def get_habit_descriptor(self):
        type_data = self.type_data.to_dict()
        return {
            'id': self.id,
            'title': self.habit_title,
            'type': type_data['type'],
        }

    def get_all(self, startDate=None):
        type_data = self.type_data.to_dict()
        return {
            'id': self.id,
            'title': self.habit_title,
            'type': type_data['type'],
            'weeks': [week.to_dict() for week in self.habit_data]
        }

class HabitData(db.Model): 
    __tablename__ = "habit_data"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'))
    
    # the Sunday of the week 
    start_date = db.Column(db.Date)
    data = db.Column(JSON)

    Index('idx_habit_id', habit_id)
    Index('idx_date', start_date)
    Index('idx_habit_date', habit_id, start_date)

    # def get_conditional
    def to_dict(self): 
        return {
            'start_date': self.start_date.isoformat(),
            'week_data': self.data
        }