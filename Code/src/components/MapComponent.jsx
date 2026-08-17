import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Crosshair, LocateFixed, Loader2, ZoomIn } from 'lucide-react';
import L from 'leaflet';

// Recycle glyph (white stroke) used inside the marker circle when no photo
// is available — reads clearly against the forest/gold marker backgrounds.
const recycleSvg = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
    <path d='M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5'/>
    <path d='M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12'/>
    <path d='m14 16-3 3 3 3'/>
    <path d='M8.293 13.596 7.196 9.5 3.1 10.598'/>
    <path d='m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843'/>
    <path d='m13.378 9.633 4.096 1.098 1.097-4.096'/>
  </svg>
`);

// "You are here" marker — white dot with a deep-forest ring that pulses outward
// (see the user-location keyframes in index.css). Distinct from the solid
// colored center markers while staying on the botanical palette.
const userLocationIcon = new L.DivIcon({
  className: 'user-location-icon',
  html: '<div class="user-location-dot"><span class="user-location-ring"></span></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

// Overlay controls: recenter-to-marker-set, geolocate-to-my-position, and a
// live zoom-level readout. Rendered inside the leaflet container so it can use
// useMap(); it stacks above the panes and the default zoom control via z-index.
function MapControls({ locations, onLocate }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState('');
  const errorTimerRef = useRef(null);

  useEffect(() => {
    const sync = () => setZoom(map.getZoom());
    sync();
    map.on('zoomend', sync);
    return () => {
      map.off('zoomend', sync);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [map]);

  const showError = (msg) => {
    setLocateError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setLocateError(''), 4000);
  };

  const handleRecenter = () => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(
      locations.map((l) => [l.coordinates.lat, l.coordinates.lng])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10, animate: false });
  };

  const handleLocate = () => {
    if (!('geolocation' in navigator)) {
      showError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], Math.max(map.getZoom(), 13), {
          animate: false,
        });
        onLocate({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        showError(
          err && err.code === err.PERMISSION_DENIED
            ? 'Location permission denied — enable it to center the map on you.'
            : 'Could not get your location. Check your connection and try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  return (
    <div className="absolute top-3 right-3 z-[1100] flex flex-col items-end gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleRecenter}
          title="Recenter on all centers"
          aria-label="Recenter map on all centers"
          className="w-10 h-10 rounded-xl bg-white shadow-md border border-sage-200 flex items-center justify-center text-ink-700 hover:bg-forest-50 hover:text-forest-700 hover:border-forest-300 transition-colors"
        >
          <Crosshair size={18} />
        </button>
        <button
          onClick={handleLocate}
          disabled={locating}
          title="Center on my location"
          aria-label="Center map on my location"
          className={`w-10 h-10 rounded-xl shadow-md border flex items-center justify-center transition-colors ${
            locating
              ? 'bg-forest-50 text-forest-600 border-forest-300 cursor-wait'
              : 'bg-white text-ink-700 border-sage-200 hover:bg-forest-50 hover:text-forest-700 hover:border-forest-300'
          }`}
        >
          {locating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
        </button>
      </div>
      <div
        className="pointer-events-auto rounded-xl bg-white shadow-md border border-sage-200 px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-ink-700 tabular-nums"
        title="Current zoom level"
      >
        <ZoomIn size={13} className="text-forest-600" />
        {zoom}
      </div>
      {locateError && (
        <div className="pointer-events-auto max-w-[220px] rounded-xl bg-white shadow-lg border border-danger-200 px-3 py-2 text-xs font-medium text-danger-600">
          {locateError}
        </div>
      )}
    </div>
  );
}

// Drives the map camera: fits the viewport to the current marker set (on mount
// and whenever the set changes via filters), and smoothly zooms to a marker
// when a center is selected from the list.
function MapController({ locations, selectedLocation }) {
  const map = useMap();

  const locationKey = locations.map((l) => l.id).join(',');
  const prevKeyRef = useRef('');
  useEffect(() => {
    if (locations.length === 0) return;
    if (prevKeyRef.current === locationKey) return;
    prevKeyRef.current = locationKey;
    const bounds = L.latLngBounds(
      locations.map((l) => [l.coordinates.lat, l.coordinates.lng])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10, animate: false });
  }, [locationKey, locations, map]);

  const prevSelectedIdRef = useRef(null);
  useEffect(() => {
    if (!selectedLocation) return;
    if (prevSelectedIdRef.current === selectedLocation.id) return;
    prevSelectedIdRef.current = selectedLocation.id;
    map.setView(
      [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
      Math.max(map.getZoom(), 11),
      { animate: false }
    );
  }, [selectedLocation, map]);

  return null;
}

export default function MapComponent({ locations, selectedLocation, onSelectLocation }) {
  // Fallback viewport — immediately replaced by the auto-fit in MapController.
  const initialCenter = [22.5937, 78.9629];
  const initialZoom = 5;
  const [userPosition, setUserPosition] = useState(null);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <MapController locations={locations} selectedLocation={selectedLocation} />

        <MapControls locations={locations} onLocate={setUserPosition} />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userLocationIcon}>
            <Popup>
              <span className="text-sm font-semibold">You are here</span>
            </Popup>
          </Marker>
        )}

        {locations.map((location) => {
          const isSelected = selectedLocation?.id === location.id;
          // Use `markerImage` for map markers so list/tab images don't affect markers.
          // Falls back to the recycle glyph when `markerImage` is not provided.
          const img = location.markerImage;
          const html = img
            ? `<div style="width:${isSelected ? 40 : 34}px;height:${isSelected ? 40 : 34}px;border-radius:50%;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid white;display:flex;align-items:center;justify-content:center;background:${isSelected ? '#e0a527' : '#2e5d46'}"><img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block"/></div>`
            : `<div style="width:${isSelected ? 40 : 34}px;height:${isSelected ? 40 : 34}px;border-radius:50%;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid white;display:flex;align-items:center;justify-content:center;background:${isSelected ? '#e0a527' : '#2e5d46'}"><img src="data:image/svg+xml,${recycleSvg}" style="width:${isSelected ? 24 : 20}px;height:${isSelected ? 24 : 20}px;display:block"/></div>`;

          const icon = new L.DivIcon({
            className: isSelected ? 'recycle-div-icon-selected' : 'recycle-div-icon',
            html,
            iconSize: isSelected ? [40, 40] : [34, 34],
            iconAnchor: isSelected ? [20, 40] : [17, 34],
            popupAnchor: isSelected ? [0, -40] : [0, -34],
          });

          return (
            <Marker
              key={location.id}
              position={[location.coordinates.lat, location.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                click: (e) => {
                  onSelectLocation(location);
                  if (e && e.target && typeof e.target.openPopup === 'function') {
                    e.target.openPopup();
                  }
                },
              }}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  {location.image && (
                    <div className="mb-2 w-full h-24 overflow-hidden rounded">
                      <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold mb-1">{location.name}</h3>
                  <p className="text-xs mb-1">{location.address}</p>
                  {location.description && <p className="text-xs mb-1">{location.description}</p>}
                  <p className="text-xs text-ink-500">{location.phone}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-gold-500">★</span>
                    <span className="ml-1 text-xs font-semibold">{location.rating}</span>
                    <span className="text-xs text-ink-400">({location.reviews})</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
