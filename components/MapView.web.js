import { useEffect, useRef } from "react";

let leafletLoaded = false;
let leafletPromise = null;

function loadLeaflet() {
  if (leafletLoaded) return Promise.resolve(window._L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const L = window.L;
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
      resolve(window._L);
    }
  });

  return leafletPromise;
}

// MapView accepts `children` but also reads marker data from a `markers` prop
// for reliable rendering. Children (Marker components) are ignored on web.
export default function MapView({ style, initialRegion, children }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
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
      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Sync markers whenever children change
  useEffect(() => {
    if (!children) return;

    const addMarkers = (L, map) => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Collect marker props from children
      const kids = Array.isArray(children) ? children : [children];
      kids.forEach((child) => {
        if (!child || !child.props) return;
        const { coordinate, title, description } = child.props;
        if (!coordinate?.latitude || !coordinate?.longitude) return;
        const m = L.marker([coordinate.latitude, coordinate.longitude])
          .addTo(map)
          .bindPopup(`<b>${title ?? ""}</b><br/>${description ?? ""}`);
        markersRef.current.push(m);
      });
    };

    if (mapRef.current && window._L) {
      addMarkers(window._L, mapRef.current);
    } else {
      // Map not ready yet — wait for it
      loadLeaflet().then((L) => {
        const waitForMap = setInterval(() => {
          if (mapRef.current) {
            clearInterval(waitForMap);
            addMarkers(L, mapRef.current);
          }
        }, 100);
      });
    }
  }, [children]);

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

// Marker is a no-op on web — MapView reads its props directly from children
export function Marker() {
  return null;
}
