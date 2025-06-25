from flask import render_template, redirect, url_for, request, Blueprint
from . import db
from .models import User, Certification, Quiz, Job
from .utils import format_response
import os
import boto3
from app.services import add_certifications , get_certifications


bp = Blueprint('main', __name__)

@bp.route('/hello')
def index():
    return "Welcome to the Certification Portal"

@bp.route('/get_certifications', methods=['GET'])
def get_certifications_route():
    return get_certifications()

@bp.route('/add_certifications', methods=['POST'])
def add_certifications_route():
    data = request.get_json()
    return add_certifications()
