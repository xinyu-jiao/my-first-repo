let map = null;

function loadMapbox() {
  fetch('./config/mapbox_token.txt')
    .then(response => response.text())
    .then(token => {
      mapboxgl.accessToken = token.trim();

      map = new mapboxgl.Map({
        container: 'mapbox-spatial-container',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-87.6298, 41.8781],
        zoom: 12,
        pitch: 0,
        bearing: 0
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');

      map.on('load', () => {
        map.addSource('chicago-museums', {
          type: 'geojson',
          data: './spatial_structure/museum_chicago.geojson'
        });

        map.addLayer({
          id: 'museum-points',
          type: 'circle',
          source: 'chicago-museums',
          paint: {
            'circle-radius': 10,
            'circle-color': '#e63946',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
            'circle-opacity': 0.85
          }
        });

        map.addLayer({
          id: 'museum-labels',
          type: 'symbol',
          source: 'chicago-museums',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 13,
            'text-offset': [0, 1.2],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#222',
            'text-halo-color': '#fff',
            'text-halo-width': 1.2
          }
        });

        map.on('click', 'museum-points', (e) => {
          const props = e.features[0].properties;
          const coordinates = e.features[0].geometry.coordinates.slice();
          const name = props.name || 'Museum';
          const desc = props.description || '';
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<strong>${name}</strong><br>${desc}`)
            .addTo(map);
        });

        map.on('mouseenter', 'museum-points', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'museum-points', () => {
          map.getCanvas().style.cursor = '';
        });
      });
    });
}

function resizeMapbox() {
  if (map) map.resize();
}
