import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, MessageCircle, Heart, Activity, Pill, Stethoscope, Upload, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { toast } from "@/hooks/use-toast.js";
import { assistantAPI } from "@/lib/api.js";

const HealthAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your AI Medical Assistant powered by OpenRouter. I can help with:\n• Medicine information and side effects\n• Symptom analysis\n• Pill identification (upload image)\n• Health advice\n\nAsk me anything medical!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: Pill, label: "Medicine Info", query: "What are the uses and side effects of Paracetamol?" },
    { icon: Heart, label: "Check Symptoms", query: "I have a headache and fever. What could it be?" },
    { icon: Upload, label: "Identify Pill", query: "upload-image", isImageAction: true },
    { icon: Stethoscope, label: "Health Advice", query: "How can I lower my blood pressure naturally?" }
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setImagePreview(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async (messageText = inputMessage, imageData = selectedImage) => {
    if (!messageText.trim() && !imageData) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: messageText || "Identify this pill",
      image: imagePreview,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      let response;

      if (imageData) {
        // Pill identification with image
        console.log('🖼️ Sending pill identification request');
        response = await assistantAPI.identifyPill(imageData, messageText || 'Identify this pill and provide detailed information');
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        // Text-based query
        console.log('💬 Sending text query:', messageText);
        response = await assistantAPI.chat(messageText, conversationHistory);
      }

      if (response.success && response.data) {
        const aiData = response.data;
        
        // Build human-readable message - prioritize summary
        let formattedText = '';
        
        if (aiData.intent === 'out_of_scope' || aiData.summary === "I don't know") {
          formattedText = "I don't know";
        } else {
          // PRIMARY: Use the summary as the main response (human-readable)
          if (aiData.summary) {
            formattedText = aiData.summary;
          } else if (typeof aiData === 'string') {
            // If data is already a string, use it directly
            formattedText = aiData;
          } else if (aiData.result && aiData.result.description) {
            // Fallback to description if available
            formattedText = aiData.result.description;
          } else {
            // Last resort: show structured data
            formattedText = 'I received your request but had trouble formatting the response. Here\'s what I found:\n\n';
            
            if (aiData.result) {
              const result = aiData.result;
              
              if (result.name) {
                formattedText += `**${result.name}**\n\n`;
              }

              if (result.common_uses && result.common_uses.length > 0) {
                formattedText += `**Common Uses:**\n`;
                result.common_uses.forEach(use => formattedText += `• ${use}\n`);
                formattedText += '\n';
              }

              if (result.typical_adult_dose_range) {
                formattedText += `**Dosage:** ${result.typical_adult_dose_range}\n\n`;
              }

              if (result.major_side_effects && result.major_side_effects.length > 0) {
                formattedText += `**Side Effects:**\n`;
                result.major_side_effects.forEach(effect => formattedText += `• ${effect}\n`);
                formattedText += '\n';
              }
            }
          }

          // Only add sources if they exist and aren't too many
          if (aiData.evidence && aiData.evidence.length > 0 && aiData.evidence.length <= 3) {
            formattedText += `\n\n📚 **Sources:** ${aiData.evidence.slice(0, 2).join(', ')}`;
          }
        }

        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          text: formattedText,
          data: aiData,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);

        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: messageText },
          { role: 'assistant', content: formattedText }
        ]);

      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }

    } catch (error) {
      console.error('❌ AI Assistant Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive"
      });

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.isImageAction) {
      fileInputRef.current?.click();
    } else {
      setInputMessage(action.query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powered by OpenRouter AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
            AI Medical Assistant
          </h1>
          <p className="text-muted-foreground">
            Get instant medical information, symptom analysis, and pill identification
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-2 p-4 hover:border-primary hover:bg-primary/5"
              onClick={() => handleQuickAction(action)}
            >
              <action.icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Chat Container */}
        <Card className="shadow-lg border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Medical AI</div>
                <div className="text-xs text-muted-foreground font-normal">
                  Online • Responds only to medical queries
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="w-3 h-3" />
                GPT-4
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 mb-6 animate-fade-in ${
                    message.type === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded pill" 
                        className="rounded-lg mb-2 max-w-full h-auto max-h-48 object-contain"
                      />
                    )}
                    <div className="text-sm whitespace-pre-wrap">
                      {message.text.split('\n').map((line, i) => {
                        // Handle bold headings with **text**
                        if (line.includes('**')) {
                          const boldText = line.replace(/\*\*/g, '');
                          return <div key={i} className="font-bold text-base mt-3 mb-1">{boldText}</div>;
                        }
                        // Handle bullet points
                        if (line.trim().startsWith('•')) {
                          return <div key={i} className="ml-4 mb-1">{line}</div>;
                        }
                        // Check if line contains URLs
                        if (line.includes('http')) {
                          const parts = line.split(' ');
                          return (
                            <div key={i} className="mb-1">
                              {parts.map((part, j) => {
                                if (part.startsWith('http')) {
                                  return (
                                    <a 
                                      key={j} 
                                      href={part} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary underline inline-flex items-center gap-1"
                                    >
                                      {part} <ExternalLink className="w-3 h-3" />
                                    </a>
                                  );
                                }
                                return <span key={j}>{part} </span>;
                              })}
                            </div>
                          );
                        }
                        // Empty lines for spacing
                        if (line.trim() === '') {
                          return <div key={i} className="h-2"></div>;
                        }
                        // Regular text
                        return <div key={i} className="mb-1">{line}</div>;
                      })}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-6 py-3 border-t bg-muted/50">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Selected pill" 
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload pill image"
                >
                  <Upload className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Ask about medicines, symptoms, or upload a pill image..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={(!inputMessage.trim() && !selectedImage) || isTyping}
                  className="gap-2"
                >
                  {isTyping ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💊 This AI provides medical information only. For emergencies, call 102. Always consult a doctor for diagnosis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚠️ Important:</strong> This AI assistant is for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider for medical decisions. In case of emergency, call your local emergency services immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthAssistant;
