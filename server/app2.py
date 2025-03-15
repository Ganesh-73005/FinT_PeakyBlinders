from flask import Flask, request, jsonify
import joblib
import pandas as pd
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained spam classifier model
model_filename = "spam_classifier.pkl"
loaded_model = joblib.load(model_filename)

# Load phishing dataset
phishing_data = pd.read_csv("phishing_urls.csv")

# Extract phishing URLs
phishing_urls = set(phishing_data["url"])

def extract_links(text):
    """Extracts URLs from a given text using regex."""
    url_pattern = r"(https?://\S+|www\.\S+)"
    return re.findall(url_pattern, text)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    messages = data.get("messages", [])

    if not messages or not isinstance(messages, list):
        return jsonify({"error": "Invalid input. Provide a list of messages."}), 400

    results = []
    for msg in messages:
        # Predict spam or ham
        spam_prediction = loaded_model.predict([msg])[0]
        is_spam = "scam" if spam_prediction == "spam" else "safe"

        # Extract links
        extracted_links = extract_links(msg)
        
        detected_links = []
        
        for link in extracted_links:
            print(link)
            
            if link in phishing_urls:
                print("a")
                detected_links.append("suspicious")
            else:
                detected_links.append("safe")

        # Format response
        result = {
            "message": is_spam,
            "detected_links": detected_links if detected_links else "no links found"
        }
        results.append(result)

    return jsonify(results)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)