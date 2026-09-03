import { Check } from "lucide-react";
import styles from "./Checkbox.module.css";

export const Checkbox = ({ value, checked, onClick, fullWidth }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.checkbox} ${checked ? styles.checked : ""} ${fullWidth ? styles.fullWidth : ""
        }`}
    >
      <div className={`${styles.icon} ${checked ? styles.checkedIcon : ""}`}>
        <Check size={16} strokeWidth={3.5} />
      </div>
      <span>{value}</span>
    </button>
  );
};
