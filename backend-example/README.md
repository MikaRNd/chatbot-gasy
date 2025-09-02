# Backend Flask pour Chatbot Malagasy

## Installation locale

```bash
cd backend-example
pip install flask flask-cors python-dotenv
python app.py
```

Le backend sera disponible sur `http://localhost:5000`

## Déploiement

### Option 1: Railway
1. Créer un compte sur [Railway](https://railway.app)
2. Connecter votre repo GitHub
3. Déployer automatiquement

### Option 2: Heroku
1. Créer un `Procfile`:
```
web: python app.py
```
2. Déployer sur Heroku

### Option 3: Render
1. Créer un compte sur [Render](https://render.com)
2. Connecter votre repo
3. Configurer le service web

## Intégration IA

Pour ajouter une vraie IA, modifiez la fonction `chat()` dans `app.py`:

```python
import openai

openai.api_key = "your-api-key"

# Dans la fonction chat():
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Tu es un assistant qui parle malagasy"},
        {"role": "user", "content": message}
    ]
)
response_text = response.choices[0].message.content
```

## Configuration Frontend

Une fois déployé, mettez à jour l'URL dans `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-url.com';
```