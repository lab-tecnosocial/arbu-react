import { Link } from "react-router-dom";
import styles from "./Button.module.css";

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  fullWidth,
  icon,
  className,
  href,
  ...props
}) => {
  return (
    href ?
      <Link
        to={href}
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
      </Link>
      :
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

