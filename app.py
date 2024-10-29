from flask import Flask, request, jsonify, render_template
import openai
import os

app = Flask(__name__)

# Set up your OpenAI API key
openai.api_key = ''  # Replace this with your actual API key

@app.route('/')
def index():
    return render_template('index.html')  # Make sure this points to your HTML file

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    code = data.get('code', '')

    prompt = (
        "You are a job interview chatbot. "
        f"The user says: '{user_message}' and their code: '{code}'. "
        "Provide helpful feedback, suggestions, or answers based on this context."
    )

    try:
        response = openai.Completion.create(
            model="gpt-3.5-turbo",  # Use GPT-3.5
            prompt=prompt,
            max_tokens=150,
            temperature=0.7,
            n=1,
            stop=None
        )
        gpt_response = response.choices[0].text.strip()
        return jsonify({'response': gpt_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
