import React, { useState, useEffect } from "react";
import "./Tabla.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../actions/authActions";

import { getAuth, signOut } from "firebase/auth";
import { app, db } from "../../firebase/firebase-config";
import { setInscripciones } from "../../actions/dashboardActions";
import EditableTable from "./EditableTable"; 
const auth = getAuth(app);
const Tabla = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const arbolesMapeados = useSelector((state) => state.mapa.arbolesMapeados);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(setInscripciones([]));
      navigate("/iniciar-sesion");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="tabla-container">
      <div className="user-info">
        <img src={user.photoURL || ""} alt="User" className="user-avatar" />
        <p>Hola, {user.displayName}!</p>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
      <EditableTable data={arbolesMapeados} />
    </div>
  );
};

export default Tabla;
