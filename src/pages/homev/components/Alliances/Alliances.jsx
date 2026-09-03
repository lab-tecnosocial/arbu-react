import styles from './Alliances.module.css'

export const Alliances = () => {
  return (
    <div className={styles.alliances}>
      <div className={styles.logosWrapper}>
        <h3>Nuestras alianzas</h3>
        <div className={styles.logos}>
          <img src="logo1.png" alt="" />
          <img src="logo2.png" alt="" />
          <img src="logo3.png" alt="" />
          <img src="logo4.png" alt="" />
        </div>
      </div>
    </div>
  )
}

