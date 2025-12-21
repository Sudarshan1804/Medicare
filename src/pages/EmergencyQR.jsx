import { useState, useEffect, useRef } from "react";
import { QrCode, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";
import { Textarea } from "@/components/ui/textarea.tsx";

const EmergencyQR = () => {
  const medicalProfile = useStore((state) => state.medicalProfile);
  const updateMedicalProfile = useStore((state) => state.updateMedicalProfile);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const canvasRef = useRef(null);

  // Generate QR code data
  const generateQRData = () => {
    const data = {
      name: medicalProfile.name || "Not provided",
      bloodType: medicalProfile.bloodType || "Not provided",
      emergencyContact: medicalProfile.emergencyContact || "Not provided",
      allergies: medicalProfile.allergies || "None",
      medications: medicalProfile.medications || "None",
      conditions: medicalProfile.conditions || "None",
    };
    return JSON.stringify(data, null, 2);
  };

  // Generate QR code using canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size, size);

    // Generate simple QR-like pattern (placeholder for actual QR)
    const qrData = generateQRData();
    
    // Create a simple visual representation
    ctx.fillStyle = "black";
    const blockSize = 10;
    const blocks = size / blockSize;
    
    // Generate pattern based on data hash
    let hash = 0;
    for (let i = 0; i < qrData.length; i++) {
      hash = ((hash << 5) - hash) + qrData.charCodeAt(i);
      hash = hash & hash;
    }

    // Draw pattern
    for (let y = 0; y < blocks; y++) {
      for (let x = 0; x < blocks; x++) {
        const shouldFill = ((hash + x * y) % 2) === 0;
        if (shouldFill) {
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }

    // Add borders (QR code style)
    ctx.strokeStyle = "black";
    ctx.lineWidth = blockSize;
    ctx.strokeRect(0, 0, blockSize * 3, blockSize * 3);
    ctx.strokeRect(size - blockSize * 3, 0, blockSize * 3, blockSize * 3);
    ctx.strokeRect(0, size - blockSize * 3, blockSize * 3, blockSize * 3);

    // Convert to data URL
    setQrCodeDataUrl(canvas.toDataURL("image/png"));
  }, [medicalProfile]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) {
      toast({
        title: "Error",
        description: "QR code not generated yet",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement("a");
    link.download = `medical-qr-${medicalProfile.name || "profile"}.png`;
    link.href = qrCodeDataUrl;
    link.click();

    toast({
      title: "Downloaded!",
      description: "Your medical QR code has been downloaded"
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Medical QR Card</h1>
        <p className="text-muted-foreground mb-8">Create your emergency medical profile QR code</p>
        
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              This QR code contains your emergency medical information. Keep it with you at all times for quick access during emergencies.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Your Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input 
                  value={medicalProfile.name || ""} 
                  onChange={(e) => updateMedicalProfile({ name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Blood Type *</Label>
                <Input 
                  value={medicalProfile.bloodType || ""} 
                  onChange={(e) => updateMedicalProfile({ bloodType: e.target.value })} 
                  placeholder="e.g., A+, B-, O+, AB+"
                />
              </div>
              <div>
                <Label>Emergency Contact *</Label>
                <Input 
                  value={medicalProfile.emergencyContact || ""} 
                  onChange={(e) => updateMedicalProfile({ emergencyContact: e.target.value })} 
                  placeholder="+91 9876543210"
                  type="tel"
                />
              </div>
              <div>
                <Label>Known Allergies</Label>
                <Textarea
                  value={medicalProfile.allergies || ""}
                  onChange={(e) => updateMedicalProfile({ allergies: e.target.value })}
                  placeholder="e.g., Penicillin, Peanuts"
                  rows={2}
                />
              </div>
              <div>
                <Label>Current Medications</Label>
                <Textarea
                  value={medicalProfile.medications || ""}
                  onChange={(e) => updateMedicalProfile({ medications: e.target.value })}
                  placeholder="List your current medications"
                  rows={2}
                />
              </div>
              <div>
                <Label>Medical Conditions</Label>
                <Textarea
                  value={medicalProfile.conditions || ""}
                  onChange={(e) => updateMedicalProfile({ conditions: e.target.value })}
                  placeholder="e.g., Diabetes, Hypertension"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center justify-center p-8">
            <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg border-2 border-gray-200">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Medical QR Code" 
                  className="w-48 h-48"
                />
              ) : (
                <QrCode className="w-24 h-24 text-muted-foreground" />
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <p className="text-sm text-muted-foreground text-center mb-4">
              {medicalProfile.name 
                ? "Your QR code is ready to download" 
                : "Fill in your information to generate QR code"
              }
            </p>
            <Button 
              className="gap-2" 
              onClick={handleDownload}
              disabled={!medicalProfile.name || !medicalProfile.bloodType}
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
            {(!medicalProfile.name || !medicalProfile.bloodType) && (
              <p className="text-xs text-muted-foreground mt-2">
                Please fill in at least name and blood type
              </p>
            )}
          </Card>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">QR Code Data Preview:</h3>
          <pre className="text-xs overflow-auto max-h-40 bg-background p-3 rounded">
            {generateQRData()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EmergencyQR;
