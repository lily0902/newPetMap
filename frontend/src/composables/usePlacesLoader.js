export function usePlacesLoader(map) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 取得詳細地點資訊
  async function fetchPlaceDetails(placeId) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?key=${API_KEY}&languageCode=zh-TW`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': 'displayName,formattedAddress,currentOpeningHours,nationalPhoneNumber,rating,reviews,photos'
          }
        }
      );
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }

  async function loadPlacesByQuery(query, markersArray, iconUrl, onMarkerClick) {
    if (!map || !query) return;
    Array.from(markersArray).forEach(marker => marker.setMap && marker.setMap(null));
    markersArray.length = 0;
    const center = map.getCenter();
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}&fields=places.id,places.location,places.displayName.text`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        }
      );
      if (!response.ok) return;
      const data = await response.json();
      if (!data.places) return;
      for (const place of data.places) {
        const location = {
          lat: place.location.latitude,
          lng: place.location.longitude
        };
        let marker;
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          marker = new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position: location,
            title: place.displayName?.text || '',
            content: `<img src="${iconUrl}" style="width:30px;height:30px;">`
          });
        } else {
          marker = new window.google.maps.Marker({
            position: location,
            map: map,
            icon: {
              url: iconUrl,
              scaledSize: new window.google.maps.Size(30, 30),
              anchor: new window.google.maps.Point(15, 30)
            },
            title: place.displayName?.text || ''
          });
        }
        marker.setMap(map);
        marker.addListener && marker.addListener('click', async () => {
          // 點擊時才查詢詳細資料
          const details = await fetchPlaceDetails(place.id);
          onMarkerClick?.({ ...place, ...details, lat: location.lat, lng: location.lng });
        });
        markersArray.push(marker);
      }
    } catch {}
  }

  return { loadPlacesByQuery };
}
