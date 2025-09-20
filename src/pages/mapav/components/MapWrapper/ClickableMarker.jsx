import React, { useState, useRef } from 'react';
import L from 'leaflet';
import { Marker, useMapEvents } from 'react-leaflet';

const customIcon = new L.Icon({
  iconUrl: "location.svg",
  iconSize: new L.Point(40, 47),
});

export const ClickableMarker = () => {
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const isPressed = useRef(false);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  // useMapEvents({
  //   mousedown() {
  //     isPressed.current = true;
  //   },
  //   mouseup() {
  //     isPressed.current = false;
  //   },
  //   mousemove(e) {
  //     if (isPressed.current) {
  //       setMarkers((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
  //     }
  //   },
  // });
  // return (
  return position === null ? null : (
    <>
      <Marker position={position} icon={customIcon} />
      {/*   {markers.map((pos, i) => ( */}
      {/*     <Marker key={i} position={pos} icon={customIcon} /> */}
      {/*   ))} */}
    </>
  );
}

