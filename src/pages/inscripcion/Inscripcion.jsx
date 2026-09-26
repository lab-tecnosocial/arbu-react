import { useSelector } from "react-redux";
import styles from "./Inscripcion.module.css"
import { InscriptionForm } from "./components/InscriptionForm/InscriptionForm.jsx";
import { LoginForm } from "./components/LoginForm/LoginForm.jsx";

export const Inscripcion = () => {
  const { user, checking } = useSelector(state => state.auth)
  if (checking) return <p>cargando...</p>
  return (
    <div className={`${styles.inscripcionPage}`}>
      <div className={styles.card}>
        {!user ?
          <LoginForm />
          :
          <InscriptionForm />
        }
      </div>
    </div>
  )
}

