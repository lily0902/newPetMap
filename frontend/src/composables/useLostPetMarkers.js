import axios from 'axios';

export function useLostPetMarkers(selectedReport, lostPetMarkers, onMarkerClick) {
  async function showLostPetMarkers(map) {
    hideLostPetMarkers();
    const res = await axios.get('/api/missing-pets');
    const reports = res.data.reports || [];
    reports.forEach(report => {
      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) },
        map,
        title: report.petName || '走失寵物',
        icon: './assets/icons/searchpet.png'
      });
      marker.addListener('click', () => {
        if (selectedReport) selectedReport.value = report;
        if (onMarkerClick) onMarkerClick(report);
      });
      lostPetMarkers.value.push(marker);
    });
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
      marker.setMap(visible ? map : null);
      if (typeof marker.setVisible === 'function') marker.setVisible(visible);
    });
  }

  return { showLostPetMarkers, hideLostPetMarkers, setLostPetMarkersVisible };
} 