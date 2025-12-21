import { AlertTriangle, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { incidents } from "@/lib/mockData.js";

const IncidentsFeed = () => (
  <div className="min-h-screen py-8">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Incidents Feed</h1>
      <p className="text-muted-foreground mb-8">Real-time emergency incidents in your area</p>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="card-hover animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${incident.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{incident.type}</h3>
                    <Badge variant={incident.severity === "high" ? "destructive" : "warning"}>{incident.severity}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />{incident.location}
                  </div>
                  <p className="text-sm mb-2">{incident.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{incident.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{incident.respondersOnScene} responders</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default IncidentsFeed;
