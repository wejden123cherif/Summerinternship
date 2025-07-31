from flask import render_template, redirect, url_for, request, Blueprint ,jsonify
from . import db
from .models import User, Certification, Quiz, Job ,PaymentLog
from .utils import format_response
import os
import logging
import stripe
from flask_mail import Mail, Message
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
from sqlalchemy.exc import IntegrityError
import time
from app.models import db, Report

from flask import current_app

mail = Mail()
from flask_cors import CORS
import boto3
from app.services import add_certifications, add_feedback , get_certifications , delete_certification, get_course, get_feedbacks, get_instructors, update_certification, get_bestsellers
from flask_cors import CORS
from secrets import token_hex

bp = Blueprint('main', __name__)
CORS(bp)

@bp.route('/hello')
def index():
    return "Welcome to the Certification Portal"

@bp.route('/get_certifications', methods=['GET'])
def get_certifications_route():
    start_time = time.time()
    data = get_certifications()
    duration = time.time() - start_time
    print(f"/get_certifications took {duration:.3f} seconds")
    # Optionally, include latency info in the response headers:
    response = jsonify(data)
    response.headers['X-Response-Time'] = f"{duration:.3f}s"
    return response

@bp.route('/add_certification', methods=['POST'])
def add_certifications_route():
    data = request.get_json()
    return add_certifications()
@bp.route('/delete_certification/<int:cert_id>', methods=['DELETE'])
def delete_certification_route(cert_id):
    return delete_certification(cert_id)

@bp.route('/update_certification/<int:cert_id>', methods=['PUT'])
def update_certification_route(cert_id):
    return update_certification(cert_id)

@bp.route("/get_certification/<int:course_id>", methods=["GET"])
def get_course_route(course_id):
    return get_course(course_id)

@bp.route('/get_bestsellers', methods=['GET'])
def get_bestsellers_route():
    return get_bestsellers()

@bp.route('/get_feedbacks', methods=['GET'])
def get_feedbacks_route():
    return get_feedbacks()

@bp.route('/add_feedback', methods=['POST'])
def add_feedback_route():
    return add_feedback()


@bp.route('/get_instructors', methods=['GET'])
def get_instructors_route():
    return get_instructors()


@bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.get_json()
        logger.debug(f"Received data: {data}")

        certificate_id = data.get('certificate_id')
        promo_code = data.get('promo_code')  # Optional, can be entered in Stripe checkout

        if not certificate_id:
            return jsonify({'error': 'Certificate ID is required'}), 400

        certificate = Certification.query.get(certificate_id)
        if not certificate:
            return jsonify({'error': 'Certificate not found'}), 404

        base_price = max(certificate.price or 0, 1.84)

        # Validate promotion code if provided
        promotion_code_id = None
        if promo_code:
            try:
                promotion_codes = stripe.PromotionCode.list(code=promo_code, active=True)
                if not promotion_codes.data:
                    return jsonify({'error': 'Invalid or expired promotion code'}), 400
                promotion_code_id = promotion_codes.data[0].id
                logger.debug(f"Validated promo code: {promotion_code_id}")
            except stripe.error.StripeError as e:
                logger.error(f"Stripe error while validating promo code: {str(e)}")
                return jsonify({'error': 'Error validating promotion code'}), 400

        # Create the Checkout session (email collected by Stripe)
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            mode='payment',
            success_url='http://frontend-service:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://frontend-service:3000/cancel',
            billing_address_collection='required',
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': int(base_price * 100),
                    'product_data': {'name': certificate.name}
                },
                'quantity': 1,
            }],
            discounts=[{'promotion_code': promotion_code_id}] if promotion_code_id else [],
            allow_promotion_codes=True,  # ✅ Shows promo field on Stripe Checkout page

            metadata={'certificate_id': str(certificate_id), 'promo_code': promo_code or ''},
            payment_intent_data={'setup_future_usage': 'off_session'}
        )

        logger.info(f"Stripe Checkout session created: {session.id}")
        return jsonify({'sessionId': session.id, 'url': session.url})

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in create-checkout-session: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@bp.route('/webhook/stripe', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        logger.info(f"Received webhook event: {event['type']}")
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({'error': 'Invalid payload or signature'}), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        logger.debug(f"Webhook session data: {session}")
        certificate_id = session.get('metadata', {}).get('certificate_id')
        promo_code = session.get('metadata', {}).get('promo_code')
        customer_email = session.get('customer_details', {}).get('email') or session.get('customer_email')

        if not customer_email:
            logger.error("No customer email found in session")
            return jsonify({'error': 'Customer email missing'}), 400

        if PaymentLog.query.get(event['id']):
            logger.info(f"Event {event['id']} already processed")
            return jsonify({'status': 'already_processed'}), 200

        # Update certificate
        if certificate_id:
            certificate = Certification.query.get(certificate_id)
            if certificate:
                certificate.student_count += 1
                db.session.commit()
                logger.info(f"Updated student count for certificate {certificate.name}")

        # Generate username and access code
        username = f"user_{token_hex(4)}"
        access_code = token_hex(8)

        # Send email
        msg = Message(
            subject='Your Course Enrollment Confirmation',
            sender=os.getenv('MAIL_USERNAME'),
            recipients=[customer_email]
        )
        msg.body = f"""
        Welcome!

        Thank you for your successful payment.
        Your username: {username}
        Your access code: {access_code}
        Please keep this code safe for accessing your course.
        """
        msg.html = f"""
        <h2>Welcome!</h2>
        <p>Thank you for your successful payment.</p>
        <p>Your username: <strong>{username}</strong></p>
        <p>Your access code: <strong>{access_code}</strong></p>
        <p>Please keep this code safe for accessing your course.</p>
        """
        try:
            mail.send(msg)
            logger.info(f"Email sent to {customer_email} with username {username} and code {access_code}")
        except Exception as e:
            logger.error(f"Failed to send email to {customer_email}: {e}", exc_info=True)
            return jsonify({'error': f'Email sending failed: {str(e)}'}), 500

        # Add user to database
        new_user = User(email=customer_email, username=username)
        new_user.set_password(access_code)
        if certificate:
            certificate.users.append(new_user)
        db.session.add(new_user)
        try:
            db.session.commit()
            logger.info(f"User {username} added to database for certificate {certificate_id}")
        except IntegrityError:
            db.session.rollback()
            logger.error(f"Failed to add user {username} to database due to integrity error")
            return jsonify({'error': 'Database error'}), 500

        # Log payment
        payment_method_id = None
        payment_intent_id = session.get('payment_intent')
        if payment_intent_id:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            payment_method_id = payment_intent.payment_method

        if payment_method_id:
            payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
            card_brand = payment_method.get('card', {}).get('brand', 'unknown')
            payment_log = PaymentLog(
                id=event['id'],
                certificate_id=certificate_id,
                event_type=event['type'],
                customer_email=customer_email,
                customer_name=session.get('customer_details', {}).get('name'),
                customer_phone=session.get('customer_details', {}).get('phone'),
                customer_address=session.get('customer_details', {}).get('address'),
                payment_method=card_brand,
                promo_code=promo_code or None
            )
            db.session.add(payment_log)
            try:
                db.session.commit()
                logger.info(f"Processed {event['type']} for certificate {certificate.name} with payment method {card_brand}")
            except IntegrityError:
                db.session.rollback()
                logger.info(f"Event {event['id']} already processed")
                return jsonify({'status': 'already_processed'}), 200

    return jsonify({'status': 'success'}), 200

    return jsonify({'status': 'success'}), 200
@bp.route('/test-email', methods=['GET'])
def test_email():
    try:
        msg = Message(
            subject='Test Email from Subul Platform',
            sender=os.getenv('MAIL_USERNAME'),
            recipients=['arijzaidi23@gmail.com']
        )
        msg.body = 'This is a test email from the Subul Platform using Flask-Mail.'
        msg.html = '<h2>Test Email</h2><p>This is a test email from the Subul Platform using Flask-Mail.</p>'
        mail.send(msg)
        logger.info('Test email sent to your_personal_email@example.com')
        return jsonify({'status': 'Test email sent'}), 200
    except Exception as e:
        logger.error(f'Failed to send test email: {str(e)}', exc_info=True)
        return jsonify({'error': f'Failed to send test email: {str(e)}'}), 500
    
@bp.route('/verify-payment', methods=['POST', 'OPTIONS'])
def verify_payment():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        session_id = data.get('sessionId')
        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400

        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            logger.info(f"Payment verified for session {session_id}")
            return jsonify({'status': 'Payment verified', 'session': session_id}), 200
        else:
            logger.warning(f"Payment not yet completed for session {session_id}")
            return jsonify({'status': 'Payment pending', 'session': session_id}), 202
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error verifying payment: {str(e)}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in verify-payment: {e}")
        return jsonify({'error': 'Internal server error'}), 500
# --------------------------------------------------------------

# report api:

# @bp.route('/api/report', methods=['POST'])
# def submit_report():
#     from flask_mail import Message
#     from app import mail  # Make sure mail is initialized in run.py and imported here

#     data = request.get_json()
#     email = data.get('email')
#     subject = data.get('subject')
#     message = data.get('message')

#     # Validate form data
#     if not email or not subject or not message:
#         return jsonify({"error": "Missing fields"}), 400

#     # Save report to the database
#     report = Report(email=email, subject=subject, message=message)
#     db.session.add(report)
#     db.session.commit()

#     # Send email notification to admin (or specific user)
#     try:
#         msg = Message(
#             subject=f"📬 New Report: {subject}",
#             sender="arijzaidi23@gmail.com",
#             recipients=["arijzaidi23@gmail.com"],  # Replace with the actual recipient
#             body=f"""
# 📩 You have received a new report submission.

# ━━━━━━━━━━━━━━━━━━━━━━━
# 👤 From:    {email}
# 📌 Subject: {subject}
# ━━━━━━━━━━━━━━━━━━━━━━━

# 📝 Message:
# {message}

# ━━━━━━━━━━━━━━━━━━━━━━━
# """
#         )
#         mail.send(msg)
#     except Exception as e:
#         print("❌ Failed to send email:", e)

#     return jsonify({"message": "Report submitted successfully"}), 201


# @bp.route('/entries')
# def show_entries():
#     entries = Report.query.all()
#     lines = [f"{entry.email} - {entry.subject} - {entry.message}" for entry in entries]
#     return "<br>".join(lines)
