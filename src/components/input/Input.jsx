import { Search, X } from "lucide-react";
import styles from "./Input.module.css";
import { useState } from 'react'

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
  accept,
  capture,
  onFileChange,
  previewSrc,
  onPreviewClose,
  error,
  required = false,
  suggestions = [],
  withIcon = false,
  ...props
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [iconValue, setIconValue] = useState("")

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(e);
    if (suggestions && suggestions.length > 0) {
      const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && val.length > 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchOnClick();
    }
  };

  if (type === "file") {
    return (
      <div className={styles.field}>
        <label className={styles.label}>
          {label}{required && ' *'}
        </label>
        {previewSrc ? (
          <div className={styles.previewContainer}>
            <img src={previewSrc} alt={`Preview ${label}`} className={styles.preview} />
            <button type="button" onClick={onPreviewClose} className={styles.removeIcon}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.fileContainer}>
            <input
              type="file"
              accept={accept}
              capture={capture}
              onChange={onFileChange}
              className={styles.fileInput}
              disabled={disabled}
              {...props}
            />
          </div>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={
      `
        ${styles.inputWrapper}
        ${fullWidth ? styles.fullWidth : ""}
      `
    } style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`
        ${styles.inputContainer}
        ${styles.inputContainer}
        ${(withIcon && iconValue && value) ? styles.larger : styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
        `}
      >
        {withIcon && iconValue && value &&
          <div className={styles.iconSuggestion}>
            <img src={`escudos/${iconValue}.png`} alt="scouts picutre" />
          </div>
        }
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={suggestions.length > 0 ? handleInputChange : onChange}
          onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
        {showSuggestions && (
          <ul className={styles.suggestionsList}>
            {filteredSuggestions.map((sug, idx) => (
              <li
                key={idx}
                className={styles.suggestionItem}
                onClick={() => {
                  const fakeEvent = { target: { value: sug } };
                  setIconValue(sug)
                  onChange(fakeEvent);
                  setShowSuggestions(false);
                }}
              >
                {withIcon &&
                  <div className={styles.iconSuggestion}>
                    <img src={`escudos/${sug}.png`} alt="scouts picutre" />
                  </div>
                }
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}

    </div>
  )
};
