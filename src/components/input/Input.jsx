import { Search, X } from "lucide-react";
import styles from "./Input.module.css";

export const Input = ({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  onClick,
  searchIcon,
  closeIcon,
  searchOnClick,
  closeOnClick,
  size = "medium",
  fullWidth,
  disabled,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchOnClick();
    }
  };
  return (
    <div className={styles.inputWrapper} style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`
        ${styles.inputContainer}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
`}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => handleKeyDown(e)}
          className={`${styles.input} `}
          disabled={disabled}
          {...props}
        />
        {closeIcon && (
          <button onClick={closeOnClick} className={styles.icon}>
            <X size={24} strokeWidth={1.5} color="var(--geyser-400)" />
          </button>
        )}
        {searchIcon && (
          <button onClick={searchOnClick} className={styles.icon}>
            <Search size={24} strokeWidth={1.5} color="var(--green2)" />
          </button>
        )}
      </div>
    </div>
  );
};
