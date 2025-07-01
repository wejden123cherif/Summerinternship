from . import db
from flask_login import UserMixin



class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Certification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    quizzes = db.relationship('Quiz', backref='certification', lazy=True)
    instructor = db.Column(db.String(100), nullable=True)
    price = db.Column(db.Float, nullable=True)
    sessions_nbre = db.Column(db.Integer, nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    student_count = db.Column(db.Integer, default=0)
    # rating = db.Column(db.Float, default=0.0)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'), nullable=False)
    question = db.Column(db.String(200), nullable=False)
    options = db.Column(db.String(200), nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.Float, nullable=True)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    url = db.Column(db.String(200), nullable=True)