from fastapi import FastAPI, HTTPException
from preprocessServices import spamPreprocess
from pydantic import BaseModel
from preprocessServices import predict_text
from preprocessServices import predict_RNN
from pymongo import MongoClient
from backendservices import fetch_all_movies
import backendservices as bs
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime,timezone




app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



client = MongoClient("mongodb://localhost:27017/")
db = client["vitrinedb"]
collection = db["moviescol"]
users_collection = db["userscol"]

class userSpamCheck(BaseModel):
    userId: int
    userInput: str

class MLReviewCheck(BaseModel):
    userId: int
    userInput: str

class RNNReviewCheck(BaseModel):
    userId: int
    userInput: str



class Movieid(BaseModel):
    movieId: int


class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    firstName: str
    lastName: str



@app.post("/predictmail")
async def predict_Spam(spam_request: userSpamCheck):

    prediction = spamPreprocess(spam_request.userInput)





    return {"prediction": str(prediction)}



@app.post("/predictreviewML")
async def predict_reviewML(review_request: MLReviewCheck):
    prediction = predict_text(review_request.userInput)


    return {"prediction": str(prediction)}



@app.post("/predictreviewRNN")
async def predict_reviewRNN(review_request: RNNReviewCheck):
    
    prediction = predict_RNN(review_request.userInput)
    

    return {"prediction" : prediction.tolist()}




@app.get("/allmovies")
async def get_all_movies():
    movies = fetch_all_movies(db)  
    return {"movies": movies}


@app.post("/onemovie")
async def get_one_movie(idmovie: Movieid):
    movie = bs.get_movie_by_id(db, idmovie.movieId)
    return {"selectedMovie": movie}


@app.get("/allusers")
async def get_all_users():
    users = bs.fetch_all_users(db)
    return {"Users: ": users}


@app.post("/login")
async def login(login_request: LoginRequest):
    user = users_collection.find_one({"username": login_request.username})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    

    
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "profile": user.get("profile", {"firstName": "", "lastName": ""}),
        "createdAt": user.get("createdAt")
    }

@app.post("/signup")
async def signup(signup_request: SignupRequest):
    if users_collection.find_one({"username": signup_request.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if users_collection.find_one({"email": signup_request.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    new_user = {
        "username": signup_request.username,
        "email": signup_request.email,
        "passwordHash": signup_request.password,  
        "role": "user",
        "status": "active",
        "profile": {
            "firstName": signup_request.firstName,
            "lastName": signup_request.lastName
        },
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = users_collection.insert_one(new_user)
    
    return {
        "_id": str(result.inserted_id),
        "username": new_user["username"],
        "email": new_user["email"],
        "role": new_user["role"],
        "profile": new_user["profile"],
        "createdAt": datetime.now(timezone.utc).isoformat()
    }




