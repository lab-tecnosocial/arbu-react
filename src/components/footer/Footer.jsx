import React from "react";
import styles from './Footer.module.css';

import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.footerInfo}>
          <div className={styles.logo}>
            <img src="Logo.png" alt="Arbu logo app" />
          </div>
          <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad.</p>
          <div className={styles.socialIcons}>
            <span><Facebook /></span>
            <span><Youtube /></span>
            <span><Instagram /></span>
          </div>
        </div>
        <span><Link to={"/inscripcion"}>Formulario de Inscripción</Link></span>
        <div className={styles.tecnoLabInfo}>
          <img src="tecnolab.png" alt="tecnolab icon info" />
        </div>
      </div>
      <div className="line"></div>
      <div className={styles.rights}>
        <span>2025 ARBU, Derechos Reservados</span>
        <div className={styles.rightsLinks}>
          <span>Acerca de Arbu</span>
          <span>Políticas de Privacidad</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
