// composables/usePlacesLoader.js
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export function usePlacesLoader(map, selectedPlace) {
  const API_KEY = 'AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww';

  async function loadPlacesByQuery(query, markersArray, iconUrl) {
    if (!map || !query) return;

    // 清除舊標記
    markersArray.forEach(marker => marker.map = null);
    markersArray.length = 0;

    const center = map.getCenter();

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.location,places.displayName.text'
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: center.lat(), longitude: center.lng() },
            radius: 50000
          }
        },
        maxResultCount: 20
      })
    });

    const data = await response.json();
    if (!data.places) return;

    const { AdvancedMarkerElement } = google.maps.marker;
    const newMarkers = [];

    data.places.forEach(place => {
      const location = {
        lat: place.location.latitude,
        lng: place.location.longitude
      };

      const img = document.createElement('img');
      img.src = iconUrl;
      img.style.width = '30px';
      img.style.height = '30px';
      img.classList.add('custom-marker-icon');

      const marker = new AdvancedMarkerElement({
        position: location,
        content: img,
        title: place.displayName?.text || ''
      });

      marker.addListener('click', () => {
        selectedPlace.value = {
          name: place.displayName?.text,
          lat: location.lat,
          lng: location.lng
        };
      });

      newMarkers.push(marker);
      markersArray.push(marker);
    });

    // 使用 cluster 顯示所有 marker
    new MarkerClusterer({ markers: newMarkers, map });
  }

  return { loadPlacesByQuery };
}
