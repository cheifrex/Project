import openai
import os
from flask import Flask, Blueprint, request, jsonify, render_template
from dotenv import load_dotenv
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(dotenv_path='.env')
OPENAI_API_KEY = os.getenv("dkfn")

openai.api_key = OPENAI_API_KEY

# Create Blueprint for resume-related API routes
resume_api = Blueprint('resume_api', __name__)

@resume_api.route('/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.get_json()

        # Extract fields from request data
        name = data.get("name")
        contact = data.get("contact")
        address = data.get("address")
        objective = data.get("objective")
        work_experience = data.get("workExperience", [])
        education = data.get("education", [])
        hobbies = data.get("hobbies", [])

        # Validate required fields
        if not name or not contact or not address or not objective:
            return jsonify({"error": "Missing required fields"}), 400

        # Build the prompt
        prompt = "Generate a professional resume with the following details:\n"
        if name: prompt += f"Name: {name}\n"
        if contact: prompt += f"Contact: {contact}\n"
        if address: prompt += f"Address: {address}\n"
        if objective: prompt += f"Objective: {objective}\n"
        if work_experience: prompt += f"Work Experience: {', '.join(work_experience)}\n"
        if education: prompt += f"Education: {', '.join(education)}\n"
        if hobbies: prompt += f"Hobbies: {', '.join(hobbies)}\n"

        # Call OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1000,
            temperature=0.7,
        )
        generated_resume = response.choices[0].text.strip()

        return jsonify({"generated_resume": generated_resume})

    except openai.error.AuthenticationError as e:
        logger.error(f"Authentication error: {e}")
        return jsonify({"error": "Invalid OpenAI API key."}), 401
    except openai.error.RateLimitError as e:
        logger.error(f"Rate limit error: {e}")
        return jsonify({"error": "Rate limit exceeded. Try again later."}), 429
    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI error: {e}")
        return jsonify({"error": "An OpenAI API error occurred. Please try again later."}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

# Register Blueprint
app.register_blueprint(resume_api, url_prefix="/api")

@app.route("/")
def home():
    return render_template("resume-generator.html")

if app.debug:
    @app.route("/test-api", methods=["GET"])
    def test_openai_api():
        try:
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt="Write a professional resume.",
                max_tokens=500
            )
            return jsonify({"test_result": response.choices[0].text.strip()})
        except openai.error.OpenAIError as e:
            return jsonify({"error": f"OpenAI API test failed: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
