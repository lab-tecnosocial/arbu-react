import styles from './AppStoreButton.module.css'

export const AppStoreButton = ({ href, className = '', onClick, fullWidth = false }) => {
  const openStore = () => {
    if (onClick) {
      onClick()
      return
    }
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      type='button'
      className={`${styles.button} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim()}
      onClick={openStore}
      aria-label='Descargar Arbu en App Store'
    >
      <span className={styles.icon}>
        <img src='icons/App_Store_(iOS).svg' alt='' width={28} height={28} />
      </span>
      <span className={styles.label}>Descargar Arbu</span>
    </button>
  )
}
