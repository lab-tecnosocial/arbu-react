import { Marker } from "react-leaflet";

export const ClickableMarker = ({ position, icon }) => {
  if (!position) return null;
  return (
    <Marker position={position} icon={icon} />
  )
}

