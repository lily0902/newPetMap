export function usePlacesLoader(map, selectedPlace) {
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
    
    if (!res.ok) {
      const errText = await res.text(); // 取得錯誤回應文字
      throw new Error(`Error fetching place details: ${res.status} ${res.statusText} - ${errText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('fetchPlaceDetails error:', error);
    return {};
  }
}


  async function loadPlacesByQuery(query, markersArray, iconUrl, onMarkerClick) {
    if (!map || !query) return;

    // 清除舊標記
    markersArray.forEach(marker => marker.setMap(null));
    markersArray.length = 0;

    const center = map.getCenter();

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}&fields=places.id,places.location,places.displayName.text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
        }
      );

      if (!response.ok) throw new Error(`Places search error: ${response.statusText}`);
      const data = await response.json();
      if (!data.places) return;

      const { AdvancedMarkerElement } = google.maps.marker;

      for (const place of data.places) {
        const location = {
          lat: place.location.latitude,
          lng: place.location.longitude
        };

        // 取得詳細資訊
        const placeDetails = await fetchPlaceDetails(place.id);

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

        //marker.map = map;
         marker.setMap(map);


        marker.addListener('click', () => {
          selectedPlace.value = {
            ...place,
            ...placeDetails,
            lat: location.lat,
            lng: location.lng
          };
          onMarkerClick?.(selectedPlace.value);
        });

        markersArray.push(marker);
      }
    } catch (error) {
      console.error('loadPlacesByQuery error:', error);
    }
  }

  return { loadPlacesByQuery };
}
