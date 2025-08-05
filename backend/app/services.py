import os
import time
from .models import Certification, Feedback, Instructor, PaymentLog, Report, User
from . import db
from flask import request, jsonify
from .utils import format_response
from flask_mail import Message
from app import mail  # Make sure mail is initialized in run.py and imported here
import stripe
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
from sqlalchemy.exc import IntegrityError

def add_certifications():
    data = request.get_json()

    # Validate required fields
    if not data or 'title' not in data or not data['title'].strip():
        return format_response({"error": "Title cannot be empty"}, status=400)
    if 'description' not in data or not data['description'].strip():
        return format_response({"error": "Description cannot be empty"}, status=400)
    if 'instructor' not in data or not isinstance(data['instructor'], dict):
        return format_response({"error": "Instructor data must be provided"}, status=400)

    # Extract certification fields
    title = data['title'].strip()
    description = data['description'].strip()
    price = data.get('price', 0.0)
    sessions_nbre = data.get('sessions_nbre', 0)
    image_url = data.get('image_url')
    level = data.get('level')

    # Extract instructor fields
    instructor_data = data['instructor']
    name = instructor_data.get('name')
    specialization = instructor_data.get('specialization')

    if not name or not specialization:
        return format_response({"error": "Instructor name and specialization are required"}, status=400)

    # Check if the instructor already exists (e.g., by name and specialization)
    instructor = Instructor.query.filter_by(name=name, specialization=specialization).first()
    if not instructor:
        # Create instructor
        instructor = Instructor(
            name=name,
            bio=instructor_data.get('bio'),
            specialization=specialization,
            email=instructor_data.get('email')
        )
        db.session.add(instructor)
        db.session.flush()  # Get instructor.id before commit

    # Check for duplicate certification
    existing = Certification.query.filter_by(title=title).first()
    if existing:
        return format_response({"error": "Certification already exists"}, status=409)

    # Create certification
    new_certification = Certification(
        title=title,
        description=description,
        price=price,
        sessions_nbre=sessions_nbre,
        image_url=image_url,
        level=level,
        student_count=0,
        instructor_id=instructor.id
    )
    db.session.add(new_certification)
    db.session.commit()

    return format_response({
        "message": "Certification and instructor added successfully",
        "certification_id": new_certification.id,
        "instructor_id": instructor.id
    }, status=201)


def get_certifications():
    start_time = time.time()
    certifications = Certification.query.all()
    duration = time.time() - start_time
    print(f"database took {duration:.3f} seconds")
    result = []
    for cert in certifications:
        result.append({
            "id": cert.id,
            "title": cert.title,
            "price": cert.price,
            "instructor": {
                "id": cert.instructor.id,
                "name": cert.instructor.name,
                "bio": cert.instructor.bio,
                "specialization": cert.instructor.specialization,
                "email": cert.instructor.email,
                },
            "sessions_nbre": cert.sessions_nbre,
            "image_url": cert.image_url,
            "student_count": cert.student_count,
            "description":cert.description,
            "level":cert.level
        })
    duration = time.time() - start_time
    print(f"for loop took {duration:.3f} seconds")
    return result


