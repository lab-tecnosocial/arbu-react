import React from "react";
import styles from './Footer.module.css';

import logoLab from "./lab-fondo-oscuro.png";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import facebook from "./facebook.png";
import instagram from "./instagram.png";
import tweeter from "./tweeter.png";
import { Facebook, Instagram, Youtube } from "lucide-react";
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
      {/* <div className="row-footer"> */}
      {/*   <div className="col"> */}
      {/*     <div */}
      {/*       className="list-unstyled" */}
      {/*       style={{ display: "flex", flexDirection: "column", gap: "10px" }} */}
      {/*     > */}
      {/*       <Link to="/acerca" style={{ color: "#fff" }}> */}
      {/*         Acerca de Arbu */}
      {/*       </Link> */}
      {/*       <a */}
      {/*         href="https://labtecnosocial.org/politica-de-privacidad-de-la-app-arbu/" */}
      {/*         target="_blank" */}
      {/*         rel="noopener noreferrer" */}
      {/*         style={{ color: "#fff" }} */}
      {/*       > */}
      {/*         Política de privacidad */}
      {/*       </a> */}
      {/*     </div> */}
      {/*   </div> */}
      {/*   <div className="col" style={{ textAlign: "center" }}> */}
      {/*     <Typography sx={{ fontFamily: "Poppins" }}>Síguenos en</Typography> */}
      {/**/}
      {/*     <div className="social-media"> */}
      {/*       <a href="https://m.facebook.com/ArbuCb/" target="_blank" rel="noopener noreferrer"> */}
      {/*         <img className="social-button" src={facebook} alt="" width={40} /> */}
      {/*       </a> */}
      {/*       <a href="https://twitter.com/ArbuCbba" target="_blank" rel="noopener noreferrer"> */}
      {/*         <img className="social-button" src={tweeter} alt="" width={40} /> */}
      {/*       </a> */}
      {/*       <a href="https://www.instagram.com/arbucbba/" target="_blank" rel="noopener noreferrer"> */}
      {/*         <img */}
      {/*           className="social-button" */}
      {/*           src={instagram} */}
      {/*           alt="" */}
      {/*           width={40} */}
      {/*         /> */}
      {/*       </a> */}
      {/*     </div> */}
      {/*     <br /> */}
      {/*     <Typography sx={{ fontFamily: "Poppins" }}> */}
      {/*       Una iniciativa de */}
      {/*     </Typography> */}
      {/**/}
      {/*     <MuiLink href="https://labtecnosocial.org/" target="_blank"> */}
      {/*       <img src={logoLab} alt="" width="100px" /> */}
      {/*     </MuiLink> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
};

export default Footer;
