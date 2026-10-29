import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { parcelApi } from '../services/api';
import ParcelDrawer from '../components/map/ParcelDrawer';
import MapLegend, { LAND_USE_COLORS } from '../components/map/MapLegend';
import {
  Search,
  Layers,
  MapPin,
  Crosshair,
  Compass,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';

// Fix leaflet default icon asset paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Map controller component for smooth flying and zooming
function MapController({ flyTarget }) {
  const map = useMap();
  useEffect(() => {
    if (flyTarget) {
      if (flyTarget.bounds) {
        map.flyToBounds(flyTarget.bounds, { padding: [50, 50], duration: 1.2 });
      } else if (flyTarget.center) {
        map.flyTo(flyTarget.center, flyTarget.zoom || 15, { duration: 1.2 });
      }
    }
  }, [flyTarget, map]);
  return null;
}

const BASE_LAYERS = {
  standard: {
    name: 'Carto Light (Clean)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB, OpenStreetMap contributors',
  },
  satellite: {
    name: 'Satellite (ESRI)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
};

const PUNE_PRESETS = [
  { name: 'All Pune (Overview)', center: [18.56, 73.85], zoom: 12 },
  { name: 'Hinjewadi (IT Park)', center: [18.589, 73.728], zoom: 15 },
  { name: 'Baner (Commercial)', center: [18.560, 73.788], zoom: 15 },
  { name: 'Wakad (Mixed)', center: [18.596, 73.765], zoom: 15 },
  { name: 'Wagholi (Agri/Suburbs)', center: [18.580, 73.985], zoom: 15 },
  { name: 'Hadapsar (Industrial)', center: [18.502, 73.932], zoom: 15 },
];

export default function MapPage() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [flyTarget, setFlyTarget] = useState({ center: [18.56, 73.85], zoom: 12 });
  const [currentBaseLayer, setCurrentBaseLayer] = useState('standard');
  const [selectedLandUseFilter, setSelectedLandUseFilter] = useState('ALL');
  const [layerDropdownOpen, setLayerDropdownOpen] = useState(false);

  useEffect(() => {
    parcelApi.getGeoJson()
      .then((res) => {
        setGeoJsonData(res.data);
      })
      .catch((err) => console.error('Failed to load GeoJSON parcels', err));
  }, []);

  // Filter geoJson features by landUse if requested
  const filteredGeoJson = React.useMemo(() => {
    if (!geoJsonData) return null;
    if (selectedLandUseFilter === 'ALL') return geoJsonData;
    return {
      ...geoJsonData,
      features: geoJsonData.features.filter(
        (f) => f.properties.landUse === selectedLandUseFilter
      ),
    };
  }, [geoJsonData, selectedLandUseFilter]);

  // Style callback for GeoJSON polygons
  const parcelStyle = (feature) => {
    const isSelected = selectedParcel && selectedParcel.id === feature.properties.id;
    const landUse = feature.properties.landUse;
    const meta = LAND_USE_COLORS[landUse] || { stroke: '#0B2545', fill: '#3B82F6' };

    return {
      color: isSelected ? '#F59E0B' : meta.stroke,
      weight: isSelected ? 3.5 : 2,
      opacity: isSelected ? 1 : 0.85,
      fillColor: isSelected ? '#F59E0B' : meta.fill,
      fillOpacity: isSelected ? 0.65 : 0.35,
      dashArray: isSelected ? '4, 4' : null,
    };
  };

  // Event handlers for each polygon
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    const tooltipContent = `
      <div style="font-family: Inter, sans-serif; font-size: 11px; padding: 4px;">
        <strong style="color: #0B2545; display:block; font-size:12px;">Survey No. ${props.surveyNumber}</strong>
        <span style="color: #64748B;">ULPIN: ${props.ulpin}</span><br/>
        <span>Village: <b>${props.village}</b></span><br/>
        <span>Area: <b>${Number(props.areaSqM).toLocaleString()} m²</b></span><br/>
        <span style="display:inline-block; margin-top:3px; padding:1px 6px; border-radius:4px; font-weight:bold; background:#F1F5F9; color:#0F172A;">
          ${props.landUse}
        </span>
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: 'top',
      className: 'parcel-map-tooltip',
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ fillOpacity: 0.7, weight: 3 });
      },
      mouseout: (e) => {
        const l = e.target;
        const isSelected = selectedParcel && selectedParcel.id === feature.properties.id;
        l.setStyle({
          fillOpacity: isSelected ? 0.65 : 0.35,
          weight: isSelected ? 3.5 : 2,
        });
      },
      click: () => {
        setSelectedParcel(props);
        const bounds = layer.getBounds();
        setFlyTarget({ bounds });
      },
    });
  };

  // Search logic
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim() || !geoJsonData) {
      setSearchResults([]);
      return;
    }
    const filtered = geoJsonData.features
      .filter((f) => {
        const p = f.properties;
        const query = q.toLowerCase();
        return (
          p.surveyNumber.toLowerCase().includes(query) ||
          p.ulpin.toLowerCase().includes(query) ||
          p.village.toLowerCase().includes(query)
        );
      })
      .slice(0, 5);
    setSearchResults(filtered);
  };

  const handleSelectSearchResult = (feature) => {
    const props = feature.properties;
    setSelectedParcel(props);
    setSearchResults([]);
    setSearchQuery(`Survey ${props.surveyNumber} (${props.village})`);

    // Calculate bounds from coordinates
    const ring = feature.geometry.coordinates[0];
    const latlngs = ring.map((c) => [c[1], c[0]]); // [lat, lon]
    const bounds = L.latLngBounds(latlngs);
    setFlyTarget({ bounds });
  };

  return (
    <div className="relative h-[calc(100vh-105px)] w-full overflow-hidden flex flex-col font-sans">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[999] pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="w-full sm:w-96 pointer-events-auto relative">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 flex items-center p-1.5 transition-all focus-within:ring-2 focus-within:ring-[#0B2545]">
            <Search className="w-4 h-4 text-amber-500 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Survey No, ULPIN, Village..."
              className="w-full px-3 py-1.5 text-xs font-semibold focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden z-50">
              {searchResults.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectSearchResult(f)}
                  className="w-full p-2.5 text-left hover:bg-amber-50/70 flex items-center justify-between text-xs transition"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Survey {f.properties.surveyNumber}</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                        {f.properties.ulpin}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {f.properties.village} • {f.properties.areaSqM} m²
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preset Locations & Filters */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 text-xs font-medium text-slate-700">
            {PUNE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setFlyTarget({ center: preset.center, zoom: preset.zoom })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer text-[11px] font-semibold"
              >
                {preset.name.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Base Layer Switcher */}
          <div className="relative">
            <button
              onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}
              className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Change Map Tiles Layer"
            >
              <Layers className="w-4 h-4 text-[#0B2545]" />
              <span className="hidden sm:inline">Tiles</span>
            </button>

            {layerDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                onMouseLeave={() => setLayerDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                  Select Base Map
                </div>
                {Object.entries(BASE_LAYERS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentBaseLayer(key);
                      setLayerDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 transition flex items-center justify-between ${
                      currentBaseLayer === key
                        ? 'bg-blue-50 text-[#0B2545] font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{val.name}</span>
                    {currentBaseLayer === key && <span className="text-blue-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Full-Height Leaflet Map Container */}
      <div className="flex-1 w-full h-full">
        <MapContainer
          center={[18.57, 73.85]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <MapController flyTarget={flyTarget} />

          {/* Dynamic Base Tile Layer */}
          <TileLayer
            attribution={BASE_LAYERS[currentBaseLayer].attribution}
            url={BASE_LAYERS[currentBaseLayer].url}
          />

          {/* PostGIS Polygons Layer */}
          {filteredGeoJson && (
            <GeoJSON
              key={`${selectedLandUseFilter}-${selectedParcel?.id}`}
              data={filteredGeoJson}
              style={parcelStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-[998]">
        <MapLegend />
      </div>

      {/* Side Drawer for Selected Parcel */}
      <ParcelDrawer
        parcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
      />
    </div>
  );
}
