import React from 'react'
import { MapContainer, Marker, Popup,TileLayer} from 'react-leaflet'
// import { useMap } from 'react-leaflet/hooks'
import './MapaComponent.css'

const MapaComponent = () => {

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>MapaComponent</h2>
      <MapContainer center={[-17.3917, -66.1448]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

    </main>
  )
}

export default MapaComponent