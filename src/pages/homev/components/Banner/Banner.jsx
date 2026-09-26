import { Button } from "../../../../components/button/Button";
import styles from "./Banner.module.css";

export const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <div className={styles.content}>
          <h1>Cuidar los árboles nunca fue tan fácil</h1>
          <p>Gracias a ARBU me siento más conectado con los árboles de mi ciudad. Es una herramienta que nos recuerda que cuidar el entorno también es cuidarnos a nosotros mismos.</p>
          <div className={styles.buttons}>
            <Button
              variant="terciary"
              icon={<img src="icons/googleplay.png" alt="" />}
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&pcampaignid=web_share",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Descargar Arbu
            </Button>
          </div>
        </div>
        <div className={styles.picture}>
          <img src="hero3.png" alt="hero3 pgn" />
        </div>
      </div>
    </div>
  )
}

