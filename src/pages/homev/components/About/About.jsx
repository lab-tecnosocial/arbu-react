import styles from "./About.module.css";

export const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.aboutHeader}>
        <h2>Conoce las funciones de <span className="text-green">ARBU</span></h2>
        <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad. Una aplicación pensada para proteger, monitorear y conectar con el arbolado urbano.</p>
      </div>
      <div className={styles.aboutCards}>
        <div className={styles.card}>
          <h3>ADOPTA</h3>
          <p>Adopta árboles urbanos en el mapa.</p>
        </div>
        <div className={styles.card}>
          <h3>CUIDA</h3>
          <p>Adopta árboles urbanos en el mapa.</p>
        </div>
        <div className={styles.card}>
          <h3>APRENDE</h3>
          <p>Adopta árboles urbanos en el mapa.</p>
        </div>
      </div>
    </div>
  )
}

