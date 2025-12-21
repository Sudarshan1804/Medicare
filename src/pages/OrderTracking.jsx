import { useParams } from "react-router-dom";
import { Package, Truck, CheckCircle, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { useStore } from "@/lib/store.js";

const OrderTracking = () => {
  const { orderId } = useParams();
  const orders = useStore((state) => state.orders);
  const order = orders.find((o) => o.id === orderId);

  const steps = [
    { icon: Package, label: "Order Confirmed", time: "10:30 AM", completed: true },
    { icon: Truck, label: "Shipped", time: "2:00 PM", completed: true },
    { icon: MapPin, label: "Out for Delivery", time: "Expected 4:00 PM", completed: false },
    { icon: CheckCircle, label: "Delivered", time: "", completed: false }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Track Order</h1>
        <p className="text-muted-foreground mb-8">Order #{orderId}</p>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && <div className={`w-0.5 h-12 ${step.completed ? "bg-success" : "bg-muted"}`} />}
                  </div>
                  <div>
                    <p className={`font-medium ${step.completed ? "" : "text-muted-foreground"}`}>{step.label}</p>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Delivery Location</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Map will appear here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;
