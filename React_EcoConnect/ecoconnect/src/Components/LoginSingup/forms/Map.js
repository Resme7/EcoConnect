import React, { useEffect, useRef } from 'react';
import companyPinImage from '../../Assets/company-pin.png';
import personPinImage from '../../Assets/person-pin.png';

const Map = ({ latitude, longitude, onMarkerDragEnd, onRightClick, pinType }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    let map;
  
    async function initMap() {
      const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
  
      if (!window.google || !window.google.maps) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk&callback=initMap`;
          script.defer = true;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
  
      map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: position,
      });
  
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
        icon: {
          url: pinType === 'company' ? companyPinImage : personPinImage,
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
  
      marker.addListener('dragend', () => {
        const newLat = marker.getPosition().lat();
        const newLng = marker.getPosition().lng();
        onMarkerDragEnd(newLat, newLng);
      });
  
      map.addListener('click', (e) => {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        console.log('Coords', clickedLat, clickedLng)
        onRightClick(clickedLat, clickedLng);
      });
    }
  
    initMap();
  
    return () => {
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
        map = null;
      }
    };
  }, [latitude, longitude, onMarkerDragEnd, onRightClick, pinType]);
  

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default Map;
