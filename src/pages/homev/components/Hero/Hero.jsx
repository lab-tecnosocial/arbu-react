import { Button } from "../../../../components/button/Button";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1 data-reveal="">App para el cuidado del <span className="text-green">Arbolado</span> Urbano</h1>
          <p data-reveal="" style={{ "--reveal-delay": "120ms" }}>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad. Una aplicación pensada para proteger, monitorear y conectar con el arbolado urbano.</p>
          <div className={styles.buttons} data-reveal="" style={{ "--reveal-delay": "240ms" }}>
            <Button
              variant="primary"
              icon={<img src="icons/googleplay.png" alt="" />}
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&pcampaignid=web_share",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Google Play
            </Button>
            <Button
              variant="primary"
              icon={<img src="icons/appstore.svg" alt="" />}
              onClick={() =>
                window.open(
                  "https://apps.apple.com/us/app/arbu/id6759862157",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              App Store
            </Button>
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
        </div>
        <div className={styles.picture} data-reveal="right" style={{ "--reveal-delay": "200ms" }}>
          <img src="hero2.png" alt="hero2 pgn" />
        </div>
      </div>
    </section>
  )
}

