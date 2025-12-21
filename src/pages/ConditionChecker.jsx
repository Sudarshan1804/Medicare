import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { symptoms } from "@/lib/mockData.js";

const ConditionChecker = () => {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const toggleSymptom = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const analyze = () => {
    const hasHighSeverity = selected.some((id) => symptoms.find((s) => s.id === id)?.severity === "high");
    setResult(hasHighSeverity ? "high" : selected.length > 3 ? "medium" : "low");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Symptom Checker</h1>
        <p className="text-muted-foreground mb-8">Select your symptoms for guidance</p>
        <Card className="mb-6">
          <CardHeader><CardTitle>Select Symptoms</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Badge key={symptom.id} variant={selected.includes(symptom.id) ? "default" : "outline"} className="cursor-pointer py-2 px-4" onClick={() => toggleSymptom(symptom.id)}>
                  {symptom.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button className="w-full mb-6" onClick={analyze} disabled={selected.length === 0}>Analyze Symptoms</Button>
        {result && (
          <Card className={`animate-fade-in ${result === "high" ? "border-destructive" : result === "medium" ? "border-warning" : "border-success"}`}>
            <CardContent className="p-6 text-center">
              {result === "high" ? (
                <><AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" /><h3 className="text-xl font-bold text-destructive mb-2">Seek Immediate Medical Attention</h3><p className="text-muted-foreground">Your symptoms may indicate a serious condition</p></>
              ) : result === "medium" ? (
                <><Activity className="w-12 h-12 text-warning mx-auto mb-4" /><h3 className="text-xl font-bold text-warning mb-2">Consult a Doctor Soon</h3><p className="text-muted-foreground">Schedule an appointment within 24-48 hours</p></>
              ) : (
                <><CheckCircle className="w-12 h-12 text-success mx-auto mb-4" /><h3 className="text-xl font-bold text-success mb-2">Low Risk</h3><p className="text-muted-foreground">Rest and monitor your symptoms</p></>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConditionChecker;
