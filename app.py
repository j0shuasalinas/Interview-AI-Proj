from flask import Flask, request, jsonify, render_template
import openai
import os

app = Flask(__name__)

# Set up your OpenAI API key
openai.api_key = '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'  # Replace this with your actual API key

@app.route('/')
def index():
    return render_template('index.html')  # Make sure this points to your HTML file

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    code = data.get('code', '')

    # Adjust the prompt format for chat-based models
    messages = [
        {"role": "system", "content": "You are a job interview chatbot."},
        {"role": "user", "content": f"The user says: '{user_message}' and their code: '{code}'."}
    ]

    try:
        # Make the API call to the chat completion endpoint
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Using chat model
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        
        # Extract and return the chatbot's reply
        gpt_response = response['choices'][0]['message']['content'].strip()
        return jsonify({'response': gpt_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

