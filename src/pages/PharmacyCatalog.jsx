import { ShoppingCart, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { medicines } from "@/lib/mockData.js";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";

const PharmacyCatalog = () => {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    toast({ 
      title: "Added to Cart", 
      description: medicine.requiresPrescription 
        ? `${medicine.name} added. Prescription will be required at checkout.`
        : `${medicine.name} added to your cart` 
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Medicine Catalog</h1>
          <p className="text-muted-foreground">Browse and order medicines</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <Card key={medicine.id} className="card-hover animate-fade-in">
              <CardContent className="p-4">
                <img src={medicine.image} alt={medicine.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{medicine.category}</Badge>
                  {medicine.requiresPrescription && (
                    <Badge variant="warning" className="gap-1">
                      <FileText className="w-3 h-3" />
                      Rx
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold">{medicine.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{medicine.brand}</p>
                <p className="text-xs text-muted-foreground mb-4">{medicine.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">₹{medicine.price}</span>
                  <Button size="sm" onClick={() => handleAddToCart(medicine)}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyCatalog;
