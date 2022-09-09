import React from "react";
import "./Footer.css";

import logoLab from "./lab-fondo-oscuro.png";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import facebook from "./facebook.png";
import instagram from "./instagram.png";
import tweeter from "./tweeter.png";
const Footer = () => {
  return (
    <div className="main-footer">
      <div className="row-footer">
        {/* <div className='row-footer-content'> */}
        <div className="col">
          {/* <Typography sx={{fontFamily:'Poppins'}}> <Box sx={{ fontWeight: 'bold', m: 1, fontFamily:'Poppins' }}>Conoce más</Box></Typography> */}
          <div
            className="list-unstyled"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Link to="/proyecto" style={{ color: "#fff" }}>
              Acerca de Arbu
            </Link>
            {/* <Link to="/metodologia" style={{color:'#fff'}}>Terminos de servicio</Link> */}

            <a
              href="https://labtecnosocial.org/politica-de-privacidad-de-la-app-arbu/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              Política de privacidad
            </a>
          </div>
        </div>
        {/* </div> */}
        <div className="col" style={{ textAlign: "center" }}>
          <Typography sx={{ fontFamily: "Poppins" }}>Síguenos en</Typography>

          <div className="social-media">
            <a href="https://m.facebook.com/ArbuCb/" target="_blank" rel="noopener noreferrer">
              <img className="social-button" src={facebook} alt="" width={40} />
            </a>
            <a href="https://twitter.com/?lang=es" target="_blank" rel="noopener noreferrer">
              <img className="social-button" src={tweeter} alt="" width={40} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <img
                className="social-button"
                src={instagram}
                alt=""
                width={40}
              />
            </a>
          </div>
          <br />
          <Typography sx={{ fontFamily: "Poppins" }}>
            Una iniciativa de
          </Typography>
          {/* <SvgLogoOscuro width="250px" /> */}

          <MuiLink href="https://labtecnosocial.org/" target="_blank">
            <img src={logoLab} alt="" width="100px" />
          </MuiLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
