import styles from './Features.module.css';

export const Features = () => {
  return (
    <section>
      <div className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2>El impacto de <span className="text-green">ARBU</span> a través del tiempo</h2>
          <p>Cada logro cuenta una historia de esfuerzo y colaboración. Descubre cómo ARBU ha contribuido a un entorno más verde y consciente desde sus inicios.</p>
        </div>
        <div className={styles.featuresCards}>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon1.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Actividades de forestación</h3>
              <p>Más de 1.600 árboles plantados en el centro urbano.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon2.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Premios y distinciones</h3>
              <p>Reconocidos a nivel nacional por nuestras actividades ambientales.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon3.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Participación comunitaria</h3>
              <p>Más de 500 voluntarios activos en jornadas ambientales.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon4.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Monitoreo de árboles</h3>
              <p>Más de 2600 árboles registrados y geolocalizados en ARBU.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon5.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Adopciones de árboles</h3>
              <p>850 árboles urbanos adoptados por vecinos y vecinas.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <img src="ficon6.png" alt="feature icon 1" />
            </div>
            <div className={styles.content}>
              <h3>Colaboraciones</h3>
              <p>Alianzas con 10 organizaciones para proyectos de reforestación.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

