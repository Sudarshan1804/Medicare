import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDQT2Il6Rz0BfRQDSAXv-GoUr1KgiENSUw';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

const defaultCenter = {
  lat: 31.2518,
  lng: 75.7037
};

const LocationMap = ({ locations = [], userLocation, onLocationSelect, onMarkerClick, type = 'hospital' }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update center when user location changes
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setCenter({
        lat: parseFloat(userLocation.lat),
        lng: parseFloat(userLocation.lng)
      });
    }
  }, [userLocation]);

  // Fit bounds to show all locations
  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      
      if (userLocation) {
        bounds.extend({ 
          lat: parseFloat(userLocation.lat), 
          lng: parseFloat(userLocation.lng) 
        });
      }
      
      locations.forEach(loc => {
        if (loc.lat && loc.lng) {
          bounds.extend({ 
            lat: parseFloat(loc.lat), 
            lng: parseFloat(loc.lng) 
          });
        }
      });
      
      map.fitBounds(bounds);
    }
  }, [map, locations, userLocation]);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {/* User location marker */}
      {userLocation && userLocation.lat && userLocation.lng && (
        <Marker
          position={{ 
            lat: parseFloat(userLocation.lat), 
            lng: parseFloat(userLocation.lng) 
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
          title="Your Location"
        />
      )}

      {/* Location markers */}
      {locations.map((location, index) => {
        if (!location.lat || !location.lng) return null;

        const markerColor = type === 'hospital' ? '#ef4444' : '#10b981';

        return (
          <Marker
            key={location.id || index}
            position={{ 
              lat: parseFloat(location.lat), 
              lng: parseFloat(location.lng) 
            }}
            onClick={() => handleMarkerClick(location)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: markerColor,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title={location.name}
          />
        );
      })}

      {/* Info window for selected location */}
      {selectedLocation && (
        <InfoWindow
          position={{ 
            lat: parseFloat(selectedLocation.lat), 
            lng: parseFloat(selectedLocation.lng) 
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-base mb-2">{selectedLocation.name}</h3>
            {selectedLocation.address && (
              <p className="text-sm text-gray-600 mb-2 flex items-start gap-1">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{selectedLocation.address}</span>
              </p>
            )}
            {selectedLocation.distance && (
              <p className="text-sm text-gray-600 mb-3">
                Distance: {selectedLocation.distance} km
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default LocationMap;
