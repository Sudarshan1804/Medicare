import { useState } from "react";
import { MapPin, Navigation, Clock, Locate, Hospital, ExternalLink, Phone, Map, List, Settings, Heart, Baby, Activity } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/hooks/use-toast.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label.jsx";
import LocationMap from "@/components/maps/LocationMap.jsx";
import NavigationDialog from "@/components/maps/NavigationDialog.jsx";
import { hospitalAPI } from "@/lib/api.js";

const MAX_DISTANCE_KM = 20; // Maximum distance filter

const EmergencyRouting = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || "");
  const [tempToken, setTempToken] = useState("");
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [useGooglePlaces, setUseGooglePlaces] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      const response = await hospitalAPI.getNearby(lat, lng, MAX_DISTANCE_KM, {
        specialty: specialtyFilter,
        useGooglePlaces: useGooglePlaces
      });
      
      if (response.success) {
        // Add additional fields and format data
        const hospitals = response.data.map(hospital => ({
          ...hospital,
          id: hospital._id,
          lat: hospital.location.coordinates[1],
          lng: hospital.location.coordinates[0],
          eta: `${Math.round(hospital.distance * 3 + 2)} min`,
          isOpen: hospital.isOpen24x7 || true
        }));
        
        setNearbyHospitals(hospitals);
        return hospitals;
      } else {
        throw new Error(response.message || 'Failed to fetch hospitals');
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospitals from server",
        variant: "destructive"
      });
      return [];
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }

    // Check if the page is served over HTTPS or localhost
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
    if (!isSecureContext) {
      toast({ 
        title: "Secure Connection Required", 
        description: "Location access requires HTTPS. Please access the site via https:// instead of http://",
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    
    // Use high accuracy with strict settings for EXACT location
    const options = {
      enableHighAccuracy: true, // Request GPS
      timeout: 30000,
      maximumAge: 0 // Always get fresh location
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        console.log('🏥 EXACT Location Retrieved:', {
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8),
          accuracy: `${Math.round(accuracy)} meters`
        });
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationText(`📍 ${latitude.toFixed(6)}°N, ${longitude.toFixed(6)}°E (Accuracy: ${Math.round(accuracy)}m)`);
        
        // Fetch hospitals from backend API
        const hospitals = await fetchNearbyHospitals(latitude, longitude);
        setLoading(false);
        
        if (hospitals.length > 0) {
          toast({ 
            title: "Emergency Services Found!", 
            description: `${hospitals.length} hospitals within ${MAX_DISTANCE_KM}km`,
            variant: "default"
          });
        } else {
          toast({ 
            title: "No Hospitals Found", 
            description: `No emergency services found within ${MAX_DISTANCE_KM}km`,
            variant: "destructive"
          });
        }
      },
      (error) => {
        setLoading(false);
        let message = "Could not get your location";
        let title = "Location Error";
        
        if (error.code === 1) {
          title = "Location Permission Denied";
          message = "Please allow location access in your browser settings. Click the lock icon or info icon in the address bar and enable location permissions.";
        } else if (error.code === 2) {
          message = "Location unavailable - please enable GPS/Location services on your device";
        } else if (error.code === 3) {
          message = "Location request timed out - please try again";
        }
        
        toast({ title, description: message, variant: "destructive" });
      },
      options
    );
  };

  const navigateToHospital = (hospital) => {
    setNavigationTarget(hospital);
    setShowNavigation(true);
  };

  const searchNearbyOnMaps = () => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/search/hospital/@${userLocation.lat},${userLocation.lng},14z`, "_blank");
    }
  };

  const callEmergency = () => {
    window.location.href = "tel:102";
  };

  const saveMapboxToken = () => {
    if (tempToken.trim()) {
      localStorage.setItem('mapbox_token', tempToken.trim());
      setMapboxToken(tempToken.trim());
      toast({ title: "Token Saved", description: "Mapbox token saved successfully" });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Nearest Hospital</h1>
            <p className="text-muted-foreground">Emergency hospitals within {MAX_DISTANCE_KM}km of your location</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Map Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Enter your Mapbox public token to enable the interactive map. 
                  Get your token from <a href="https://mapbox.com" target="_blank" className="text-primary underline">mapbox.com</a>
                </p>
                <Input 
                  placeholder="pk.eyJ1I..." 
                  value={tempToken || mapboxToken}
                  onChange={(e) => setTempToken(e.target.value)}
                />
                <Button onClick={saveMapboxToken} className="w-full">Save Token</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleUseMyLocation} disabled={loading} variant="destructive" className="gap-2">
                  <Locate className="w-4 h-4" />
                  {loading ? "Getting Exact Location..." : "Use My Location"}
                </Button>
                <Button onClick={callEmergency} variant="outline" className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Phone className="w-4 h-4" />
                  Call 102 (Ambulance)
                </Button>
                {userLocation && (
                  <Button variant="outline" onClick={searchNearbyOnMaps} className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View All on Google Maps
                  </Button>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Label htmlFor="specialty" className="text-sm font-medium">Specialty:</Label>
                  <Select value={specialtyFilter || "all"} onValueChange={(val) => setSpecialtyFilter(val === "all" ? "" : val)}>
                    <SelectTrigger id="specialty" className="w-[180px]">
                      <SelectValue placeholder="All Hospitals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hospitals</SelectItem>
                      <SelectItem value="cardiac">
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4" /> Cardiac
                        </span>
                      </SelectItem>
                      <SelectItem value="trauma">
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Trauma
                        </span>
                      </SelectItem>
                      <SelectItem value="pediatric">
                        <span className="flex items-center gap-2">
                          <Baby className="w-4 h-4" /> Pediatric
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="useGoogle" 
                    checked={useGooglePlaces} 
                    onCheckedChange={setUseGooglePlaces}
                  />
                  <Label htmlFor="useGoogle" className="cursor-pointer">
                    Use Real Google Places
                  </Label>
                </div>
              </div>
              
              {locationText && (
                <p className="text-sm">{locationText}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {nearbyHospitals.length > 0 && (
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" /> List View
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="w-4 h-4" /> Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="space-y-4">
                {nearbyHospitals.map((hospital, index) => (
                  <Card key={hospital.id} className={`card-hover animate-fade-in ${index === 0 ? 'border-success ring-2 ring-success/20' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{hospital.name}</h3>
                            {index === 0 && <Badge variant="success">Nearest</Badge>}
                            {hospital.emergencyAvailable && <Badge variant="success">24/7 Emergency</Badge>}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{hospital.address}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Navigation className="w-4 h-4 text-primary" />{hospital.distance} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-success" />ETA: {hospital.eta}
                            </span>
                          </div>
                        </div>
                        <Button onClick={() => navigateToHospital(hospital)} className="gap-2">
                          <Navigation className="w-4 h-4" />Navigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <Card className="overflow-hidden">
                <div className="h-[500px]">
                  <LocationMap 
                    userLocation={userLocation}
                    locations={nearbyHospitals}
                    type="hospital"
                    mapboxToken={mapboxToken}
                    onMarkerClick={(hospital) => navigateToHospital(hospital)}
                  />
                </div>
              </Card>
              {!mapboxToken && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Click the ⚙️ icon to add your Mapbox token and enable the interactive map
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}

        {nearbyHospitals.length === 0 && (
          <Card className="p-12 text-center">
            <Hospital className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Find Hospitals Near You</h3>
            <p className="text-muted-foreground mb-4">Click "Use My Location" to find emergency hospitals within {MAX_DISTANCE_KM}km</p>
          </Card>
        )}
      </div>

      {/* In-App Navigation Dialog */}
      <NavigationDialog
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        destination={navigationTarget}
        userLocation={userLocation}
        type="hospital"
      />
    </div>
  );
};

export default EmergencyRouting;
