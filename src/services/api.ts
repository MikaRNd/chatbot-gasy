// Configuration de l'API backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-flask-backend.com' 
  : 'http://localhost:5000';

export interface ChatMessage {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  status: 'success' | 'error';
  error?: string;
}

export class ChatAPI {
  /**
   * Envoie un message au backend Flask
   */
  static async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      
      // Simulation locale si l'API n'est pas disponible
      return this.simulateResponse(message, conversationId);
    }
  }

  /**
   * Vérification de la santé de l'API
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Simulation locale pour le développement
   */
  private static simulateResponse(message: string, conversationId?: string): ChatResponse {
    const responses = [
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
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      conversation_id: conversationId || `sim_${Date.now()}`,
      status: 'success'
    };
  }
}