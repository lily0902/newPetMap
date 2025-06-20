export function usePlacesLoader(map, selectedPlace) {
  const { AdvancedMarkerElement } = google.maps.marker;

  async function fetchPlaceDetails(placeId) {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,location,rating,formattedAddress,formattedPhoneNumber,reviews,photos,currentOpeningHours&key=AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww`
    );
    if (!response.ok) throw new Error('Place details fetch failed');
    return await response.json();
  }

  function loadPlacesByQuery(query, markersArray, iconUrl, onClickCallback = null) {
    if (!map || !query) return;

    // 清除舊標記
    markersArray.forEach(marker => marker.map = null);
    markersArray.length = 0;

    const center = map.getCenter();

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
      maxResultCount: 15
    };

    fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww',
        'X-Goog-FieldMask': 'places.id,places.displayName.text,places.location'
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(data => {
      if (!data.places) return;

      data.places.forEach(place => {
        const position = {
          lat: place.location.latitude,
          lng: place.location.longitude
        };

        const img = document.createElement('img');
        img.src = iconUrl;
        img.style.width = '30px';
        img.style.height = '30px';

        const marker = new AdvancedMarkerElement({
          position,
          map,
          title: place.displayName.text,
          content: img
        });

        marker.addListener('click', async () => {
          try {
            const details = await fetchPlaceDetails(place.id);
            selectedPlace.value = {
              ...details,
              place_id: place.id // 為了導航用
            };
            map.panTo(position);

            if (typeof onClickCallback === 'function') {
              onClickCallback(details);
            }
          } catch (err) {
            console.error('Details fetch error:', err);
          }
        });

        markersArray.push(marker);
      });
    })
    .catch(err => {
      console.error('Place search error:', err);
    });
  }

  return { loadPlacesByQuery };
}
