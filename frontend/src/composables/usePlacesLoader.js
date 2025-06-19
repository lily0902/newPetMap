export function usePlacesLoader(map) {
  const API_KEY = 'AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww';

  async function loadPlacesByQuery(query, markersArray, iconUrl, onClickCallback = null) {
    if (!map || !query) return;

    // 清除舊標記
    markersArray.forEach(marker => marker.map = null);
    markersArray.length = 0;

    const center = map.getCenter();

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const requestBody = {
      textQuery: query,
      locationBias: {
        circle: {
          center: {
            latitude: center.lat(),
            longitude: center.lng()
          },
          radius: 50000
        }
      },
      maxResultCount: 20
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.location,places.displayName.text'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (!data.places) return;

    const { AdvancedMarkerElement } = google.maps.marker;

    data.places.forEach(place => {
      const location = {
        lat: place.location.latitude,
        lng: place.location.longitude
      };

      // 自訂 icon 圖片
      const img = document.createElement('img');
      img.src = iconUrl;
      img.style.width = '30px';
      img.style.height = '30px';

      const marker = new AdvancedMarkerElement({
        map,
        position: location,
        content: img,
        title: place.displayName?.text || ''
      });

      if (onClickCallback) {
        marker.addListener('click', () => onClickCallback(place, marker));
      }

      markersArray.push(marker);
    });
  }

  return { loadPlacesByQuery };
}
