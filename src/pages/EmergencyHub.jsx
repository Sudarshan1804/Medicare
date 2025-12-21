import { Link } from "react-router-dom";
import { Phone, AlertTriangle, Navigation, Bot, Users, Activity, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { emergencyNumbers } from "@/lib/mockData.js";

const EmergencyHub = () => {
  const quickActions = [
    { icon: Navigation, label: "Find Hospital", link: "/emergency-routing", color: "bg-destructive" },
    { icon: Bot, label: "AI Assistant", link: "/health-assistant", color: "bg-primary" },
    { icon: Users, label: "Responders", link: "/community-responders", color: "bg-success" },
    { icon: Activity, label: "Incidents", link: "/incidents", color: "bg-warning" }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Services</h1>
          <p className="text-muted-foreground">Quick access to emergency help</p>
        </div>

        {/* Emergency Call Button */}
        <Card className="gradient-emergency text-primary-foreground mb-8 overflow-hidden">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">Emergency? Call Now</h2>
            <a href="tel:911">
              <Button size="xl" className="bg-card text-destructive hover:bg-card/90 gap-2">
                <Phone className="w-6 h-6" />
                Call 911
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <Card className="card-hover h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-xl ${action.color} text-primary-foreground flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <p className="font-medium">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Emergency Numbers */}
        <h3 className="text-xl font-semibold mb-4">Emergency Numbers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {emergencyNumbers.map((item) => (
            <Card key={item.id} className="card-hover">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-primary font-bold">{item.number}</p>
                  </div>
                </div>
                <a href={`tel:${item.number}`}>
                  <Button variant="outline" size="sm">Call</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Symptom Checker Link */}
        <Link to="/condition-checker">
          <Card className="mt-8 card-hover">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Symptom Checker</h3>
                <p className="text-sm text-muted-foreground">Check your symptoms and get guidance</p>
              </div>
              <Button>Check Now</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default EmergencyHub;
