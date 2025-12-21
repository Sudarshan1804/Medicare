import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Video, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useStore } from "@/lib/store.js";
import { toast } from "@/hooks/use-toast.js";

const DoctorCard = ({ doctor, style }) => {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [bookingType, setBookingType] = useState("in-person");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const addAppointment = useStore((state) => state.addAppointment);
  const markAppointmentAsPaid = useStore((state) => state.markAppointmentAsPaid);
  const getAppointmentByDoctorId = useStore((state) => state.getAppointmentByDoctorId);
  const addNotification = useStore((state) => state.addNotification);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    const appointment = {
      id: Date.now().toString(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorImage: doctor.image,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      date: selectedDate,
      time: selectedTime,
      type: bookingType,
      fee: bookingType === "video" ? doctor.videoFee : doctor.fee,
      status: "pending",
      paid: false
    };

    console.log("Creating appointment:", appointment); // Debug log
    addAppointment(appointment);
    console.log("Appointment added to store"); // Debug log

    // For video consultations, require payment first
    if (bookingType === "video") {
      setPendingAppointment(appointment);
      setIsBookingOpen(false);
      setIsPaymentOpen(true);
    } else {
      // In-person appointments can be confirmed without payment
      markAppointmentAsPaid(appointment.id, null);
      addNotification({
        title: "Appointment Booked!",
        message: `Your in-person appointment with ${doctor.name} is confirmed for ${selectedDate} at ${selectedTime}`
      });
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} is confirmed.`
      });
      setIsBookingOpen(false);
    }

    setSelectedDate("");
    setSelectedTime("");
  };

  const handlePayment = () => {
    if (!pendingAppointment) return;

    // Simulate payment processing
    const paymentId = `PAY_${Date.now()}`;
    
    markAppointmentAsPaid(pendingAppointment.id, paymentId);
    addNotification({
      title: "Payment Successful!",
      message: `Payment completed for video consultation with ${doctor.name}. You can now start the video call.`
    });

    toast({
      title: "Payment Successful!",
      description: "Your video consultation is now ready. You can join the call."
    });

    setIsPaymentOpen(false);
    setPendingAppointment(null);
  };

  const handleVideoCall = () => {
    const paidAppointment = getAppointmentByDoctorId(doctor.id);
    
    if (!paidAppointment) {
      toast({
        title: "Payment Required",
        description: "Please complete payment to start the video consultation.",
        variant: "destructive"
      });
      return;
    }

    navigate(`/video-call/${doctor.id}`);
  };

  return (
    <>
      <Card className="overflow-hidden card-hover animate-fade-in" style={style}>
        <CardContent className="p-0">
          <div className="p-6">
            {/* Doctor Info */}
            <div className="flex gap-4 mb-4">
              <div className="relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                {doctor.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                    <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  </div>
                  {doctor.isOnline && (
                    <Badge variant="online" className="text-xs">Online</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium text-sm">{doctor.rating}</span>
                  <span className="text-muted-foreground text-sm">({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{doctor.hospital}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-success" />
                <span className="text-success font-medium">{doctor.nextAvailable}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <Video className="w-3 h-3" />
                Video Available
              </Badge>
              {doctor.availability.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">{day}</Badge>
              ))}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-primary">₹{doctor.fee}</span>
                <span className="text-muted-foreground text-sm">/visit</span>
              </div>
              <div className="flex gap-2">
                {doctor.isOnline && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleVideoCall}
                  >
                    <Video className="w-4 h-4" />
                    Call Now
                  </Button>
                )}
                <Button size="sm" onClick={() => setIsBookingOpen(true)}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment with {doctor.name}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={bookingType} onValueChange={setBookingType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="in-person">In-Person</TabsTrigger>
              <TabsTrigger value="video">
                Video Call
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-person" className="space-y-4">
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-primary">₹{doctor.fee}</p>
                <p className="text-sm text-muted-foreground">Consultation fee</p>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-primary">₹{doctor.videoFee}</p>
                <p className="text-sm text-muted-foreground">Video consultation fee</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
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
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Pay for video consultation with {doctor.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Doctor:</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Consultation Type:</span>
                <span className="font-medium">Video Call</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-medium">
                  {pendingAppointment?.date} at {pendingAppointment?.time}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-primary text-lg">₹{pendingAppointment?.fee}</span>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ After payment, the video call button will be enabled. You can then join the consultation at your scheduled time.
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} className="gap-2">
              <span>Pay ₹{pendingAppointment?.fee}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorCard;
