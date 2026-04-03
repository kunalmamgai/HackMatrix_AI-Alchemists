import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Shoe SVG (simple silhouette) as data URL
const shoeSvg = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path fill='%2310b981' d='M2 15c1-2 4-3 6-3s5 1 7 1 5-1 6-1 1 3 1 3-3 2-6 2-7-1-9-1-4 1-5 0-1-1-1-1z'/>
  </svg>
`);

// Create circular DivIcons with shoe image inside
const shoeIcon = new L.DivIcon({
  className: 'shoe-div-icon',
  html: `<div style="width:34px;height:34px;border-radius:50%;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid white;background:#10b981;display:flex;align-items:center;justify-content:center"><img src="data:image/svg+xml,${shoeSvg}" style="width:20px;height:20px;display:block"/></div>` ,
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

const selectedShoeIcon = new L.DivIcon({
  className: 'shoe-div-icon-selected',
  html: `<div style="width:40px;height:40px;border-radius:50%;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;background:#59d3ea;display:flex;align-items:center;justify-content:center"><img src="data:image/svg+xml,${shoeSvg}" style="width:22px;height:22px;display:block"/></div>` ,
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function MapComponent({ locations, selectedLocation, onSelectLocation, darkMode }) {
  // Keep a consistent India-first starting viewport.
  const initialCenter = [22.5937, 78.9629];
  const initialZoom = 5;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
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

        {locations.map((location) => {
          const isSelected = selectedLocation?.id === location.id;
          // Use `markerImage` for map markers so list/tab images don't affect markers.
          // Falls back to shoe SVG when `markerImage` is not provided.
          const img = location.markerImage;
          const html = img
            ? `<div style="width:${isSelected ? 40 : 34}px;height:${isSelected ? 40 : 34}px;border-radius:50%;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid white;display:flex;align-items:center;justify-content:center;background:${isSelected ? '#59d3ea' : '#10b981'}"><img src=\"${img}\" style=\"width:100%;height:100%;object-fit:cover;display:block\"/></div>`
            : `<div style="width:${isSelected ? 40 : 34}px;height:${isSelected ? 40 : 34}px;border-radius:50%;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid white;display:flex;align-items:center;justify-content:center;background:${isSelected ? '#59d3ea' : '#10b981'}"><img src=\"data:image/svg+xml,${shoeSvg}\" style=\"width:60%;height:60%;display:block\"/></div>`;

          const icon = new L.DivIcon({
            className: isSelected ? 'shoe-div-icon-selected' : 'shoe-div-icon',
            html,
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
                  <p className="text-xs text-gray-600">{location.phone}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-xs font-semibold">{location.rating}</span>
                    <span className="text-xs text-gray-500">({location.reviews})</span>
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
