import { useState } from "react"
import { Input } from "../../../../components/input/Input"
import styles from "./LoginForm.module.css"
import { Button } from "../../../../components/button/Button";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../../../../firebase/firebase-config.js"
import { RectangleGogglesIcon } from "lucide-react";
import { Google } from "@mui/icons-material";

export const LoginForm = ({
  title = "Inicio de Sesión",
  description = "Por favor, inicie sesión para poder continuar."
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleTextChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // if (errors[field]) {
    //   setErrors(prev => ({ ...prev, [field]: null }));
    // }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado con email");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Google");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.loginHeader}><h2>{title}</h2>
        <p>{description}</p>
      </div>
      <img src="warning.png" alt="warning image" />
      <div className="lineX"></div>
      <Button icon={<img src="icons/google-social-icon.svg" alt="Google Icon" />} variant='terciary' onClick={() => handleGoogleLogin()}>Continuar con Google</Button>
    </div>
  )
}

