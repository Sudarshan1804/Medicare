import { useState } from "react";
import { MapPin, Star, Navigation, Locate, ExternalLink, Map, List, Settings, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import LeafletMap from "@/components/maps/LeafletMap.jsx";
import NavigationDialog from "@/components/maps/NavigationDialog.jsx";
import { locationAPI } from "@/lib/api.js";

const MAX_DISTANCE_KM = 20; // Maximum distance filter (matching backend default)

const Hospitals = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [dataSource, setDataSource] = useState("");

  // Fetch nearby hospitals using the NEW location API (Google Places with MongoDB fallback)
  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      console.log(`🔍 Fetching hospitals near ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
      // Call the new unified location API
      const response = await locationAPI.getNearby(lat, lng, MAX_DISTANCE_KM, 'hospital');
      
      if (response.success) {
        console.log(`✅ Received ${response.count} hospitals from ${response.source}`);
        setDataSource(response.source === 'openstreetmap' ? 'OpenStreetMap' : response.source === 'places' ? 'Google Places' : 'Database');
        
        // Format hospitals for display
        const hospitals = response.items.map(item => ({
          id: item.place_id,
          place_id: item.place_id,
          name: item.name,
          address: item.address,
          phone: item.phone,
          lat: item.lat,
          lng: item.lng,
          distance: item.distance_km,
          rating: item.rating || 0,
          reviews: item.reviews || 0,
          isOpen: item.isOpen !== false,
          emergencyAvailable: true,
          photos: item.photos || [],
        }));
        
        setNearbyHospitals(hospitals);
        return hospitals;
      } else {
        throw new Error(response.message || 'Failed to fetch hospitals');
      }
    } catch (error) {
      console.error('❌ Error fetching hospitals:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load hospitals from server",
        variant: "destructive"
      });
      return [];
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ 
        title: "Error", 
        description: "Geolocation not supported by your browser", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    setLocationText("📍 Getting your exact location...");
    
    // Use high accuracy with strict settings to get EXACT location
    const options = {
      enableHighAccuracy: true, // Request GPS if available
      timeout: 30000, // 30 seconds timeout
      maximumAge: 0 // Don't use cached position - always get fresh location
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        console.log('📍 EXACT Location Retrieved:', {
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8),
          accuracy: `${Math.round(accuracy)} meters`
        });
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationText(`📍 ${latitude.toFixed(6)}°N, ${longitude.toFixed(6)}°E (±${Math.round(accuracy)}m)`);
        
        // Fetch hospitals using NEW location API
        const hospitals = await fetchNearbyHospitals(latitude, longitude);
        setLoading(false);
        
        if (hospitals.length > 0) {
          toast({ 
            title: "✅ Location Detected!", 
            description: `Found ${hospitals.length} real hospitals within ${MAX_DISTANCE_KM}km` 
          });
        } else {
          toast({ 
            title: "No Results", 
            description: `No hospitals found within ${MAX_DISTANCE_KM}km. The area may be remote.`,
            variant: "default"
          });
        }
      },
      (error) => {
        setLoading(false);
        let message = "Could not get your location";
        if (error.code === 1) message = "❌ Please allow location access in your browser settings";
        if (error.code === 2) message = "❌ Location unavailable - please enable GPS/Location services";
        if (error.code === 3) message = "⏱️ Location request timed out - please try again";
        
        console.error('Location Error:', error);
        toast({ title: "Location Error", description: message, variant: "destructive" });
        setLocationText("");
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nearby Hospitals</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Find hospitals within {MAX_DISTANCE_KM}km using OpenStreetMap
              </p>
              {dataSource && <Badge variant="outline">Source: {dataSource}</Badge>}
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleUseMyLocation} disabled={loading} className="gap-2">
                  <Locate className="w-4 h-4" />
                  {loading ? "Getting Exact Location..." : "Use My Location"}
                </Button>
                {userLocation && (
                  <Button variant="outline" onClick={searchNearbyOnMaps} className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View All on Google Maps
                  </Button>
                )}
              </div>
              
              {locationText && (
                <p className="text-sm text-muted-foreground pt-2 border-t">{locationText}</p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyHospitals.map((hospital, index) => (
                  <Card key={hospital.id} className={`card-hover animate-fade-in ${index === 0 ? 'ring-2 ring-primary/30' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{hospital.name}</h3>
                            {index === 0 && <Badge className="text-xs">Nearest</Badge>}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{hospital.address}</span>
                          </div>
                        </div>
                        {hospital.emergencyAvailable && (
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span>{hospital.rating}</span>
                          <span className="text-muted-foreground">({hospital.reviews})</span>
                        </div>
                        <span className="text-primary font-medium">{hospital.distance} km</span>
                      </div>

                      {hospital.phone && hospital.phone !== 'N/A' && (
                        <p className="text-sm text-muted-foreground mb-4">📞 {hospital.phone}</p>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}&query_place_id=${hospital.place_id}`, '_blank')}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          View on Maps
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigateToHospital(hospital)} title="Get Directions">
                          <Navigation className="w-4 h-4" />
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
                  <LeafletMap 
                    userLocation={userLocation}
                    locations={nearbyHospitals}
                    type="hospital"
                    onMarkerClick={(hospital) => navigateToHospital(hospital)}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {nearbyHospitals.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Find Hospitals Near You</h3>
            <p className="text-muted-foreground mb-4">Click "Use My Location" to discover hospitals within {MAX_DISTANCE_KM}km</p>
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

export default Hospitals;
