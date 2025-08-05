from flask import render_template, redirect, url_for, request, Blueprint ,jsonify
from . import db
from .utils import format_response
import os
import logging
from flask_mail import Mail, Message
import time
from app.models import db, Report
from flask import current_app
from flask_cors import CORS
import boto3
from app.services import add_certifications, add_feedback, create_checkout_session, get_certification_by_id , get_certifications , delete_certification, get_course, get_feedbacks, get_instructors, show_entries, stripe_webhook, submit_report, test_email, update_certification, get_bestsellers, verify_payment
from secrets import token_hex



bp = Blueprint('main', __name__)
CORS(bp)

mail = Mail()
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@bp.route('/api/hello')
def index():
    return "Welcome to the Certification Portal"



# -----------------------------------------------
# certification api:

@bp.route('/api/get_certifications', methods=['GET'])
def get_certifications_route():
    start_time = time.time()
    data = get_certifications()
    duration = time.time() - start_time
    print(f"/api/get_certifications took {duration:.3f} seconds")
    # Optionally, include latency info in the response headers:
    response = jsonify(data)
    response.headers['X-Response-Time'] = f"{duration:.3f}s"
    return response

@bp.route('/api/add_certification', methods=['POST'])
def add_certifications_route():
    data = request.get_json()
    return add_certifications()
@bp.route('/api/delete_certification/<int:cert_id>', methods=['DELETE'])
def delete_certification_route(cert_id):
    return delete_certification(cert_id)

@bp.route('/api/update_certification/<int:cert_id>', methods=['PUT'])
def update_certification_route(cert_id):
    return update_certification(cert_id)

@bp.route("/api/get_certification/<int:course_id>", methods=["GET"])
def get_course_route(course_id):
    return get_certification_by_id(course_id)

@bp.route('/api/get_bestsellers', methods=['GET'])
def get_bestsellers_route():
    return get_bestsellers()


# -------------------------------
# feedback api:

@bp.route('/api/get_feedbacks', methods=['GET'])
def get_feedbacks_route():
    return get_feedbacks()

@bp.route('/api/add_feedback', methods=['POST'])
def add_feedback_route():
    return add_feedback()

# ------------------------
# instructor api:

@bp.route('/api/get_instructors', methods=['GET'])
def get_instructors_route():
    return get_instructors()

# --------------------------------------
# payment api:

@bp.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session_route():
    return create_checkout_session()

@bp.route('/api/webhook/stripe', methods=['POST'])
def stripe_webhook_route():
    return stripe_webhook()

@bp.route('/api/test-email', methods=['GET'])
def test_email_route():
    return test_email()
    
@bp.route('/api/verify-payment', methods=['POST', 'OPTIONS'])
def verify_payment_route():
    return verify_payment()
# --------------------------------------------------------------

# report api:

@bp.route('/api/report', methods=['POST'])
def submit_report_route():
    return submit_report()


@bp.route('/api/entries')
def show_entries_route():
    return show_entries()
