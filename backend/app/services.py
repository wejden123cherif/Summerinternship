import time
from .models import Certification, Feedback, Instructor, User
from . import db
from flask import request, jsonify
from .utils import format_response
from flask_login import current_user,login_required


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
        "description":certification.description,
        "level":certification.level

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
            "user_id": feedback.user_id,
            "comment": feedback.comment
        })
    for result in results:
        user = User.query.get(result["user_id"])    
        result["username"] = user.username if user else "Unknown User"
        result["profession"] = user.profession if user else "Unknown Profession"
    return results

# @login_required
def add_feedback():
    data = request.get_json()
    comment = data.get("comment")
    username = data.get("username")
    profession = data.get("profession")
    user_id = data.get("user_id")

    if not comment:
        return jsonify({"error": "Comment is required"}), 400

    # current_user is the logged-in user instance
    new_feedback = Feedback(user_id=current_user.id, comment=comment)
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback added successfully",
        "feedback": {
            "id": new_feedback.id,
            "user_id": user_id,
            "username": username,
            "profession": profession,
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
