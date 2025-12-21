import { Link } from "react-router-dom";
import { 
  Search, Stethoscope, Pill, AlertTriangle, Video, 
  MapPin, Clock, ArrowRight, Heart, Shield, Users,
  Calendar, Bot, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";

const Index = () => {
  const features = [
    {
      icon: Stethoscope,
      title: "Find Doctors",
      description: "Book appointments with specialists near you",
      link: "/doctors",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Pill,
      title: "Order Medicines",
      description: "Get medicines delivered to your doorstep",
      link: "/pharmacies",
      color: "bg-accent/10 text-accent"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Help",
      description: "Quick access to emergency services",
      link: "/emergency",
      color: "bg-destructive/10 text-destructive"
    },
    {
      icon: Video,
      title: "Video Consult",
      description: "Consult doctors from home via video call",
      link: "/doctors",
      color: "bg-success/10 text-success"
    },
    {
      icon: Activity,
      title: "Symptom Checker",
      description: "Check your symptoms and get guidance",
      link: "/condition-checker",
      color: "bg-warning/10 text-warning"
    },
    {
      icon: Bot,
      title: "AI Health Assistant",
      description: "Get instant health advice from AI",
      link: "/health-assistant",
      color: "bg-primary/10 text-primary"
    }
  ];

  const stats = [
    { value: "500+", label: "Expert Doctors", icon: Stethoscope },
    { value: "50K+", label: "Happy Patients", icon: Heart },
    { value: "100+", label: "Pharmacies", icon: Pill },
    { value: "24/7", label: "Emergency Support", icon: Shield }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[length:24px_24px] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              Trusted Healthcare Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Your Health, Our{" "}
              <span className="gradient-text">Priority</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Connect with top doctors, order medicines, and access emergency services - all in one place. Quality healthcare at your fingertips.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search doctors, medicines, hospitals..." 
                  className="pl-12 h-14 text-base"
                />
              </div>
              <Button variant="hero" size="xl">
                Search
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/doctors">
                <Button variant="outline" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Find Doctors
                </Button>
              </Link>
              <Link to="/emergency">
                <Button variant="emergency" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Emergency
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Healthcare Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your health and wellness, accessible from anywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <Card 
                  className="h-full card-hover cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <div className="flex items-center text-primary font-medium">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Need Medical Assistance?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Our team of healthcare professionals is available 24/7 to help you with any medical emergencies or consultations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/doctors">
              <Button size="xl" className="bg-card text-primary hover:bg-card/90">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/emergency">
              <Button size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
