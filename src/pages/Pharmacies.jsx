import { useState, useEffect } from "react";
import { MapPin, Star, Navigation, Locate, ExternalLink, Map, List, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label.jsx";
import LeafletMap from "@/components/maps/LeafletMap.jsx";
import NavigationDialog from "@/components/maps/NavigationDialog.jsx";
import { locationAPI } from "@/lib/api.js";

const MAX_DISTANCE_KM = 50; // Search within 30km radius for nearby stores

const Pharmacies = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [dataSource, setDataSource] = useState("");

  // Fetch nearby pharmacies using the NEW location API (Google Places with MongoDB fallback)
  const fetchNearbyPharmacies = async (lat, lng) => {
    try {
      console.log(`🔍 Fetching pharmacies near ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
      // Call the new unified location API
      const response = await locationAPI.getNearby(lat, lng, MAX_DISTANCE_KM, 'pharmacy');
      
      if (response.success) {
        console.log(`✅ Received ${response.count} pharmacies from ${response.source}`);
        setDataSource(response.source === 'openstreetmap' ? 'OpenStreetMap' : response.source === 'places' ? 'Google Places' : 'Database');
        
        // Format pharmacies for display
        const pharmacies = response.items.map(item => ({
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
          isOpen24x7: item.isOpen24x7 || false,
          photos: item.photos || [],
          hasHomeDelivery: true, // Default for places
        }));
        
        setNearbyPharmacies(pharmacies);
        return pharmacies;
      } else {
        throw new Error(response.message || 'Failed to fetch pharmacies');
      }
    } catch (error) {
      console.error('❌ Error fetching pharmacies:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load pharmacies from server",
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
    setLocationText("📍 Getting your location...");
    
    // Use high accuracy with optimized settings
    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Reduced to 15 seconds for faster response
      maximumAge: 60000 // Allow 1-minute cached location for faster loading
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        console.log('📍 Location Retrieved:', {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: `${Math.round(accuracy)}m`
        });
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationText(`📍 Location confirmed • Searching nearby pharmacies...`);
        
        // Fetch pharmacies using NEW location API
        const pharmacies = await fetchNearbyPharmacies(latitude, longitude);
        setLoading(false);
        
        if (pharmacies.length > 0) {
          toast({ 
            title: "✅ Location Detected!", 
            description: `Found ${pharmacies.length} real pharmacies within ${MAX_DISTANCE_KM}km` 
          });
        } else {
          toast({ 
            title: "No Results", 
            description: `No pharmacies found within ${MAX_DISTANCE_KM}km. The area may be remote.`,
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

  const navigateToPharmacy = (pharmacy) => {
    console.log('🧭 Navigate to Pharmacy:', {
      name: pharmacy.name,
      lat: pharmacy.lat,
      lng: pharmacy.lng,
      address: pharmacy.address,
      distance: pharmacy.distance
    });
    setNavigationTarget(pharmacy);
    setShowNavigation(true);
  };

  const searchNearbyOnMaps = () => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/search/pharmacy/@${userLocation.lat},${userLocation.lng},14z`, "_blank");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nearby Pharmacies</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Find pharmacies within {MAX_DISTANCE_KM}km using OpenStreetMap
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

        {nearbyPharmacies.length > 0 && (
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
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Loading pharmacies...</span>
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyPharmacies.map((pharmacy, index) => (
                  <Card key={pharmacy.id} className={`card-hover animate-fade-in ${index === 0 ? 'ring-2 ring-primary/30' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{pharmacy.name}</h3>
                            {index === 0 && <Badge className="text-xs">Nearest</Badge>}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{pharmacy.address}</span>
                          </div>
                        </div>
                        <Badge variant={pharmacy.isOpen ? "success" : "secondary"}>
                          {pharmacy.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span>{pharmacy.rating}</span>
                        </div>
                        <span className="text-primary font-medium">{pharmacy.distance} km</span>
                        {pharmacy.hasHomeDelivery && (
                          <Badge variant="outline" className="text-xs">
                            🚚 Delivery
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {pharmacy.hasHomeDelivery ? (
                          <Link to={`/pharmacy/${pharmacy.id || pharmacy._id}`} className="flex-1">
                            <Button className="w-full" size="sm">View Medicines</Button>
                          </Link>
                        ) : (
                          <Button className="w-full" size="sm" disabled title="No delivery available">
                            No Delivery Available
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => navigateToPharmacy(pharmacy)} title="Navigate">
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
                    locations={nearbyPharmacies}
                    type="pharmacy"
                    onMarkerClick={(pharmacy) => navigateToPharmacy(pharmacy)}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {nearbyPharmacies.length === 0 && (
          <Card className="p-12 text-center">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Find Pharmacies Near You</h3>
            <p className="text-muted-foreground mb-4">Click "Use My Location" to discover pharmacies within {MAX_DISTANCE_KM}km</p>
          </Card>
        )}
      </div>

      {/* In-App Navigation Dialog */}
      <NavigationDialog
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        destination={navigationTarget}
        userLocation={userLocation}
        type="pharmacy"
      />
    </div>
  );
};

export default Pharmacies;