def get_certification_by_id(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return format_response({"error": "Certification not found"}, status=404)

    return {
        "id": cert.id,
            "title": cert.title,
            "price": cert.price,
            "instructor": {
                "id": cert.instructor.id,
                "name": cert.instructor.name,
                "bio": cert.instructor.bio,
                "specialization": cert.instructor.specialization,
                "email": cert.instructor.email,
                },
            "sessions_nbre": cert.sessions_nbre,
            "image_url": cert.image_url,
            "student_count": cert.student_count,
            "description":cert.description,
            "level":cert.level

    }   

def get_bestsellers():
    certifications = Certification.query.order_by(Certification.student_count.desc()).limit(5).all()
    result = []
    for cert in certifications:
        result.append({
            "id": cert.id,
            "title": cert.title,
            "price": cert.price,
            "instructor_name": cert.instructor.name if cert.instructor else None,
            "sessions_nbre": cert.sessions_nbre,
            "image_url": cert.image_url,
            "student_count": cert.student_count,
            "description":cert.description,
            "level":cert.level
        })
    return result   

def update_certification(cert_id):
    data = request.get_json()
    title = data.get('title', '').strip()
    titles = Certification.query.filter(
        Certification.title == title,
        Certification.id != cert_id
    ).all()
    if len(titles) > 0:
        return format_response({"error": "Certification with this title already exists"}, status=409)

    certification = Certification.query.get(cert_id)
    if not certification:
        return format_response({"error": "Certification not found"}, status=404)

    if 'title' in data:
        certification.title = data['title'].strip()

    if 'price' in data:
        certification.price = data['price']

    if 'sessions_nbre' in data:
        certification.sessions_nbre = data['sessions_nbre']

    if 'image_url' in data:
        certification.image_url = data['image_url']

    if 'student_count' in data:
        certification.student_count = data['student_count']
        
    if 'description' in data:
        certification.description = data['description']
    if 'level' in data:
        certification.description = data['level']

    db.session.commit()

    return format_response({
        "message": "Certification updated successfully",
        "certification_id": certification.id
    }, status=200)
 

def delete_certification(cert_id):
    certification = Certification.query.get(cert_id)
    if not certification:
        return format_response({"error": "Certification not found"}, status=404)

    db.session.delete(certification)
    db.session.commit()

    return format_response({"message": "Certification deleted successfully"}, status=200)


def get_course(cert_id):
    certification = Certification.query.get(cert_id)
    if not certification:
        return format_response({"error": "Certification not found"}, status=404)
    return {
        "id": certification.id, 
        "title": certification.title,
        "price": certification.price,
        "instructor_name": certification.instructor.name if certification.instructor else None,
        "sessions_nbre": certification.sessions_nbre,
        "image_url": certification.image_url,
        "student_count": certification.student_count,
        "description": certification.description,
        "level":certification.level
    }

# ----------------------------------------------------------------------------------------------
# Feedback Service:

def get_feedbacks():
    feedbacks = Feedback.query.all()
    results = []
    for feedback in feedbacks:
        results.append({
            "id": feedback.id,
            "username": feedback.username,
            "userimage": feedback.userimage,
            "comment": feedback.comment
        })
    for result in results:
        user = User.query.get(result["username"])    
        result["username"] = user.username if user else "Unknown User"
        result["userimage"] = user.profession if user else "Unknown Image"
    return results

def add_feedback():
    data = request.get_json()
    comment = data.get("comment")
    username = data.get("username")
    userimage = data.get("userimage")

    if not comment:
        return jsonify({"error": "Comment is required"}), 400

    new_feedback = Feedback(username=username, comment=comment, userimage=userimage)
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback added successfully",
        "feedback": {
            "id": new_feedback.id,
            "userimage": userimage,
            "username": username,
            "comment": new_feedback.comment,
        }
    }), 201


# ---------------------------------------------------------------
# Instructor service:

def get_instructors():
    Instructors = Instructor.query.all()
    result = []
    for instr in Instructors:
        result.append({
            "id": instr.id,
            "name": instr.name,
            "bio": instr.bio,
            "specialization": instr.specialization,
            "email": instr.email,
            "certifications": [ 
                    {
                        "id": cert.id,
                        "title": cert.title,
                        "description": cert.description,
                        "price": cert.price,
                        "sessions_nbre": cert.sessions_nbre,
                        "image_url":cert.image_url,
                        "level": cert.level,
                        "student_count": cert.student_count,
                        "instructor_id": cert.instructor_id
                    }
                    for cert in instr.certifications
                ]
        })
    return result
# -----------------------------------------
# report:

def submit_report():
    
    data = request.get_json()
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    # Validate form data
    if not email or not subject or not message:
        return jsonify({"error": "Missing fields"}), 400

    # Save report to the database
    report = Report(email=email, subject=subject, message=message)
    db.session.add(report)
    db.session.commit()

    # Send email notification to admin (or specific user)
    try:
        msg = Message(
            subject=f"📬 New Report: {subject}",
            sender="arijzaidi23@gmail.com",
            recipients=["arijzaidi23@gmail.com"],  # Replace with the actual recipient
            body=f"""
📩 You have received a new report submission.

━━━━━━━━━━━━━━━━━━━━━━━
👤 From:    {email}
📌 Subject: {subject}
━━━━━━━━━━━━━━━━━━━━━━━

📝 Message:
{message}

━━━━━━━━━━━━━━━━━━━━━━━
"""
        )
        mail.send(msg)
    except Exception as e:
        print("❌ Failed to send email:", e)

    return jsonify({"message": "Report submitted successfully"}), 201


def show_entries():
    entries = Report.query.all()
    lines = [f"{entry.email} - {entry.subject} - {entry.message}" for entry in entries]
    return "<br>".join(lines)


# -----------------------------------------------------------------------
# payment:
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