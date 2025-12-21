import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useStore } from "@/lib/store.js";

const Orders = () => {
  const orders = useStore((state) => state.orders);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <Clock className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link to="/pharmacies"><Button>Browse Medicines</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <Badge variant="success" className="gap-1">{getStatusIcon(order.status)}{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</span>
                  <Link to={`/order-tracking/${order.id}`}>
                    <Button variant="outline" size="sm"><MapPin className="w-4 h-4 mr-1" />Track Order</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
