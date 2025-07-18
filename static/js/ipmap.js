let leafletMap = null;
let leafletGeoJsonLayer = null;

function loadLeafletIpMap() {
  const containerId = 'a4165-ip-map';
  const container = document.getElementById(containerId);
  if (!container) return;

  const mapDiv = document.createElement('div');
  mapDiv.id = 'leaflet-ipmap-container';
  mapDiv.style = 'width: 100%; height: 500px; margin-top: 1em;';
  container.appendChild(mapDiv);

  leafletMap = L.map('leaflet-ipmap-container');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(leafletMap);

  fetch('./ip_map/ip_locations.geojson')
    .then(res => res.json())
    .then(data => {
      leafletGeoJsonLayer = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          const props = feature.properties || {};
          const ip = props.ip || 'Unknown IP';
          const url = props.url || 'Unknown URL';
          layer.bindPopup(`<strong>IP:</strong> ${ip}<br><strong>URL:</strong> ${url}`);
        },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: '#1d3557',
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.85
          });
        }
      }).addTo(leafletMap);
    })
    .catch(err => {
      console.error('Error loading IP map geojson:', err);
      container.innerHTML += '<p style="color: red;">Failed to load IP map data.</p>';
    });
}

function resizeLeafletIpMap() {
  if (!leafletMap) return;

  setTimeout(() => {
    leafletMap.invalidateSize();

    if (leafletGeoJsonLayer && leafletGeoJsonLayer.getBounds().isValid()) {
      leafletMap.fitBounds(leafletGeoJsonLayer.getBounds(), {
        padding: [40, 40],
        maxZoom: 3
      });
    }
  }, 300);
}
