import { useState } from "react";
import { Upload, Camera, Search, Pill, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { toast } from "@/hooks/use-toast.js";

const MedicineUpload = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const mockResults = [
    { name: "Paracetamol 500mg", brand: "Crocin", use: "Fever and pain relief", dosage: "1-2 tablets every 4-6 hours" },
    { name: "Amoxicillin 250mg", brand: "Mox", use: "Bacterial infections", dosage: "As prescribed by doctor" },
    { name: "Omeprazole 20mg", brand: "Prilosec", use: "Acid reflux", dosage: "Once daily before meals" }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      analyzeImage();
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
      toast({ title: "Analysis Complete", description: `Identified: ${randomResult.name}` });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Medicine Identifier</h1>
          <p className="text-muted-foreground">Upload a photo of your medicine to identify it</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                {image ? (
                  <img src={image} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium">Click to upload medicine image</p>
                    <p className="text-sm text-muted-foreground">or drag and drop</p>
                  </>
                )}
              </div>
            </label>
          </CardContent>
        </Card>

        {analyzing && (
          <Card className="animate-pulse">
            <CardContent className="p-6 text-center">
              <Search className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p>Analyzing medicine...</p>
            </CardContent>
          </Card>
        )}

        {result && !analyzing && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                {result.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><span className="font-medium">Brand:</span> {result.brand}</div>
              <div><span className="font-medium">Use:</span> {result.use}</div>
              <div><span className="font-medium">Dosage:</span> {result.dosage}</div>
              <div className="flex items-center gap-2 text-warning pt-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Always consult a doctor before taking any medication</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicineUpload;
