import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import { ChatAPI } from '@/services/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Salama! Izaho dia chatbot AI miteny malagasy. Inona no azoko atao ho anao?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [conversationId, setConversationId] = useState<string>();
  const [isOnline, setIsOnline] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Vérification de la connexion API au chargement
  useEffect(() => {
    const checkConnection = async () => {
      const online = await ChatAPI.healthCheck();
      setIsOnline(online);
    };
    checkConnection();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Appel à l'API backend
      const response = await ChatAPI.sendMessage(inputValue, conversationId);
      
      if (response.status === 'success') {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: response.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationId(response.conversation_id);
      } else {
        throw new Error(response.error || 'Erreur API');
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Miala tsiny, misy olana kely. Andramo indray azafady.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-chat-bg p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <Card className="p-4 mb-4 bg-gradient-to-r from-primary to-secondary text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Chatbot Malagasy AI</h1>
                <p className="text-white/80 text-sm">Miaraka aminao hatrany</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              <span className="text-sm">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
            </div>
          </div>
        </Card>

        {/* Messages Container */}
        <Card className="flex-1 p-4 mb-4 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} chat-message-enter`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                    message.isUser
                      ? 'bg-chat-user text-chat-user-foreground rounded-br-md'
                      : 'bg-chat-bot text-chat-bot-foreground rounded-bl-md border'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!message.isUser && (
                      <Bot className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.isUser ? 'text-chat-user-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString('mg-MG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.isUser && (
                      <User className="w-5 h-5 mt-0.5 text-chat-user-foreground/70 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start chat-message-enter">
                <div className="bg-chat-bot text-chat-bot-foreground p-4 rounded-2xl rounded-bl-md shadow-md border">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Area */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Soraty eto ny hafatrao..."
              className="flex-1 rounded-full bg-muted border-border focus:ring-2 focus:ring-primary"
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full w-12 h-12 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};