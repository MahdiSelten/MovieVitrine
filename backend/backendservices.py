from bson import ObjectId

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

import math

def clean_doc(doc):
    for key, value in doc.items():
        if isinstance(value, float) and math.isnan(value):
            doc[key] = None  
        elif isinstance(value, dict):
            doc[key] = clean_doc(value) 
        elif isinstance(value, list):
            doc[key] = [clean_doc(v) if isinstance(v, dict) else v for v in value]
    return doc

def fetch_all_movies(db):
    movies = list(db.moviescol.find().limit(10))
    return [clean_doc(serialize_doc(m)) for m in movies]


def clean_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

def get_movie_by_id(db, id):
    movie = db.moviescol.find_one({"index": id})
    if movie:
        movie = clean_doc(movie)
    return movie


def fetch_all_users(db):
    users = list(db.userscol.find().limit(10))
    return [clean_doc(serialize_doc(m)) for m in users]