import { useState } from "react"
import "./IniciarSesion.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { authLogin } from "../../actions/auth.actions"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/firebase-config"
import googleIcon from "./google-icon.png"

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: "select_account" })

function mensajeErrorAuth(error) {
  const code = String(error?.code ?? "")
  if (code.includes("unauthorized-domain")) {
    return "Este dominio no está autorizado en Firebase Authentication. En la consola del proyecto arbu-c574d añade localhost (y 127.0.0.1 si lo usas)."
  }
  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) {
    return "La ventana de Google se cerró antes de terminar. Prueba de nuevo; si se cierra sola, revisa que Google esté activo como método de acceso en ese proyecto."
  }
  if (code.includes("operation-not-allowed")) {
    return "El acceso con Google no está habilitado en este proyecto de Firebase."
  }
  if (code.includes("popup-blocked")) {
    return "El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio."
  }
  if (code.includes("permission-denied-on-the-service") || code.includes("api-key-service-blocked")) {
    return "La API key de este proyecto no puede usar Authentication. En Google Cloud (arbu-c574d) → APIs y servicios → Credenciales, abre esa API key y en restricciones de API incluye Identity Toolkit API."
  }
  return error?.message || "No se pudo iniciar sesión con Google."
}

const IniciarSesion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const from = location.state?.from?.pathname || "/perfil"
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    if (cargando) return
    setError(null)
    setCargando(true)
    try {
      const result = await signInWithPopup(auth, provider)
      dispatch(authLogin(result.user))
      navigate(from, { replace: true })
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err)
      setError(mensajeErrorAuth(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">Cargando...</div>
      ) : (
        <>
          <button onClick={handleLogin} className="login-btn" disabled={cargando}>
            <img src={googleIcon} alt="" className="google-icon" />
            &nbsp;{cargando ? "Conectando…" : "Iniciar sesión con Google"}
          </button>
          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}

export default IniciarSesion
