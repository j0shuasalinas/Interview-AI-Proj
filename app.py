from flask import Flask, request, jsonify, render_template
import openai
import os
import subprocess
import traceback

app = Flask(__name__)

# Set up your OpenAI API key (Note: It's a good idea to store your API key in environment variables for security)
openai.api_key = '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'

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
            result = run_python_code(code)  # Run the code through the /run_code endpoint
            return jsonify({'response': result})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Otherwise, handle as a message for the chat model
    messages = [
        {"role": "system", "content": "You are a Python mock interview chatbot."},
        {"role": "user", "content": f"The user says: '{user_message}' and their code: '{code}'."}
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
        return jsonify({'response': gpt_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Utility function to run Python code
def run_python_code(code):
    try:
        # Running the Python code with subprocess
        result = subprocess.run(['python3', '-c', code], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return e.stderr

if __name__ == '__main__':
    app.run(debug=True)
