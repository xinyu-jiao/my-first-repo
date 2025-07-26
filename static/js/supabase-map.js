const { createClient } = window.supabase;
const supabaseUrl = 'https://foqomepwhskijeqbzyee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcW9tZXB3aHNraWplcWJ6eWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODc5NzYsImV4cCI6MjA2OTA2Mzk3Nn0.rAsmV4dDaOzSwQFogHcJqfCN3M800Z6l7Oh9UnnChvw';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

function initSupabaseMap() {
  const map = new maplibregl.Map({
    container: 'a4165-supabase-map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=uKkwrl99zhDBddN1jFk8',
    center: [-73.9857, 40.7484],
    zoom: 11,
  });

  map.on('load', () => {
    map.on('click', (e) => {
      const lngLat = [e.lngLat.lng, e.lngLat.lat];
      queryNearbyRestaurants(lngLat, 1000, map);
    });
  });
}

async function queryNearbyRestaurants(point, radius, map) {
  const { data, error } = await supabaseClient.rpc('find_nearest_n_restaurants', {
    lat: point[1],
    lon: point[0],
    n: radius,
  });

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return;
  }

  document.querySelectorAll('.restaurant-marker').forEach(el => el.remove());

  data.forEach((d) => {
    const el = document.createElement('div');
    el.className = 'restaurant-marker';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = 'red';

    new maplibregl.Marker(el)
      .setLngLat([d.long, d.lat])
      .setPopup(new maplibregl.Popup().setText(`${d.name} (${Math.round(d.dist_meters)}m)`))
      .addTo(map);
  });
}

document.addEventListener('DOMContentLoaded', initSupabaseMap);
