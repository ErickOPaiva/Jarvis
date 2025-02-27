import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERRO: Chave da API OpenAI não encontrada no arquivo .env")
else:
    print("Chave da API OpenAI carregada com sucesso")

app = Flask(__name__)
CORS(app)  

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        print(f"Dados recebidos: {data}")
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "Mensagem vazia"}), 400
        
        if not api_key:
            return jsonify({"error": "Chave API não configurada"}), 500
            
        client = openai.OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente útil."},
                {"role": "user", "content": user_message}
            ]
        )
        
        bot_response = response.choices[0].message.content
        
        return jsonify({"response": bot_response})
    
    except Exception as e:
        print(f"ERRO: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"status": "ok", "message": "API funcionando"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)