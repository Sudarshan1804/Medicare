import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Index from "./pages/Index.jsx";
import Doctors from "./pages/Doctors.jsx";
import Appointments from "./pages/Appointments.jsx";
import VideoCall from "./pages/VideoCall.jsx";
import MedicineUpload from "./pages/MedicineUpload.jsx";
import Pharmacies from "./pages/Pharmacies.jsx";
import PharmacyCatalog from "./pages/PharmacyCatalog.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import EmergencyHub from "./pages/EmergencyHub.jsx";
import EmergencyRouting from "./pages/EmergencyRouting.jsx";
import HealthAssistant from "./pages/HealthAssistant.jsx";
import CommunityResponders from "./pages/CommunityResponders.jsx";
import IncidentsFeed from "./pages/IncidentsFeed.jsx";
import ConditionChecker from "./pages/ConditionChecker.jsx";
import MedicineReminders from "./pages/MedicineReminders.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/video-call/:doctorId" element={<VideoCall />} />
          <Route path="/medicine-upload" element={<Layout><MedicineUpload /></Layout>} />
          <Route path="/pharmacies" element={<Layout><Pharmacies /></Layout>} />
          <Route path="/pharmacy" element={<Layout><PharmacyCatalog /></Layout>} />
          <Route path="/pharmacy/:id" element={<Layout><PharmacyCatalog /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
          <Route path="/order-tracking/:orderId" element={<Layout><OrderTracking /></Layout>} />
          <Route path="/emergency" element={<Layout><EmergencyHub /></Layout>} />
          <Route path="/emergency-routing" element={<Layout><EmergencyRouting /></Layout>} />
          <Route path="/health-assistant" element={<Layout><HealthAssistant /></Layout>} />
          <Route path="/community-responders" element={<Layout><CommunityResponders /></Layout>} />
          <Route path="/incidents" element={<Layout><IncidentsFeed /></Layout>} />
          <Route path="/condition-checker" element={<Layout><ConditionChecker /></Layout>} />
          <Route path="/medicine-reminders" element={<Layout><MedicineReminders /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
