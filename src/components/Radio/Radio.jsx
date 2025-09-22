import styles from "./Radio.module.css";

export const Radio = ({ value, checked, onClick, fullWidth }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.radio} ${checked ? styles.checked : ""} ${fullWidth ? styles.fullWidth : ""
        }`}
    >
      {checked ? (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="1"
            width="15"
            height="15"
            rx="7.5"
            stroke="#268576"
          />
          <circle cx="8" cy="8.5" r="5" fill="#268576" />
        </svg>
      ) : (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="1"
            width="15"
            height="15"
            rx="7.5"
            stroke="var(--geyser-300)"
          />
        </svg>
      )}
      <span>{value}</span>
    </button>
  );
};
