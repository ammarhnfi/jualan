"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Eye, EyeOff } from 'lucide-react';

const getCategoryIcon = (categoryId) => {
  if (categoryId === 1) return "🍔";
  if (categoryId === 2) return "🛠️";
  if (categoryId === 3) return "🛍️";
  return "📍";
}

const renderDistance = (meters) => {
  if (meters === undefined || meters === null) return null;
  const d = parseFloat(meters);
  let color = "text-red-600 bg-red-50 border-red-200";
  let text = `> 5 km`;
  if (d < 500) {
    color = "text-green-600 bg-green-50 border-green-200";
    text = `${d.toFixed(0)} m`;
  } else if (d < 5000) {
    color = "text-yellow-600 bg-yellow-50 border-yellow-200";
    text = `${(d/1000).toFixed(1)} km`;
  } else {
    text = `${(d/1000).toFixed(1)} km`;
  }
  return <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${color}`}>{text}</span>;
}

const userIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Fix leaflet default icon issue with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Custom custom icon to be styled with tailwind or plain css
const customMarketIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export default function DepokMap({ listings = [], onBoundsChange }) {
  const [map, setMap] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isMultiPopup, setIsMultiPopup] = useState(false);
  const [userPos, setUserPos] = useState(null);

  // Depok center coordinates
  const depokCenter = [-6.4025, 106.7942];

  useEffect(() => {
    fetch('/depok-boundaries.geojson')
      .then(res => {
        if (!res.ok) throw new Error("GeoJSON not found");
        return res.json();
      })
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Failed to load Depok boundaries:", err));
  }, []);

  useEffect(() => {
    if (map) {
      map.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
      map.on('locationfound', function(e) {
        setUserPos(e.latlng);
      });
      map.on('moveend', () => {
        const center = map.getCenter();
        if (onBoundsChange) onBoundsChange(center.lat, center.lng);
      });
    }
  }, [map, onBoundsChange]);

  return (
    <div className="h-full w-full relative z-0">
      {/* Floating Eye Control */}
      <div className="absolute bottom-24 right-4 md:bottom-28 md:right-8 z-[400] flex flex-col gap-2">
        <button 
          onClick={() => setIsMultiPopup(!isMultiPopup)}
          className={`p-3 rounded-full shadow-lg border-2 transition-all flex items-center justify-center ${
            isMultiPopup ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {isMultiPopup ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>

      <MapContainer 
        center={depokCenter} 
        zoom={13} 
        zoomControl={false}
        className="h-full w-full"
        ref={setMap}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            style={{ 
              color: '#3b82f6', 
              weight: 1, 
              opacity: 0.6,
              fillOpacity: 0.05
            }} 
          />
        )}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
             <Popup>📍 Lokasi Anda Saat Ini</Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {listings.map((listing) => (
            <Marker 
              key={listing.id} 
              position={[listing.latitude, listing.longitude]}
              icon={customMarketIcon}
            >
              <Popup autoClose={!isMultiPopup} closeOnClick={!isMultiPopup}>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h3 className="font-bold text-lg leading-tight flex-1">
                      {getCategoryIcon(listing.category_id)} {listing.title}
                    </h3>
                  </div>
                  <div className="mb-2">
                     {renderDistance(listing.distance_meters)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                  <p className="font-semibold text-blue-600 mb-2">
                    {listing.price ? `Rp ${parseFloat(listing.price).toLocaleString('id-ID')}` : 'Harga tidak dicantumkan'}
                  </p>
                  <a 
                    href={`https://wa.me/${listing.contact.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full text-center bg-green-500 text-white py-2 rounded-md font-medium"
                  >
                    WhatsApp
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
