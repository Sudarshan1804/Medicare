import { Users, Phone, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { responders } from "@/lib/mockData.js";

const CommunityResponders = () => (
  <div className="min-h-screen py-8">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Community Responders</h1>
      <p className="text-muted-foreground mb-8">Volunteer responders near you</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {responders.map((responder) => (
          <Card key={responder.id} className="card-hover animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold">{responder.name}</h3>
                  <p className="text-sm text-muted-foreground">{responder.type}</p>
                </div>
                <Badge variant={responder.available ? "success" : "secondary"} className="ml-auto">
                  {responder.available ? "Available" : "Busy"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" />{responder.rating}</span>
                <span className="text-muted-foreground">{responder.distance}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{responder.responseTime}</span>
              </div>
              <Button className="w-full" disabled={!responder.available}><Phone className="w-4 h-4 mr-1" />Request Help</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default CommunityResponders;
