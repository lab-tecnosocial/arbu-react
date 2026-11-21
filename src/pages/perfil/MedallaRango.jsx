import styles from "./MedallaRango.module.css"

export const MedallaRango = ({ rango }) => (
  <div className={styles.medalla} aria-hidden>
    <svg viewBox="0 0 88 88" className={styles.svg}>
      <circle cx="44" cy="44" r="42" fill="#d8f5c8" />
      <ellipse cx="44" cy="62" rx="18" ry="16" fill="#f7fff0" />
      <circle cx="38" cy="58" r="2.2" fill="#1f6b4a" />
      <circle cx="50" cy="58" r="2.2" fill="#1f6b4a" />
      <path d="M38 64c2.2 3 9.8 3 12 0" fill="none" stroke="#1f6b4a" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 48c0-10 8-18 16-20-6 8-4 16 0 22-8-2-16-2-16-2z" fill="#7ed957" />
      <path d="M44 48c0-10-8-18-16-20 6 8 4 16 0 22 8-2 16-2 16-2z" fill="#58c44a" />
      <path d="M44 46v8" stroke="#2f8c4a" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <span className={styles.sr}>{rango}</span>
  </div>
)
