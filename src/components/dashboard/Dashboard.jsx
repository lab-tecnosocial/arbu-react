import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../actions/authActions";

import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase/firebase-config";
import SolicitudList from "./SolicitudList";

const auth = getAuth(app);

const solicitudes = [
  {
    email: "miEmail@gmail.com",
    estado: "Pendiente",
    grupo: "Anglo Americano",
    id: "myId1",
    nombre: "Juan Pérez",
    rama: "Lobatos"
  },
  {
    email: "otraEmail@gmail.com",
    estado: "Pendiente",
    grupo: "Panda",
    id: "myId3",
    nombre: "Ana Aguilar",
    rama: "Pioneros"
  },
  {
    email: "otraEmail@gmail.com",
    estado: "Pendiente",
    grupo: "Tunari",
    id: "myId4",
    nombre: "Eduardo Olivera",
    rama: "Exploradores"
  },
  {
    email: "miEmail@gmail.com",
    estado: "Pendiente",
    grupo: "La Salle",
    id: "myId5",
    nombre: "Maria Torres",
    rama: "Lobatos"
  },
  {
    email: "otraEmail@gmail.com",
    estado: "Pendiente",
    grupo: "Ceibo",
    id: "myId6",
    nombre: "Enrique Gallardo",
    rama: "Pioneros"
  },
  {
    email: "otraEmail@gmail.com",
    estado: "Pendiente",
    grupo: "Alemán",
    id: "myId7",
    nombre: "Carla Ponce",
    rama: "Exploradores"
  }
];


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/iniciar-sesion");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  return (
    <div className="dashboard-container">
      <div className="user-info">
        <img src={user.photoURL || ""} alt="User" className="user-avatar" />
        <p>Hola, {user.displayName}!</p>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
      <SolicitudList solicitudes={solicitudes} />
    </div>
  );
};

export default Dashboard;
