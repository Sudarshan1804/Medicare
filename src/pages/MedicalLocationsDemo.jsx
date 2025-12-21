/**
 * Medical Locations Demo Page
 * 
 * This is a standalone demo showcasing the medical locations feature
 * using OpenStreetMap, Leaflet, and Overpass API (completely free!)
 * 
 * Features:
 * - Auto-detect user location
 * - Find hospitals and pharmacies within 10km
 * - Interactive map with markers
 * - No API keys or billing required
 */

import { useState } from "react";
import { MapPin, Navigation, Locate, Hospital, Pill } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { toast } from "@/hooks/use-toast.js";
import LeafletMap from "@/components/maps/LeafletMap.jsx";
import { locationAPI } from "@/lib/api.js";

const MedicalLocationsDemo = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [activeTab, setActiveTab] = useState("hospitals");

  // Fetch both hospitals and pharmacies
  const fetchMedicalLocations = async (lat, lng) => {
    try {
      setLoading(true);
      
      // Fetch hospitals
      const hospitalResponse = await locationAPI.getNearby(lat, lng, 10, 'hospital');
      if (hospitalResponse.success) {
        const hospitalData = hospitalResponse.items.map(item => ({
          ...item,
          type: 'hospital',
          distance: item.distance_km
        }));
        setHospitals(hospitalData);
        console.log(`✅ Found ${hospitalData.length} hospitals`);
      }

      // Fetch pharmacies
      const pharmacyResponse = await locationAPI.getNearby(lat, lng, 10, 'pharmacy');
      if (pharmacyResponse.success) {
        const pharmacyData = pharmacyResponse.items.map(item => ({
          ...item,
          type: 'pharmacy',
          distance: item.distance_km
        }));
        setPharmacies(pharmacyData);
        console.log(`✅ Found ${pharmacyData.length} pharmacies`);
      }

      setLoading(false);

      const totalLocations = hospitals.length + pharmacies.length;
      toast({
        title: "✅ Medical Locations Found!",
        description: `Found ${hospitalResponse.items.length} hospitals and ${pharmacyResponse.items.length} pharmacies within 10km`,
      });
    } catch (error) {
      console.error('❌ Error fetching medical locations:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to load medical locations",
        variant: "destructive"
      });
    }
  };

  // Get user's current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ 
        title: "Error", 
        description: "Geolocation is not supported by your browser", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    setLocationText("📍 Getting your exact location...");

    const options = {
      enableHighAccuracy: true, // Request GPS if available
      timeout: 30000, // 30 seconds timeout
      maximumAge: 0 // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        console.log('📍 Location Retrieved:', {
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8),
          accuracy: `${Math.round(accuracy)} meters`
        });
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationText(`📍 ${latitude.toFixed(6)}°N, ${longitude.toFixed(6)}°E (±${Math.round(accuracy)}m)`);
        
        // Fetch medical locations
        fetchMedicalLocations(latitude, longitude);
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

  const currentLocations = activeTab === 'hospitals' ? hospitals : pharmacies;
  const allLocations = [...hospitals, ...pharmacies];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏥 Medical Locations Finder
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Find nearby hospitals and pharmacies using OpenStreetMap
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-white">
              ✅ No API Keys Required
            </Badge>
            <Badge variant="outline" className="bg-white">
              ✅ Completely Free
            </Badge>
            <Badge variant="outline" className="bg-white">
              ✅ Real-time Data
            </Badge>
          </div>
        </div>

        {/* Location Control */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleUseMyLocation} 
                disabled={loading} 
                size="lg"
                className="w-full sm:w-auto gap-2"
              >
                <Locate className="w-5 h-5" />
                {loading ? "Getting Location..." : "📍 Find Medical Locations Near Me"}
              </Button>
              
              {locationText && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">{locationText}</p>
                </div>
              )}

              {(hospitals.length > 0 || pharmacies.length > 0) && (
                <div className="flex gap-4 text-center justify-center">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">{hospitals.length} Hospitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{pharmacies.length} Pharmacies</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {(hospitals.length > 0 || pharmacies.length > 0) && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="hospitals" className="gap-2">
                <Hospital className="w-4 h-4" />
                Hospitals ({hospitals.length})
              </TabsTrigger>
              <TabsTrigger value="pharmacies" className="gap-2">
                <Pill className="w-4 h-4" />
                Pharmacies ({pharmacies.length})
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <MapPin className="w-4 h-4" />
                Map View
              </TabsTrigger>
            </TabsList>

            {/* Hospitals List */}
            <TabsContent value="hospitals">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitals.map((hospital, index) => (
                  <Card key={hospital.id || index} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2">{hospital.name}</CardTitle>
                        {index === 0 && <Badge variant="default">Nearest</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{hospital.address || 'Address not available'}</span>
                        </p>
                        <p className="text-blue-600 font-semibold">
                          📏 {typeof hospital.distance === 'number' 
                            ? hospital.distance.toFixed(2) 
                            : hospital.distance} km away
                        </p>
                        {hospital.phone && (
                          <p className="text-muted-foreground">📞 {hospital.phone}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          📍 {hospital.lat.toFixed(6)}, {hospital.lng.toFixed(6)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Pharmacies List */}
            <TabsContent value="pharmacies">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pharmacies.map((pharmacy, index) => (
                  <Card key={pharmacy.id || index} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2">{pharmacy.name}</CardTitle>
                        {index === 0 && <Badge variant="default">Nearest</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{pharmacy.address || 'Address not available'}</span>
                        </p>
                        <p className="text-blue-600 font-semibold">
                          📏 {typeof pharmacy.distance === 'number' 
                            ? pharmacy.distance.toFixed(2) 
                            : pharmacy.distance} km away
                        </p>
                        {pharmacy.phone && (
                          <p className="text-muted-foreground">📞 {pharmacy.phone}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          📍 {pharmacy.lat.toFixed(6)}, {pharmacy.lng.toFixed(6)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Map View */}
            <TabsContent value="map">
              <Card className="overflow-hidden shadow-lg">
                <div className="h-[600px]">
                  <LeafletMap 
                    userLocation={userLocation}
                    locations={allLocations}
                    type={activeTab === 'hospitals' ? 'hospital' : 'pharmacy'}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {!loading && hospitals.length === 0 && pharmacies.length === 0 && (
          <Card className="p-12 text-center shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Find Medical Locations</h3>
              <p className="text-muted-foreground mb-6">
                Click the button above to detect your location and find nearby hospitals and pharmacies within 10km radius.
              </p>
              <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">How it works:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Uses your browser's geolocation API (GPS)</li>
                  <li>✅ Fetches data from OpenStreetMap (Overpass API)</li>
                  <li>✅ Displays results on interactive Leaflet map</li>
                  <li>✅ Shows exact coordinates and distances</li>
                  <li>✅ Completely free - no API keys or billing</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Info Footer */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">🗺️ Powered by Open Source Technologies</h4>
              <p className="text-sm text-muted-foreground mb-3">
                This feature uses OpenStreetMap for maps, Leaflet for visualization, 
                and Overpass API for real-time medical location data.
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>© OpenStreetMap contributors</span>
                <span>•</span>
                <span>Leaflet by Vladimir Agafonkin</span>
                <span>•</span>
                <span>Overpass API</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalLocationsDemo;
