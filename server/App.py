from flask import Flask, request, jsonify, render_template, send_from_directory
import re
import requests
import base64
import random
import os
import tempfile
import google.generativeai as genai
import json

app = Flask(__name__)

# Constants for GST API
class CONSTANTS:
    GST_REGEX = re.compile(r'[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}')
    CAPTCHA_REGEX = re.compile(r'^([0-9]){6}$')
    GST_DETAILS_URL = "https://services.gst.gov.in/services/api/search/taxpayerDetails"
    GST_CAPTCHA_URL = "https://services.gst.gov.in/services/captcha?rnd="
    INVALID_GST_CODE = "SWEB_9035"
    INVALID_CAPTCHA_CODE = "SWEB_9000"
    CAPTCHA_COOKIE_STRING = "CaptchaCookie"

# OCR API Key
API_KEY = "K83865748488957"
OCR_URL = "https://api.ocr.space/parse/image"

# Gemini API Key (Replace with your actual Gemini API key)
GEMINI_API_KEY = "AIzaSyCSJWkgLJxmlVyPRxzinCueAXugCxXjM9Q"

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Create the Gemini model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel("gemini-1.5-pro")

# Ensure the uploads directory exists
UPLOADS_DIR = "uploads"
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

# Helper Functions
@app.route("/")
def index():
    return render_template("index.html")

# Serve the GST details page
@app.route("/gst")
def gst():
    return render_template("gst.html")

def valid_gst_checksum(gst_number: str) -> bool:
    gst_substring = gst_number[:14]
    factor = 2
    sum_ = 0
    cp_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    mod = len(cp_chars)
    input_chars = gst_substring.strip().upper()

    for i in range(len(input_chars) - 1, -1, -1):
        code_point = -1
        for j in range(len(cp_chars)):
            if cp_chars[j] == input_chars[i]:
                code_point = j
                break

        digit = factor * code_point
        factor = 1 if factor == 2 else 2
        digit = (digit // mod) + (digit % mod)
        sum_ += digit

    check_code_point = ((mod - (sum_ % mod)) % mod)
    return (gst_substring + cp_chars[check_code_point]) == gst_number

def valid_gst_number(gst_number: str) -> bool:
    return valid_gst_checksum(gst_number)

def extract_text_from_image(image_path):
    """Uploads an image to OCR.space API and extracts text."""
    if not os.path.exists(image_path):
        return None

    with open(image_path, "rb") as img:
        image_data = img.read()

    # Convert image to Base64
    encoded_image = base64.b64encode(image_data).decode("utf-8")

    payload = {
        "apikey": API_KEY,
        "base64Image": f"data:image/jpeg;base64,{encoded_image}",
        "language": "eng",
        "isOverlayRequired": False
    }

    # Send request to OCR.space API
    response = requests.post(OCR_URL, data=payload)
    ocr_data = response.json()
    
    print("Response from ocr: ", response)


    if ocr_data and not ocr_data.get("IsErroredOnProcessing", False):
        parsed_results = ocr_data.get("ParsedResults", [])
        for result in parsed_results:
            if result.get("FileParseExitCode") == 1:
                return result.get("ParsedText", "").strip()
    return None

def extract_gst_number(text: str) -> str:
    """Extract GST number from text using regex."""
    gst_regex = re.compile(r'[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}')
    match = gst_regex.search(text)
    if match:
        return match.group(0)
    return None

def categorize_expenses(text: str):
    """Send text to Gemini API for categorization."""
    try:
        # Start a chat session with Gemini
        chat_session = model.start_chat(history=[])

        # Define the prompt for categorization
        prompt = f"""Categorize the following expenses into general categories like travel, food, shopping, entertainment, bills, health, or other:
        {text}

        Return the response in JSON format with the following structure:
        {{
            "categories": [
                {{
                    "category": "category_name",
                    "expense": "expense_amount"
                }},
                ...
            ]
        }}"""

        # Send the prompt to Gemini
        response = chat_session.send_message(prompt)

        # Extract JSON from the response (remove Markdown code block)
        response_text = response.text
        
        print("Response from Gemini: ", response_text)

        json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        if json_match:
            json_content = json_match.group(1).strip()
            return json.loads(json_content)
        else:
            print("No JSON found in the response.")
            return None
    except Exception as e:
        print(f"Error categorizing expenses: {e}")
        return None

# Flask Routes
@app.route("/extract-and-categorize", methods=["POST"])
def extract_and_categorize():
    print("Request received")
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Save the uploaded file temporarily
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)

        # Extract text from the image
        extracted_text = extract_text_from_image(file_path)
        if not extracted_text:
            return jsonify({"error": "Failed to extract text from image"}), 400

        # Extract GST number from the text
        gst_number = extract_gst_number(extracted_text)
        if not gst_number:
            return jsonify({"error": "No GST number found in the bill"}), 400

        # Get GST captcha
        captcha_response = get_gst_captcha()
        if not captcha_response:
            return jsonify({"error": "Failed to fetch GST captcha"}), 400

        return jsonify({
            "gst_number": gst_number,
            "captcha_image": captcha_response["data"]["captcha_image"],
            "captcha_cookie": captcha_response["data"]["captcha_cookie"]
        })

@app.route("/get-gst-captcha", methods=["GET"])
def get_gst_captcha():
    try:
        url = f"{CONSTANTS.GST_CAPTCHA_URL}{random.random()}"
        captcha_response = requests.get(url, stream=True)
        base64_image = base64.b64encode(captcha_response.content).decode('utf-8')

        cookie_header = captcha_response.headers.get('Set-Cookie', '')
        captcha_cookie = ""
        for cookie in cookie_header.split(';'):
            if CONSTANTS.CAPTCHA_COOKIE_STRING in cookie:
                captcha_cookie = cookie.split('=')[1]
                break

        # Save the captcha image to the uploads directory
        captcha_filename = f"captcha_{random.randint(1000, 9999)}.png"
        captcha_filepath = os.path.join(UPLOADS_DIR, captcha_filename)
        with open(captcha_filepath, "wb") as f:
            f.write(base64.b64decode(base64_image))

        return jsonify({
            "code": captcha_response.status_code,
            "data": {
                "captcha_image": captcha_filename,
                "captcha_cookie": captcha_cookie
            }
        })
    except Exception as error:
        return jsonify({"error": str(error)}), 500

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    """Serve uploaded files."""
    return send_from_directory(UPLOADS_DIR, filename)

@app.route("/fetch-gst-details", methods=["POST"])
def fetch_gst_details():
    data = request.json
    gst_number = data.get("gst_number")
    captcha = data.get("captcha")
    captcha_cookie = data.get("captcha_cookie")

    if not gst_number or not captcha or not captcha_cookie:
        return jsonify({"error": "Missing required fields"}), 400

    if not valid_gst_number(gst_number):
        return jsonify({"error": "Invalid GST number"}), 400

    payload = {
        "gstin": gst_number,
        "captcha": captcha
    }
    headers = {
        "cookie": f"CaptchaCookie={captcha_cookie}"
    }
    gst_data_response = requests.post(CONSTANTS.GST_DETAILS_URL, json=payload, headers=headers)
    gst_data = gst_data_response.json()

    if gst_data.get("errorCode") == CONSTANTS.INVALID_GST_CODE:
        return jsonify({"error": "Invalid GST number"}), 400
    elif gst_data.get("errorCode") == CONSTANTS.INVALID_CAPTCHA_CODE:
        return jsonify({"error": "Invalid captcha"}), 400

    # Extract address from GST details
    address = gst_data.get("pradr", {}).get("adr", "")
    gst_data["address"] = address

    return jsonify(gst_data)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)