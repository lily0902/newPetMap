// src/composables/usePlacesLoader.js

export function usePlacesLoader(map) {
    const API_KEY = '你的金鑰';

    async function loadPlacesByType(type, markersArray, iconUrl, onClickCallback = null) {
        if (!map || !type) return;

        // 清除舊標記
        markersArray.forEach(marker => marker.setMap(null));
        markersArray.length = 0;

        const center = map.getCenter();
        const radius = 50000;

        const url = 'https://places.googleapis.com/v1/places:searchNearby';
        const requestBody = {
        includedTypes: [type], // restaurant, lodging, veterinary_care
        maxResultCount: 20,
        locationRestriction: {
            circle: {
            center: {
                latitude: center.lat(),
                longitude: center.lng()
            },
            radius: radius
            }
        }
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

        data.places.forEach(place => {
        const location = {
            lat: place.location.latitude,
            lng: place.location.longitude
        };

        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: place.displayName?.text || '',
            icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(30, 30)
            }
        });

        if (onClickCallback) {
            marker.addListener('click', () => onClickCallback(place, marker));
        }

        markersArray.push(marker);
        });
    }

    return { loadPlacesByType };
}
