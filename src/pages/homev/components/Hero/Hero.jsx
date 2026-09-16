import { Button } from "../../../../components/button/Button";
import { AppStoreButton } from "../../../../components/button/AppStoreButton";
import { ARBU_APP_STORE_URL, ARBU_GOOGLE_PLAY_URL } from "../../../../constants/arbuStoreLinks";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1>App para el cuidado del <span className="text-green">Arbolado</span> Urbano</h1>
          <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad. Una aplicación pensada para proteger, monitorear y conectar con el arbolado urbano.</p>
          <div className={styles.buttons}>
            <div className={styles.downloadRow}>
              <Button
                variant="primary"
                className={styles.storeDownloadButton}
                icon={<img src="icons/googleplay.png" alt="" />}
                onClick={() =>
                  window.open(ARBU_GOOGLE_PLAY_URL, "_blank", "noopener,noreferrer")
                }
              >
                Descargar Arbu
              </Button>
              <AppStoreButton href={ARBU_APP_STORE_URL} className={styles.storeDownloadButton} />
            </div>
            <Button
              variant="terciary"
              href="/mapa"
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
          <img src="hero2.png" alt="hero2 pgn" />
        </div>
      </div>
    </section>
  )
}

