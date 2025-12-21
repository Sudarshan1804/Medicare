import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MediCare</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted healthcare companion. Quick access to doctors, medicines, and emergency services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link></li>
              <li><Link to="/pharmacies" className="hover:text-primary transition-colors">Nearby Pharmacies</Link></li>
              <li><Link to="/medicine-upload" className="hover:text-primary transition-colors">Medicine Identifier</Link></li>
              <li><Link to="/condition-checker" className="hover:text-primary transition-colors">Symptom Checker</Link></li>
              <li><Link to="/emergency" className="hover:text-primary transition-colors">Emergency Services</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/appointments" className="hover:text-primary transition-colors">Book Appointment</Link></li>
              <li><Link to="/video-call" className="hover:text-primary transition-colors">Video Consultation</Link></li>
              <li><Link to="/medicine-reminders" className="hover:text-primary transition-colors">Medicine Reminders</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Order Medicines</Link></li>
              <li><Link to="/health-assistant" className="hover:text-primary transition-colors">AI Health Assistant</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>1-800-MEDICARE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@medicare.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 Health Street, Medical City, MC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
