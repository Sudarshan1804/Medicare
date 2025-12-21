import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  MessageSquare, Send, X, Clock, User
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { doctors } from "@/lib/mockData.js";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";

const VideoCall = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const getAppointmentByDoctorId = useStore((state) => state.getAppointmentByDoctorId);
  
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [callDuration, setCallDuration] = useState(0);

  const doctor = doctorId ? doctors.find((d) => d.id === doctorId) : null;

  // Check payment status before allowing video call
  useEffect(() => {
    if (doctorId) {
      const paidAppointment = getAppointmentByDoctorId(doctorId);
      
      if (!paidAppointment) {
        toast({
          title: "Access Denied",
          description: "Please complete payment to access video consultation.",
          variant: "destructive"
        });
        navigate("/doctors");
        return;
      }
    }
  }, [doctorId, getAppointmentByDoctorId, navigate]);

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "Connected",
        description: doctor ? `You are now connected with ${doctor.name}` : "Video call connected"
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [doctor]);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(callDuration)}`
    });
    navigate(-1);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { text: message, sender: "me", time: new Date() }]);
    setMessage("");
    
    // Simulate doctor response
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        text: "I understand. Let me check that for you.", 
        sender: "doctor", 
        time: new Date() 
      }]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-foreground z-50 flex">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Doctor) */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90">
          {isConnecting ? (
            <div className="h-full flex flex-col items-center justify-center text-background">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse-ring">
                <div className="w-20 h-20 rounded-full bg-primary/40 flex items-center justify-center">
                  {doctor ? (
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {doctor ? `Connecting to ${doctor.name}...` : "Connecting..."}
              </h2>
              <p className="text-background/60">Please wait while we establish the connection</p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {doctor ? (
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <User className="w-32 h-32 text-background/50" />
              )}
            </div>
          )}
        </div>

        {/* Local Video (Self) */}
        <div className="absolute top-4 right-4 w-40 h-28 rounded-xl bg-foreground/80 border border-background/20 overflow-hidden shadow-xl">
          {isVideoOn ? (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-background/50" />
            </div>
          ) : (
            <div className="w-full h-full bg-foreground flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-background/50" />
            </div>
          )}
        </div>

        {/* Call Info */}
        {isConnected && (
          <div className="absolute top-4 left-4 flex items-center gap-3 bg-foreground/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-background text-sm font-medium">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant={isVideoOn ? "secondary" : "destructive"}
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-7 h-7" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="w-14 h-14 rounded-full"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-background hover:bg-background/10"
          onClick={() => navigate(-1)}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="w-80 bg-card border-l border-border flex flex-col animate-slide-in">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-xl ${
                      msg.sender === "me" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
