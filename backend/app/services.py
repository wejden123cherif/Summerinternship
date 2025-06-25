from .models import Certification
from . import db
from flask import request
from .utils import format_response

def add_certifications():
    data = request.get_json()
    if not data or 'title' not in data or not data['title'].strip():
        return format_response({"error": "Title is required"}, status=400)
    
    title = data['title'].strip()

    existing = Certification.query.filter_by(title=title).first()
    if existing:
        return format_response({"error": "Certification already exists"}, status=409)

    new_certification = Certification(title=title)
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
            "title": cert.title
        })
    return result