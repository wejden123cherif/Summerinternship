from flask import render_template, redirect, url_for, request, Blueprint
from . import db
from .models import User, Certification, Quiz, Job
from .utils import format_response
import os
import boto3
from app.services import add_certifications, add_feedback , get_certifications , delete_certification, get_feedbacks, update_certification, get_bestsellers
from flask_cors import CORS


bp = Blueprint('main', __name__)
CORS(bp)

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
@bp.route('/delete_certification/<int:cert_id>', methods=['DELETE'])
def delete_certification_route(cert_id):
    return delete_certification(cert_id)

@bp.route('/update_certification/<int:cert_id>', methods=['PUT'])
def update_certification_route(cert_id):
    return update_certification(cert_id)

@bp.route('/get_bestsellers', methods=['GET'])
def get_bestsellers_route():
    return get_bestsellers()

@bp.route('/get_feedbacks', methods=['GET'])
def get_feedbacks_route():
    return get_feedbacks()

@bp.route('/add_feedback', methods=['POST'])
def add_feedback_route():
    return add_feedback()