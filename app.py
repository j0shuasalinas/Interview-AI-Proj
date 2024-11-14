from flask import Flask, request, jsonify, render_template
import openai
import os

app = Flask(__name__)

# Set up your OpenAI API key
openai.api_key = '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'
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
        {"role": "system", "content": "You are a chatbot assisting with job interview preparation. Provide a relevant leet code problem only if it would help the user."},
        {"role": "user", "content": f"The user says: '{user_message}' and their code: '{code}'. Make sure to help them"}
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

