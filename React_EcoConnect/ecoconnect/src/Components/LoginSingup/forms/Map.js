import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

import companyPinImage from '../../Assets/company-pin.png';
import personPinImage from '../../Assets/person-pin.png';

const Map = ({ latitude, longitude, onMarkerDragEnd, onRightClick, pinType }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk"
  });

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    console.log('New latitude:', newLat);
    console.log('New longitude:', newLng);
    onMarkerDragEnd(newLat, newLng);
  };

  const handleMarkerClick = () => {
    console.log('Marker clicked');
  };

  const handleRightClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    console.log('Right clicked latitude:', clickedLat);
    console.log('Right clicked longitude:', clickedLng);
    onRightClick(clickedLat, clickedLng);
  };

  const pinImage = pinType === 'company' ? companyPinImage : personPinImage;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onClick={handleRightClick}
    >
      <Marker
        position={center}
        draggable={true}
        onDragEnd={handleMarkerDragEnd}
        onClick={handleMarkerClick} 
        icon={{
          url: pinImage,
          scaledSize: { width: 32, height: 32 },
        }}
      />
    </GoogleMap>
  );
};

export default Map;