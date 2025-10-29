import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';

// Set the initial map center to first route point
const INITIAL_CENTER = [17.385044, 78.486671];
const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Utility for distance and speed
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const dLat = lat2 - lat1, dLon = lon2 - lon1;
  return Math.sqrt(dLat * dLat + dLon * dLon) * 111.32;
};
const calculateSpeedKmH = (idx, routeData) => {
  if (idx === 0 || routeData.length <= 1) return '0.00';
  const curr = routeData[idx], prev = routeData[idx-1];
  if (!prev || !curr) return '0.00';
  const distanceKm = calculateDistanceKm(prev.lat, prev.lng, curr.lat, curr.lng);
  const timeDeltaHours = (new Date(curr.timestamp) - new Date(prev.timestamp)) / (1000 * 60 * 60);
  return timeDeltaHours > 0 ? (distanceKm / timeDeltaHours).toFixed(2) : 'N/A';
};

export default function VehicleMap() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Fetch route data
  useEffect(() => {
    fetch('/dummy-route.json')
      .then(res => res.json())
      .then(data => setRouteData(
        data.map(p => ({ lat: p.latitude, lng: p.longitude, timestamp: p.timestamp }))
      ));
  }, []);

  // Simulation logic
  useEffect(() => {
    if (isPlaying && routeData.length && currentIndex < routeData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => Math.min(i + 1, routeData.length - 1));
      }, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIndex, routeData]);

  // Vehicle position & handlers
  const currentPosition = routeData[currentIndex] || routeData[0] || { lat: INITIAL_CENTER[0], lng: INITIAL_CENTER[1] };
  const fullRouteCoords = routeData.map(p => [p.lat, p.lng]);
  const travelledRoute = routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng]);
  const togglePlay = () => setIsPlaying(v => !v);
  const resetSimulation = () => { setIsPlaying(false); setCurrentIndex(0); };

  return (
    <div className="h-screen w-full relative font-sans bg-gray-50">
      <MapContainer center={INITIAL_CENTER} zoom={16} scrollWheelZoom className="h-[60vh] w-full z-0 rounded-md shadow-lg">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeData.length > 0 && <Polyline positions={fullRouteCoords} pathOptions={{ color: 'gray', weight: 3, opacity: 0.5 }} />}
        <Polyline positions={travelledRoute} pathOptions={{ color: 'red', weight: 6, opacity: 0.8 }} />
        <Marker position={[currentPosition.lat, currentPosition.lng]} icon={vehicleIcon} />
      </MapContainer>
      {/* Controls and Metadata */}
      <div className="absolute top-4 right-4 z-[1000] p-4 bg-white shadow-xl rounded-lg w-full max-w-xs md:max-w-sm">
        <h2 className="text-lg font-bold mb-3">Vehicle Status</h2>
        <div className="space-y-1 text-sm">
          <p>
            Coordinate: <span className="font-mono text-blue-600">{currentPosition.lat?.toFixed(6)}, {currentPosition.lng?.toFixed(6)}</span>
          </p>
          <p>Timestamp: <span className="font-medium text-gray-700">{currentPosition.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}</span></p>
          <p>Speed: <span className="font-medium text-gray-700">{calculateSpeedKmH(currentIndex, routeData)} km/h</span></p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={togglePlay}
                  className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition ${isPlaying ? "bg-red-500" : "bg-green-500"}`}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={resetSimulation}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
