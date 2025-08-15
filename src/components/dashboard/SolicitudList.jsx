import React, {useState, useEffect} from 'react';
import './SolicitudList.css';
import ConfirmDialog from './ConfirmDialog';
import {startUpdateSolicitudEstado, startDeleteSolicitud} from '../../actions/dashboardActions'
import { useDispatch } from "react-redux";

const SolicitudList = ({solicitudes = []}) => {
  const [solicitudesState, setSolicitudesState] = useState(solicitudes);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [accionActual, setAccionActual] = useState(null);
  const [solicitudActual, setSolicitudActual] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setSolicitudesState(solicitudes);
  }, [solicitudes]);

  const abrirConfirmacion = (sol, accion) => {
    setSolicitudActual(sol);
    setAccionActual(accion);
    setDialogVisible(true);
  };

  const cerrarConfirmacion = () => {
    setDialogVisible(false);
    setSolicitudActual(null);
    setAccionActual(null);
  };

  const confirmarAccion = () => {
    if (!solicitudActual || !accionActual) return;

    // Simula cambio de estado (esto puedes reemplazar por la llamada a tu API)
    // setSolicitudesState((prev) =>
    //   prev.map((s) =>
    //     s.id === solicitudActual.id
    //       ? { ...s, estado: accionActual === "Aceptar" ? "Aceptado" : "Rechazado" }
    //       : s
    //   )
    // );
    if( accionActual === 'Aceptar') {
      dispatch(startUpdateSolicitudEstado(solicitudActual.id, 'Aceptado'));
    } else if(accionActual === 'Rechazar') {
      dispatch(startDeleteSolicitud(solicitudActual.id));
    }

    cerrarConfirmacion();

    // Aquí puedes hacer tu llamada real a la base de datos
    console.log(`Acción "${accionActual}" confirmada para: ${solicitudActual.nombre}`);
  };


  return (
    <>
      <div className="solicitud-container">
        {solicitudesState.map((sol) => (
          <div className="solicitud-card" key={sol.id}>
             <img
                src={`logosGruposScout/${sol.grupo}.png`}
                alt={`Logo de ${sol.grupo}`}
                className="logo-grupo"
              />
            <h3>{sol.nombre}</h3>
            <p><strong>Email:</strong> {sol.email}</p>
            <p><strong>Rama:</strong> {sol.rama}</p>
            <p><strong>Grupo:</strong> {sol.grupo}</p>
            {
              sol.rama === 'Dirigentes' && (
                <p><strong>Rama a la que dirige:</strong> {sol.ramaALaQueDirige}</p>
              )
            }
            
            <p><strong>Estado:</strong> {sol.estado}</p>
            <div className="botones">
              <button
                className="aceptar"
                onClick={() => abrirConfirmacion(sol, "Aceptar")}
                disabled={sol.estado !== "Pendiente"}
              >
                Aceptar
              </button>
              <button
                className="rechazar"
                onClick={() => abrirConfirmacion(sol, "Rechazar")}
                disabled={sol.estado !== "Pendiente"}
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        visible={dialogVisible}
        mensaje={`¿Seguro que quieres ${accionActual?.toLowerCase()} a ${solicitudActual?.nombre}?`}
        onConfirm={confirmarAccion}
        onCancel={cerrarConfirmacion}
      />
    </>
  );
}

export default SolicitudList;