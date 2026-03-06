import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export function Marker() {
  return null;
}

export default function MapView({ style, initialRegion, children }) {
  const lat = initialRegion?.latitude ?? 42.6;
  const lon = initialRegion?.longitude ?? 23.03;

  // Collect marker data from children
  const kids = children
    ? Array.isArray(children)
      ? children
      : [children]
    : [];

  const markersJs = kids
    .filter((c) => c?.props?.coordinate)
    .map((c) => {
      const { latitude, longitude } = c.props.coordinate;
      const title = (c.props.title || "").replace(/'/g, "\\'");
      const description = (c.props.description || "").replace(/'/g, "\\'");
      return `L.marker([${latitude}, ${longitude}]).addTo(map).bindPopup('<b>${title}</b><br/>${description}');`;
    })
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([${lat}, ${lon}], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    ${markersJs}
  </script>
</body>
</html>`;

  return (
    <View
      style={[
        styles.container,
        style?.height ? { height: style.height } : {},
        style?.marginHorizontal
          ? { marginHorizontal: style.marginHorizontal }
          : {},
        style?.borderRadius ? { borderRadius: style.borderRadius } : {},
      ]}
    >
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
