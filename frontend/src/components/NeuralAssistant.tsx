import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import brain from 'brain';
import { InterpreterResponse } from 'types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: string[];
}

interface Props {
  onActionTriggered?: (action: string, data?: any) => void;
}

export const NeuralAssistant: React.FC<Props> = ({ onActionTriggered }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m Pantry-Pal, your AI kitchen assistant. I can help you manage your pantry, scan barcodes, track expiry dates, and suggest recipes. What would you like to do?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current!.continuous = false;
      recognition.current!.interimResults = false;
      recognition.current!.lang = 'en-US';

      recognition.current!.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current!.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognition.current!.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await brain.interpret_command({ command: input.trim() });
      const data: InterpreterResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        actions: data.actions,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Execute actions if any
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(action => {
          onActionTriggered?.(action, data.data);
        });
      }
    } catch (error) {
      console.error('Error interpreting command:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I had trouble understanding that. Could you please try again?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process your request');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="flex flex-col h-[600px] bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30 backdrop-blur-sm border-emerald-200/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-100/50 to-blue-100/30">
        <div className="relative">
          <Brain className="h-6 w-6 text-emerald-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Pantry-Pal AI</h3>
          <p className="text-sm text-gray-600">Neural Kitchen Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.actions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      >
                        {action.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-blue-50/20">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your pantry..."
              className="min-h-[44px] max-h-[120px] resize-none border-emerald-200/50 focus:border-emerald-400 bg-white/80 backdrop-blur-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={!recognition.current}
              className="h-11 w-11 p-0"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 p-0 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
