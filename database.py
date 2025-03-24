from flask_sqlalchemy import SQLAlchemy # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash # type: ignore
from datetime import datetime
import pymysql # type: ignore

# Configure PyMySQL to be used with SQLAlchemy
pymysql.install_as_MySQLdb()

# Initialize the database
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Define relationship with other tables
    workouts = db.relationship('Workout', backref='user', lazy=True, cascade="all, delete-orphan")
    workout_plans = db.relationship('WorkoutPlan', backref='user', lazy=True, cascade="all, delete-orphan")
    progress_records = db.relationship('Progress', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Set the password hash from the provided password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the hash"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update the last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at,
            'last_login': self.last_login
        }

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    duration = db.Column(db.Integer, nullable=True)  # Duration in minutes
    calories_burned = db.Column(db.Integer, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __repr__(self):
        return f'<Workout {self.title}>'
    
    def to_dict(self):
        """Convert workout object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date,
            'duration': self.duration,
            'calories_burned': self.calories_burned,
            'completed': self.completed,
            'user_id': self.user_id
        }

class WorkoutPlan(db.Model):
    __tablename__ = 'workout_plans'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Define many-to-many relationship with workouts
    workouts = db.relationship('Workout', secondary='plan_workout', backref=db.backref('plans', lazy='dynamic'))
    
    def __repr__(self):
        return f'<WorkoutPlan {self.title}>'
    
    def to_dict(self):
        """Convert workout plan object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'user_id': self.user_id,
            'workouts': [workout.to_dict() for workout in self.workouts]
        }

# Association table for many-to-many relationship between WorkoutPlan and Workout
plan_workout = db.Table('plan_workout',
    db.Column('plan_id', db.Integer, db.ForeignKey('workout_plans.id'), primary_key=True),
    db.Column('workout_id', db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
)

class Progress(db.Model):
    __tablename__ = 'progress'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    weight = db.Column(db.Float, nullable=True)  # in kg
    height = db.Column(db.Float, nullable=True)  # in cm
    notes = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __repr__(self):
        return f'<Progress {self.date}>'
    
    def to_dict(self):
        """Convert progress object to dictionary"""
        return {
            'id': self.id,
            'date': self.date,
            'weight': self.weight,
            'height': self.height,
            'notes': self.notes,
            'user_id': self.user_id
        }