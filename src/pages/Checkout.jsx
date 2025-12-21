import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, FileText, Upload, CheckCircle, AlertCircle, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const addNotification = useStore((state) => state.addNotification);

  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 49;

  const prescriptionItems = cart.filter(item => item.requiresPrescription);
  const hasPrescriptionItems = prescriptionItems.length > 0;

  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setPrescriptionFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPrescriptionPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePrescription = () => {
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (hasPrescriptionItems && !prescriptionFile) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription for the medicines that require it.",
        variant: "destructive"
      });
      return;
    }

    const order = {
      id: Date.now().toString(),
      items: cart,
      total: total + deliveryFee,
      status: "confirmed",
      date: new Date().toISOString(),
      hasPrescription: !!prescriptionFile
    };
    addOrder(order);
    addNotification({ title: "Order Placed!", message: `Your order #${order.id} has been confirmed.` });
    clearCart();
    toast({ title: "Order Placed!", description: "Your order has been confirmed successfully." });
    navigate("/orders");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          
          {/* Prescription Upload Section */}
          {hasPrescriptionItems && (
            <Card className="border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <FileText className="w-5 h-5" />
                  Upload Prescription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-warning/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">The following medicines require a prescription:</p>
                      <ul className="text-sm mt-2 space-y-1">
                        {prescriptionItems.map(item => (
                          <li key={item.id} className="text-muted-foreground">• {item.name} ({item.brand})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {!prescriptionFile ? (
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a clear image or PDF of your prescription
                    </p>
                    <Label htmlFor="prescription" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="prescription"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePrescriptionUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {prescriptionPreview && prescriptionPreview.startsWith('data:image') ? (
                        <img 
                          src={prescriptionPreview} 
                          alt="Prescription" 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{prescriptionFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(prescriptionFile.size / 1024).toFixed(1)} KB
                        </p>
                        <Badge variant="success" className="mt-2 gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Uploaded
                        </Badge>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={removePrescription}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input required /></div>
                <div><Label>Last Name</Label><Input required /></div>
              </div>
              <div><Label>Address</Label><Input required placeholder="Flat/House No., Street" /></div>
              <div><Label>Landmark</Label><Input placeholder="Near..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City</Label><Input required /></div>
                <div><Label>PIN Code</Label><Input required placeholder="6-digit PIN" maxLength={6} /></div>
              </div>
              <div><Label>Phone</Label><Input required type="tel" placeholder="+91" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setPaymentMethod("card")}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setPaymentMethod("upi")}>
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-4 h-4" />
                    <span>UPI Payment</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 pt-4">
                  <div><Label>Card Number</Label><Input required placeholder="1234 5678 9012 3456" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Expiry</Label><Input required placeholder="MM/YY" /></div>
                    <div><Label>CVV</Label><Input required placeholder="123" type="password" maxLength={3} /></div>
                  </div>
                  <div><Label>Name on Card</Label><Input required placeholder="As printed on card" /></div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>UPI ID</Label>
                    <Input required placeholder="yourname@upi" type="text" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe)
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{(total + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={hasPrescriptionItems && !prescriptionFile}
              >
                {hasPrescriptionItems && !prescriptionFile 
                  ? "Upload Prescription to Continue" 
                  : "Place Order"
                }
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
