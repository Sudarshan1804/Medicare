/**
 * LeafletMap Component - OpenStreetMap Integration
 * 
 * Features:
 * - Uses OpenStreetMap tiles (completely free, no API keys)
 * - Displays user location with a blue marker
 * - Shows hospitals with red markers
 * - Shows pharmacies with green markers
 * - Clickable markers with popups showing name, address, and distance
 * - Auto-fits bounds to show all locations
 * - Responsive and mobile-friendly
 */

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icon for user location (blue)
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Custom icon for hospitals (red)
const hospitalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom icon for pharmacies (green)
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" stroke="white" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

/**
 * Component to handle map bounds adjustment
 * Automatically fits all markers in view
 */
const MapBoundsHandler = ({ locations, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0 || userLocation) {
      const bounds = L.latLngBounds([]);

      // Add user location to bounds
      if (userLocation && userLocation.lat && userLocation.lng) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }

      // Add all location markers to bounds
      locations.forEach(loc => {
        if (loc.lat && loc.lng) {
          bounds.extend([loc.lat, loc.lng]);
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [locations, userLocation, map]);

  return null;
};

/**
 * LeafletMap Component
 * 
 * @param {Array} locations - Array of hospital/pharmacy locations with {id, name, lat, lng, address, distance, type}
 * @param {Object} userLocation - User's current location {lat, lng}
 * @param {Function} onLocationSelect - Callback when a location is selected
 * @param {Function} onMarkerClick - Callback when a marker is clicked
 * @param {String} type - Type of locations ('hospital' or 'pharmacy')
 */
const LeafletMap = ({ 
  locations = [], 
  userLocation, 
  onLocationSelect, 
  onMarkerClick, 
  type = 'hospital' 
}) => {
  const mapRef = useRef(null);

  // Default center (will be overridden by user location or bounds)
  const defaultCenter = [31.2518, 75.7037]; // Jalandhar, Punjab, India
  const center = userLocation && userLocation.lat && userLocation.lng 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  const handleMarkerClick = (location) => {
    if (onMarkerClick) {
      onMarkerClick(location);
    }
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Choose icon based on type
  const getLocationIcon = (locationType) => {
    return locationType === 'pharmacy' ? pharmacyIcon : hospitalIcon;
  };

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
        ref={mapRef}
      >
        {/* OpenStreetMap Tile Layer - FREE, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Handle automatic bounds adjustment */}
        <MapBoundsHandler locations={locations} userLocation={userLocation} />

        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-blue-600">📍 Your Location</p>
                <p className="text-xs text-gray-500 mt-1">
                  {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital/Pharmacy Markers */}
        {locations.map((location, index) => {
          if (!location.lat || !location.lng) return null;

          const icon = getLocationIcon(location.type || type);

          return (
            <Marker
              key={location.id || index}
              position={[location.lat, location.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  {/* Name */}
                  <h3 className="font-bold text-base mb-2 text-gray-800">
                    {location.name}
                  </h3>

                  {/* Type Badge */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      (location.type || type) === 'pharmacy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(location.type || type) === 'pharmacy' ? '💊 Pharmacy' : '🏥 Hospital'}
                    </span>
                  </div>

                  {/* Address */}
                  {location.address && (
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {location.address}
                    </p>
                  )}

                  {/* Distance */}
                  {location.distance && (
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      📏 {typeof location.distance === 'number' 
                        ? location.distance.toFixed(2) 
                        : location.distance} km away
                    </p>
                  )}

                  {/* Phone */}
                  {location.phone && (
                    <p className="text-sm text-gray-700 mb-2">
                      📞 {location.phone}
                    </p>
                  )}

                  {/* Rating */}
                  {location.rating && location.rating > 0 && (
                    <p className="text-sm text-yellow-600 mb-2">
                      ⭐ {location.rating} {location.reviews && `(${location.reviews} reviews)`}
                    </p>
                  )}

                  {/* Coordinates */}
                  <p className="text-xs text-gray-400 mt-2">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
