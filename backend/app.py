from flask import Flask, request, jsonify
import pickle
import re
from nltk.corpus import stopwords
import nltk
from flask_cors import CORS
import os

base_path = os.path.dirname(__file__)
# Download stopwords (only first time)
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Chrome extension

# Load trained model and TF-IDF
model = pickle.load(open(os.path.join(base_path, "toxicity_model.pkl"), "rb"))
tfidf = pickle.load(open(os.path.join(base_path, "tfidf_vectorizer.pkl"), "rb"))

# Text cleaning function (same as notebook)
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    words = text.split()
    words = [word for word in words if word not in stop_words]
    return " ".join(words)


@app.route('/')
def home():
    return "API is running"
# API route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        comment = data.get('comment', '')

        # Preprocess
        cleaned = clean_text(comment)

        # Convert to vector
        vector = tfidf.transform([cleaned])

        # Predict
        prediction = model.predict(vector)[0]

        return jsonify({
            "comment": comment,
            "toxic": bool(prediction)
        })

    except Exception as e:
        return jsonify({"error": str(e)})
    

# Run server
if __name__ == "__main__":
    app.run(debug=True, port=5000)