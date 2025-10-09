import React, { useEffect } from 'react';
import './IniciarSesion.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../actions/authActions";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase/firebase-config";
import googleIcon from './google-icon.png'

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const IniciarSesion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      dispatch(setUser(loggedUser));
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        navigate(from, { replace: true });
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate, from]);

  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          Cargando...
        </div>
      ) : (
        <button onClick={handleLogin} className="login-btn">
          <img src={googleIcon} alt="google-icon" className="google-icon" /> &nbsp; Iniciar sesión con Google
        </button>
      )}
    </div>
  );
};

export default IniciarSesion;