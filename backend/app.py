from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Initialize Flask
app = Flask(__name__)
CORS(app)  # allow frontend (localhost:3000) to call this backend

# Load models once (slow, but cached)
toxic_model = pipeline("text-classification", model="unitary/toxic-bert", top_k=None)
sentiment_model = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

def classify_message(text):
    result = {}

    # Toxic model
    toxic_preds = toxic_model(text)[0]
    toxic_dict = {item['label']: item['score'] for item in toxic_preds}

    if toxic_dict.get("toxic", 0) > 0.5:
        if toxic_dict.get("severe_toxic", 0) > 0.3:
            result['label'] = "dangerous"
        elif toxic_dict.get("insult", 0) > 0.3 or toxic_dict.get("obscene", 0) > 0.3:
            result['label'] = "abusive"
        elif toxic_dict.get("threat", 0) > 0.2:
            result['label'] = "harassment"
        else:
            result['label'] = "abusive"
    else:
        sentiment = sentiment_model(text)[0]
        if sentiment['label'] == "NEGATIVE" and "positive words" in text.lower():
            result['label'] = "sarcasm"
        else:
            result['label'] = "safe"

    return result

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    text = data.get("text", "")
    result = classify_message(text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
