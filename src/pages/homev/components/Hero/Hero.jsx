import { Button } from "../../../../components/button/Button";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1>App para el cuidado del <span className="text-green">Arbolado</span> Urbano</h1>
        <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad. Una aplicación pensada para proteger, monitorear y conectar con el arbolado urbano.</p>
        <div className={styles.buttons}>
          <Button
            variant="primary"
            icon={<img src="icons/googleplay.png" alt="" />}
          >
            Descargar Arbu
          </Button>
          <Button
            variant="terciary"
          >
            Ver mapa
          </Button>
          <div className={styles.blur}>
            <img src="blur.png" alt="blur background" />
          </div>
        </div>
        <div className={styles.rating}>
          <div className={styles.profilePictures}>
            <div className={styles.profile}>
              <img src="profile1.png" alt="" />
            </div>
            <div className={styles.profile}>
              <img src="profile2.png" alt="" />
            </div><div className={styles.profile}>
              <img src="profile3.png" alt="" />
            </div>
          </div>
          <div className={styles.ratingLabel}>
            <div className={styles.stars}>
              <img src="star.png" alt="" />
              <img src="star.png" alt="" />
              <img src="star.png" alt="" />
              <img src="star.png" alt="" />
              <img src="star1.png" alt="" />
            </div>
            <span>4.7 por +240 usuarios</span>
          </div>
        </div>
      </div>
      <div className={styles.picture}>
        <img src="hero.png" alt="hero pgn" />
      </div>
    </div>
  )
}

