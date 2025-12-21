import { useState } from "react";
import { Bell, Plus, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";

const MedicineReminders = () => {
  const reminders = useStore((state) => state.reminders);
  const addReminder = useStore((state) => state.addReminder);
  const removeReminder = useStore((state) => state.removeReminder);
  const toggleReminder = useStore((state) => state.toggleReminder);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    if (!name || !time) return;
    addReminder({ name, time, active: true });
    toast({ title: "Reminder Added", description: `Reminder for ${name} at ${time}` });
    setName(""); setTime("");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Medicine Reminders</h1>
        <p className="text-muted-foreground mb-8">Never miss your medication</p>
        <Card className="mb-6">
          <CardHeader><CardTitle>Add Reminder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Medicine Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Paracetamol" /></div>
            <div><Label>Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <Button className="w-full" onClick={handleAdd}><Plus className="w-4 h-4 mr-1" />Add Reminder</Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="animate-fade-in">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Bell className="w-6 h-6" /></div>
                <div className="flex-1"><p className="font-medium">{reminder.name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" />{reminder.time}</p></div>
                <Switch checked={reminder.active} onCheckedChange={() => toggleReminder(reminder.id)} />
                <Button variant="ghost" size="icon" onClick={() => removeReminder(reminder.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
          {reminders.length === 0 && <p className="text-center text-muted-foreground py-8">No reminders yet. Add one above!</p>}
        </div>
      </div>
    </div>
  );
};

export default MedicineReminders;
