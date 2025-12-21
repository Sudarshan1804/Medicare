import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, X, ExternalLink, MapPin, Clock, Route } from "lucide-react";
import 'leaflet/dist/leaflet.css';

// Custom markers
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate estimated time (assuming average speed of 40 km/h in city)
const calculateDuration = (distanceKm) => {
  const hours = distanceKm / 40; // Average city speed
  const minutes = Math.round(hours * 60);
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs} hr ${mins} min`;
};

const NavigationDialog = ({ 
  isOpen, 
  onClose, 
  destination, 
  userLocation,
  type = "place" 
}) => {
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);

  // Calculate route info when dialog opens
  useEffect(() => {
    if (isOpen && userLocation && destination) {
      console.log('🗺️ NavigationDialog opened with:');
      console.log('  User Location:', userLocation);
      console.log('  Destination:', destination);
      console.log('  Destination Name:', destination.name);
      console.log('  Destination Address:', destination.address);
      console.log('  Destination Coordinates:', { lat: destination.lat, lng: destination.lng });
      
      const distance = calculateDistance(
        parseFloat(userLocation.lat),
        parseFloat(userLocation.lng),
        parseFloat(destination.lat),
        parseFloat(destination.lng)
      );
      
      setRouteInfo({
        distance: `${distance.toFixed(2)} km`,
        duration: calculateDuration(distance)
      });

      console.log('📏 Route calculated:', {
        from: { lat: userLocation.lat, lng: userLocation.lng },
        to: { lat: destination.lat, lng: destination.lng },
        distance: `${distance.toFixed(2)} km`,
        duration: calculateDuration(distance)
      });
    }
  }, [isOpen, userLocation, destination]);

  if (!destination) return null;

  // Get center point between user and destination
  const centerLat = (parseFloat(userLocation?.lat || 0) + parseFloat(destination.lat)) / 2;
  const centerLng = (parseFloat(userLocation?.lng || 0) + parseFloat(destination.lng)) / 2;

  // Direct line path between user and destination
  const pathPositions = userLocation ? [
    [parseFloat(userLocation.lat), parseFloat(userLocation.lng)],
    [parseFloat(destination.lat), parseFloat(destination.lng)]
  ] : [];

  // Get external navigation URLs
  const getGoogleMapsUrl = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
      console.log('🔗 Google Maps URL:', url);
      console.log('   From:', `${userLocation.lat},${userLocation.lng}`);
      console.log('   To:', `${destination.lat},${destination.lng}`);
      console.log('   Destination Name:', destination.name);
      return url;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;
    console.log('🔗 Google Maps Search URL:', url);
    return url;
  };

  const getAppleMapsUrl = () => {
    return `http://maps.apple.com/?daddr=${destination.lat},${destination.lng}&saddr=${userLocation?.lat || ''},${userLocation?.lng || ''}`;
  };

  const getWazeUrl = () => {
    return `https://waze.com/ul?ll=${destination.lat},${destination.lng}&navigate=yes`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Navigation to {destination?.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Directions to {destination?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{destination?.address || 'Address not available'}</p>
          </div>
          
          {routeInfo && (
            <div className="flex gap-3 flex-wrap">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {routeInfo.distance}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {routeInfo.duration}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-[400px] border-y">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {userLocation && (
              <Marker
                position={[parseFloat(userLocation.lat), parseFloat(userLocation.lng)]}
                icon={userIcon}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">Your Location</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination marker */}
            <Marker
              position={[parseFloat(destination.lat), parseFloat(destination.lng)]}
              icon={destinationIcon}
            >
              <Popup>
                <div>
                  <p className="font-semibold">{destination.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{destination.address}</p>
                </div>
              </Popup>
            </Marker>

            {/* Direct path line */}
            {pathPositions.length === 2 && (
              <Polyline
                positions={pathPositions}
                color="#3b82f6"
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
          </MapContainer>
        </div>

        <div className="p-6 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
            >
              <img src="https://www.google.com/images/branding/product/ico/maps_32dp.ico" alt="" className="w-4 h-4 mr-2" />
              Google Maps
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(getAppleMapsUrl(), '_blank')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Apple Maps
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(getWazeUrl(), '_blank')}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Waze
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationDialog;
