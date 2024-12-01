from flask import Flask, request, jsonify, render_template
import openai
import os
import subprocess
import random

app = Flask(__name__)

# Set up your OpenAI API key (Note: Store API keys in environment variables for security)
openai.api_key = 'proj-JGqTy7jUx6rXveWL7_laaRCBqlR1WLjvKjkKhbUTVJ0qp1X9J40BID9h1GiH5DIQQ-KVaY4cIJT3BlbkFJ8kW45uL8XDk2iU3DJZhSCLgjwxJ0FewxRNgXLTjAyWdtPNXSxxEcDAD4X3QkV3nWrsiekZJ8UA'

# File containing Python questions
QUESTIONS_FILE = "python_question.txt"

# Utility function to load questions from the file
def load_questions():
    try:
        with open(QUESTIONS_FILE, 'r') as file:
            questions = [line.strip() for line in file if line.strip()]
        return questions
    except FileNotFoundError:
        return ["Could not find the question file."]  # Fallback message

# Serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to execute Python code
@app.route('/run_code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get("code", "")

    try:
        # Execute the Python code in a safe environment
        result = subprocess.run(['python3', '-c', code], capture_output=True, text=True, check=True)
        return jsonify({"output": result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({"output": e.stderr})

# Handle chat-based interactions
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    code = data.get('code', '')

    if code:  # If code is provided, run it
        try:
            result = run_python_code(code)
            return jsonify({'response': result})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Load Python questions from the file
    questions = load_questions()
    
    # Select a random question from the file
    selected_question = random.choice(questions)

    # Construct chatbot response
    messages = [
        {"role": "system", "content": "You are a Python mock interview chatbot."},
        {"role": "user", "content": f"The user says: '{user_message}'. Ask a Python-related question: {selected_question}"}
    ]

    try:
        # Call the OpenAI API for chat-based responses
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Using chat model
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )

        gpt_response = response['choices'][0]['message']['content'].strip()
        return jsonify({'response': gpt_response, 'question': selected_question})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Utility function to run Python code
def run_python_code(code):
    try:
        result = subprocess.run(['python3', '-c', code], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return e.stderr

if __name__ == '__main__':
    app.run(debug=True)
