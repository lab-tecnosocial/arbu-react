import React, { useEffect } from 'react';
import './IniciarSesion.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../actions/authActions";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase/firebase-config";
import googleIcon from './google-icon.png'

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const IniciarSesion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      dispatch(setUser(loggedUser));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.info('despachando');
        dispatch(setUser(user));
        navigate("/dashboard");
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          Cargando...
        </div>
      ) : (
        <button onClick={handleLogin} className="login-btn">
          <img src={googleIcon} alt="google-icon" className="google-icon"/> &nbsp; Iniciar sesión con Google
        </button>
      )}
    </div>
  );
};

export default IniciarSesion;