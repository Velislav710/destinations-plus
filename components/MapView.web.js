import { useEffect, useRef } from "react";

const mapRegistry = new Map();
let leafletLoaded = false;
let leafletPromise = null;

function loadLeaflet() {
  if (leafletLoaded) return Promise.resolve(window._L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve) => {
    // Inject Leaflet CSS via <link> to avoid Metro CSS bundling issues
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Inject Leaflet JS via <script> to avoid window-at-import-time SSR error
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const L = window.L;
        // Fix broken default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        window._L = L;
        leafletLoaded = true;
        resolve(L);
      };
      document.head.appendChild(script);
    } else {
      resolve(window.L);
    }
  });

  return leafletPromise;
}

export default function MapView({ style, initialRegion }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const idRef = useRef(`map-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    loadLeaflet().then((L) => {
      if (mapRef.current) return;

      const map = L.map(containerRef.current).setView(
        [initialRegion?.latitude ?? 42.6, initialRegion?.longitude ?? 23.03],
        13,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapRef.current = map;
      mapRegistry.set(idRef.current, map);

      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        mapRegistry.delete(idRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: style?.height ?? 260,
        borderRadius: style?.borderRadius ?? 20,
        marginLeft: style?.marginHorizontal ?? 16,
        marginRight: style?.marginHorizontal ?? 16,
        overflow: "hidden",
        zIndex: 0,
      }}
    />
  );
}

export function Marker({ coordinate, title, description }) {
  useEffect(() => {
    let marker = null;

    const interval = setInterval(() => {
      const L = window._L;
      const map = [...mapRegistry.values()][0];
      if (L && map) {
        clearInterval(interval);
        marker = L.marker([coordinate.latitude, coordinate.longitude])
          .addTo(map)
          .bindPopup(`<b>${title ?? ""}</b><br/>${description ?? ""}`);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (marker) marker.remove();
    };
  }, [coordinate.latitude, coordinate.longitude]);

  return null;
}
