import styles from "./Button.module.css";

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  fullWidth,
  icon,
  className,
  ...props
}) => {
  return (
    <button
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${isLoading ? styles.loading : ""} 
        ${icon ? styles.spaceIcon : ""}
        ${fullWidth ? styles.fullWidth : ""}
        ${className ? className : ""}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {isLoading ? <span className={styles.spinner}></span> : children}
    </button>
  )
};

