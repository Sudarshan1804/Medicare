import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Video, MapPin, MoreVertical, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";

const Appointments = () => {
  const navigate = useNavigate();
  const appointments = useStore((state) => state.appointments);
  const cancelAppointment = useStore((state) => state.cancelAppointment);
  const rescheduleAppointment = useStore((state) => state.rescheduleAppointment);
  const addNotification = useStore((state) => state.addNotification);

  console.log("All appointments:", appointments); // Debug log

  const [rescheduleDialog, setRescheduleDialog] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((a) => {
    if (a.status === "cancelled") return false;
    const appointmentDate = new Date(a.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  });

  const pastAppointments = appointments.filter((a) => {
    if (a.status === "cancelled") return true;
    const appointmentDate = new Date(a.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  });

  console.log("Upcoming appointments:", upcomingAppointments); // Debug log
  console.log("Past appointments:", pastAppointments); // Debug log

  const handleCancel = (appointment) => {
    cancelAppointment(appointment.id);
    addNotification({
      title: "Appointment Cancelled",
      message: `Your appointment with ${appointment.doctorName} has been cancelled.`
    });
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully."
    });
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select new date and time",
        variant: "destructive"
      });
      return;
    }

    rescheduleAppointment(rescheduleDialog.id, newDate, newTime);
    addNotification({
      title: "Appointment Rescheduled",
      message: `Your appointment with ${rescheduleDialog.doctorName} has been rescheduled to ${newDate} at ${newTime}.`
    });
    toast({
      title: "Appointment Rescheduled",
      description: "Your appointment has been rescheduled successfully."
    });
    setRescheduleDialog(null);
    setNewDate("");
    setNewTime("");
  };

  const handleJoinCall = (appointment) => {
    if (appointment.type === "video" && !appointment.paid) {
      toast({
        title: "Payment Required",
        description: "Please complete payment to access video consultation.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/video-call/${appointment.doctorId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "rescheduled":
        return <Badge variant="warning">Rescheduled</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const AppointmentCard = ({ appointment }) => (
    <Card className="card-hover animate-fade-in">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img 
            src={appointment.doctorImage} 
            alt={appointment.doctorName}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{appointment.doctorName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                {appointment.type === "video" && appointment.paid && (
                  <Badge variant="success" className="gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Paid
                  </Badge>
                )}
                {appointment.type === "video" && !appointment.paid && (
                  <Badge variant="warning" className="gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Payment Pending
                  </Badge>
                )}
                {appointment.status !== "cancelled" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRescheduleDialog(appointment)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCancel(appointment)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {appointment.type === "video" ? (
                  <Video className="w-4 h-4 text-primary" />
                ) : (
                  <MapPin className="w-4 h-4 text-primary" />
                )}
                <span className="capitalize">{appointment.type}</span>
              </div>
            </div>

            {appointment.type === "video" && appointment.status === "confirmed" && (
              <div className="mt-4">
                {appointment.paid ? (
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleJoinCall(appointment)}
                  >
                    <Video className="w-4 h-4" />
                    Join Video Call
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 cursor-not-allowed opacity-60"
                      disabled
                    >
                      <Video className="w-4 h-4" />
                      Join Video Call (Payment Required)
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="text-lg font-bold text-primary">₹{appointment.fee}</span>
              <span className="text-sm text-muted-foreground">{appointment.hospital}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">Manage your scheduled appointments</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingAppointments.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground mb-4">You don't have any scheduled appointments.</p>
                <Link to="/doctors">
                  <Button>Book an Appointment</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastAppointments.length === 0 ? (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Appointments</h3>
                <p className="text-muted-foreground">Your appointment history will appear here.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleDialog} onOpenChange={() => setRescheduleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a new date and time for your appointment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Input 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>New Time</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setRescheduleDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
