import { Button } from "../../../../components/button/Button";
import { AppStoreButton } from "../../../../components/button/AppStoreButton";
import { ARBU_APP_STORE_URL, ARBU_GOOGLE_PLAY_URL } from "../../../../constants/arbuStoreLinks";
import styles from "./Banner.module.css";

export const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <div className={styles.content}>
          <h1>Cuidar los árboles nunca fue tan fácil</h1>
          <p>Gracias a ARBU me siento más conectado con los árboles de mi ciudad. Es una herramienta que nos recuerda que cuidar el entorno también es cuidarnos a nosotros mismos.</p>
          <div className={styles.buttons}>
            <div className={styles.downloadRow}>
              <Button
                variant="terciary"
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
          </div>
        </div>
        <div className={styles.picture}>
          <img src="hero3.png" alt="hero3 pgn" />
        </div>
      </div>
    </div>
  )
}

