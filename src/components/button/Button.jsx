import { Link } from "react-router-dom";
import styles from "./Button.module.css";
import { Spinner } from "../Spinner/Spinner";

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
        {isLoading ? <Spinner size={16} /> : children}
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
        {isLoading ? <Spinner size={16} /> : children}
      </button>
  )
};

