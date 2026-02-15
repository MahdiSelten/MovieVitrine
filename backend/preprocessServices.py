from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
import joblib
from nltk.tokenize import word_tokenize
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model, model_from_json
import json



lemmatizer = WordNetLemmatizer()
ps = PorterStemmer()


final_model = joblib.load("SVCIterationModel.joblib")
vectorizer = joblib.load("spamvectorizer.joblib")
model = joblib.load("MLReviewModel.joblib")


with open("word_index.json", "r") as f:
    word_index = json.load(f)



def spamPreprocess(userInput):
    tokens = userInput.lower().split() 

    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    tokens = [ps.stem(word) for word in tokens]

    processed_text = " ".join(tokens)

    transformed = vectorizer.transform([processed_text])

    prediction = final_model.predict(transformed)

    return prediction






def preprocess_text_review_ML(text):
 
    tokens = word_tokenize(text.lower())
    
    cleaned_tokens = [
        ps.stem(lemmatizer.lemmatize(w)) 
        for w in tokens 
        if w.isalpha()
    ]
    
    return " ".join(cleaned_tokens)


def predict_text(text):
    
    cleaned_text = preprocess_text_review_ML(text)
    
    pred_label = model.predict([cleaned_text])[0]
    pred_proba = model.predict_proba([cleaned_text])[0]  
    
    return {
        'text': text,
        'predicted_label': pred_label,
        'prob_class_0': pred_proba[0],
        'prob_class_1': pred_proba[1]
    }


def RNNModel_load():
    with open("RNNModel/config.json", "r") as f:
        modeljson = model_from_json(f.read())
        modeljson.load_weights("RNNModel/model.weights.h5")
        return modeljson





def preprocess_text_RNN(text):
    tokens = word_tokenize(text.lower())
    
    seq = [word_index.get(word, 0) for word in tokens]

    seq_padded = pad_sequences([seq], maxlen=100, padding='post')
    return seq_padded


def predict_RNN(text):
    RNNModel = RNNModel_load()
    preprocessed_seq = preprocess_text_RNN(text)


    prediction = RNNModel.predict(preprocessed_seq)
    return prediction