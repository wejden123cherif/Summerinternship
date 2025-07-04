from .models import Certification, Feedback, User
from . import db
from flask import request, jsonify
from .utils import format_response
from flask_login import current_user,login_required


def add_certifications():
    data = request.get_json()
    if not data or 'title' not in data or not data['title'].strip():
        return format_response({"error": "Title cannot be empty"}, status=400)
    
    title = data['title'].strip()
    price = data['price'] if 'price' in data else None
    sessions_nbre = data['sessions_nbre'] if 'sessions_nbre' in data else None  
    image_url = data['image_url'] if 'image_url' in data else None
    instructor = data['instructor'] if 'instructor' in data else None

    


    existing = Certification.query.filter_by(title=title).first()
    if existing:
        return format_response({"error": "Certification already exists"}, status=409)

    new_certification = Certification(title=title,price=price,
                                      sessions_nbre=sessions_nbre,instructor=instructor,
                                      image_url=image_url,student_count=0)
    db.session.add(new_certification)
    db.session.commit()

    return format_response({
        "message": "Certification added successfully",
        "certification_id": new_certification.id
    }, status=201)

def get_certifications():
    certifications = Certification.query.all()
    result = []
    for cert in certifications:
        result.append({
            "id": cert.id,
            "title": cert.title,
            "price": cert.price,
            "instructor": cert.instructor,
            "sessions_nbre": cert.sessions_nbre,
            "image_url": cert.image_url,
            "student_count": cert.student_count
        })
    return result

def get_certification_by_id(cert_id):
    certification = Certification.query.get(cert_id)
    if not certification:
        return format_response({"error": "Certification not found"}, status=404)

    return {
        "id": certification.id,
        "title": certification.title,
        "price": certification.price,
        "instructor": certification.instructor,
        "sessions_nbre": certification.sessions_nbre,
        "image_url": certification.image_url,
        "student_count": certification.student_count
    }   

def get_bestsellers():
    certifications = Certification.query.order_by(Certification.student_count.desc()).limit(5).all()
    result = []
    for cert in certifications:
        result.append({
            "id": cert.id,
            "title": cert.title,
            "price": cert.price,
            "instructor": cert.instructor,
            "sessions_nbre": cert.sessions_nbre,
            "image_url": cert.image_url,
            "student_count": cert.student_count
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

    if 'instructor' in data:
        certification.instructor = data['instructor']
    if 'student_count' in data:
        certification.student_count = data['student_count']

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
