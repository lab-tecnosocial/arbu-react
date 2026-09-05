import React from "react";
import styles from './Footer.module.css';
import { Link } from "react-router-dom";

import { Facebook, Instagram, Youtube } from "lucide-react";

const year = new Date().getFullYear();
const Footer = ({ labLogoSrc = 'tecnolab.png' }) => {
  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.main}>
          <div className={styles.footerInfo}>
            <div className={styles.logo}>
              <img src="Logo.png" alt="Arbu logo app" />
            </div>
            <p>Arbu nace para cuidar lo que nos da vida: los árboles de nuestra ciudad.</p>
            <div className={styles.socialIcons}>
              <span>
                <a href="https://www.facebook.com/ArbuCb" target="_blank" rel="noopener noreferrer">
                  <Facebook />
                </a>
              </span>
              <span>
                <a href="https://www.tiktok.com/@arbuapp" target="_blank" rel="noopener noreferrer">
                  <svg
                    viewBox="0 0 24 24"
                    width="25"
                    height="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 3c.5 2.5 2.5 4.5 5 5v3c-2.5 0-4.5-1-6-2.5V16a5 5 0 1 1-5-5c.5 0 1 .1 1.5.2v3.2c-.5-.3-1-.4-1.5-.4a2.5 2.5 0 1 0 2.5 2.5V3h3z"/>
                  </svg>
                </a>
              </span>
              <span>
                <a href="https://www.instagram.com/arbucbba/" target="_blank" rel="noopener noreferrer">
                  <Instagram />
                </a>
              </span>
            </div>
          </div>
          <div className={styles.tecnoLabInfo}>
             <a href="https://labtecnosocial.org" target="_blank" rel="noopener noreferrer">
              <img src={labLogoSrc} alt="tecnolab icon info" />
            </a>
          </div>
        </div>
        <div className="line"></div>
        <div className={styles.rights}>
          <span>© {year} ARBU. Derechos Reservados</span>
          <div className={styles.rightsLinks}>
            <Link to="/acerca">Acerca de Arbu</Link>
            <a href="https://labtecnosocial.org/politica-de-privacidad-de-la-app-arbu/" target="_blank" rel="noopener noreferrer">
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
