import styles from './Features.module.css';

export const Features = () => {
  return (
    <div className={styles.features}>
      <div className={styles.featuresHeader}>
        <h2>Conoce las funciones de <span className="text-green">ARBU</span></h2>
        <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad. Una aplicación pensada para proteger, monitorear y conectar con el arbolado urbano.</p>
      </div>
      <div className={styles.featuresCards}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon1.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon2.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon3.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon4.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon5.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <img src="ficon6.png" alt="feature icon 1" />
          </div>
          <div className={styles.content}>
            <h3>ADOPTA</h3>
            <p>Adopta árboles urbanos en el mapa.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

