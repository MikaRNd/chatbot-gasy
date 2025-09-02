# Exemple de backend Flask pour le chatbot
# À déployer séparément (Heroku, Railway, etc.)

from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Réponses en malagasy (simulation d'IA)
MALAGASY_RESPONSES = [
    "Salama! Inona no azoko atao ho anao androany?",
    "Tsara ny fanontanianao! Azoko ho tanterahina izany.",
    "Mirary soa aho amin'ny andro ho avy!",
    "Misaotra anao! Mila fanampiana hafa ve ianao?",
    "Eny ary, izaho eto mba hanampy anao.",
    "Tsara ny fiainana, tsy misy olana!",
    "Ahoana ny fiainanao ankehitriny?",
    "Raha misy zavatra hafa ilainao, ampahafantaro ahy fotsiny.",
    "Faly aho mahafantatra anao!",
    "Vonona hanompo anao foana aho."
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérification de la santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint principal pour le chat"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        conversation_id = data.get('conversation_id') or str(uuid.uuid4())
        
        if not message:
            return jsonify({
                'status': 'error',
                'error': 'Message requis'
            }), 400
        
        # Simulation d'une réponse IA
        # Ici vous pourriez intégrer OpenAI, Hugging Face, etc.
        import random
        response_text = random.choice(MALAGASY_RESPONSES)
        
        # Log pour debugging
        print(f"Message reçu: {message}")
        print(f"Réponse: {response_text}")
        
        return jsonify({
            'response': response_text,
            'conversation_id': conversation_id,
            'status': 'success',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

# Dépendances (requirements.txt):
# Flask==2.3.3
# Flask-CORS==4.0.0
# python-dotenv==1.0.0

# Pour l'IA, ajoutez:
# openai==1.3.0
# requests==2.31.0