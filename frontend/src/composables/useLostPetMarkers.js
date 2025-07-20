import axios from 'axios';

export function useLostPetMarkers(selectedReport, lostPetMarkers, onMarkerClick) {
  async function showLostPetMarkers(map) {
    hideLostPetMarkers();
    console.log('[LostPetMarkers] map instance:', map);
    const res = await axios.get('/api/missing-pets');
    const reports = res.data.reports || [];
    console.log('[LostPetMarkers] Fetched reports:', reports.length, reports);
    reports.forEach(report => {
      const lat = parseFloat(report.latitude);
      const lng = parseFloat(report.longitude);
      console.log('[LostPetMarkers] Report:', report.petName, 'Lat:', lat, 'Lng:', lng);
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('[LostPetMarkers] Invalid coordinates, skipping:', report);
        return;
      }
      try {
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: report.petName || '走失寵物'
          // icon: '/assets/icons/searchpet.png'
        });
        marker.addListener('click', () => {
          if (selectedReport) selectedReport.value = report;
          if (onMarkerClick) onMarkerClick(report);
        });
        lostPetMarkers.value.push(marker);
        console.log('[LostPetMarkers] Marker created:', marker, marker.getMap());
      } catch (err) {
        console.error('[LostPetMarkers] Error creating marker:', err, report);
      }
    });
    // 不再自動 fitBounds 或 setZoom
    // 強制加一個測試 marker（台北101）
    const testMarker = new window.google.maps.Marker({
      position: { lat: 25.033964, lng: 121.564468 },
      map,
      title: '測試marker'
      // icon: '/assets/icons/searchpet.png'
    });
    console.log('[LostPetMarkers] 測試marker created:', testMarker, testMarker.getMap());
  }

  function hideLostPetMarkers() {
    lostPetMarkers.value.forEach(marker => {
      marker.setMap(null);
      if (typeof marker.setVisible === 'function') marker.setVisible(false);
    });
    lostPetMarkers.value.length = 0;
  }

  function setLostPetMarkersVisible(map, visible) {
    lostPetMarkers.value.forEach(marker => {
      console.log('[LostPetMarkers] setMap', visible ? map : null, marker);
      marker.setMap(visible ? map : null);
      if (typeof marker.setVisible === 'function') marker.setVisible(visible);
    });
  }

  return { showLostPetMarkers, hideLostPetMarkers, setLostPetMarkersVisible };
} 