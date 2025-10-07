import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../actions/authActions";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase/firebase-config";
import "./NoAutorizado.css";

const auth = getAuth(app);

const NoAutorizado = () => {
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
        <div className="no-autorizado-container">
            <div className="no-autorizado-content">
                <div className="icon-container">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="lock-icon"
                    >
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                    </svg>
                </div>
                <h1>Acceso No Autorizado</h1>
                <p>Lo sentimos, no tienes permisos para acceder a esta sección.</p>
                <p className="contact-info">
                    Por favor, contacta a un administrador si crees que esto es un error.
                </p>
                {user && (
                    <div className="user-info-box">
                        <p className="user-email">
                            Sesión iniciada como: <strong>{user.email}</strong>
                        </p>
                    </div>
                )}
                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
                <button onClick={() => navigate("/")} className="home-button">
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default NoAutorizado;
