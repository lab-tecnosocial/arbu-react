import React from "react";
import "./HomeComponent.css";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import celular from "./celular1.png";
import googleplaybutton from "./googleplaybutton.png";
import adoptalogo from "./adoptalogo.png";
import cuidalogo from "./cuidalogo.png";
import aprendelogo from "./aprendelogo.png";
import arbolitos1 from "./arbolitos1.png";
import Footer from "../footer/Footer";
import PricingComponent from "../pricing/PricingComponent";
const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const HomeComponent = () => {
  return (
    <>
      {/* <main style={{ padding: "1rem 0" }}>
      <h2>HomeComponent</h2>
      
    </main> */}
      <div style={{ padding: "1rem 0" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={1} md={1}></Grid>
            <Grid
              item
              xs={10}
              md={10}
              sx={{
                marginTop: "auto",
                marginBottom: "auto",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <div className="container-text-imagen">
                <div style={{ margin: "auto" }}>
                  <div style={{ padding: "0px 20px" }}>
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "1.4rem",
                        lineHeight: "2rem",
                      }}
                    >
                      App para el cuidado del Arbolado Urbano
                    </span>
                  </div>
                  <br />
                  <div style={{ fontFamily: "Open Sans", padding: "0px 20px" }}>
                    Arbu es una aplicación diseñada para el{" "}
                    <strong>cuidado</strong> y <strong>monitoreo</strong> del
                    arbolado urbano
                  </div>
                  <br />
                  <center>
                    <img
                      className="imagen-celular1-mobile"
                      src={celular}
                      alt=""
                      width={200}
                    />
                  </center>
                  <br />
                  <div>
                    <a href="https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&hl=es_BO&gl=US" target="_blank" rel="noopener noreferrer">
                    <img className="googleplaybutton" src={googleplaybutton} alt="" width={200} />
                    </a>
                  </div>
                </div>
                <div style={{ margin: "auto" }}>
                  <img
                    className="imagen-celular1"
                    src={celular}
                    alt=""
                    width={200}
                  />
                </div>
              </div>
            </Grid>

            <Grid item xs={1} md={1}></Grid>
          </Grid>
        </Box>
        <br />
        <br />
        <div className="container-logos">
          <img src={arbolitos1} alt="" className="arbolitos1"/>
          <div>
            <center>
            <img src={adoptalogo} alt="" width={200}  />
            </center>
            <div className="texto-para-logos titulos">
              <span>Adopta</span>
            </div>
            <div className="texto-para-logos parrafos">
            <span>Adopta árboles urbanos en el mapa</span>
            </div>
          </div>
          <div>
            <center>
            <img src={cuidalogo} alt="" width={200} />
            </center>
            <div className="texto-para-logos titulos">
            <span>Cuida</span>
            </div>
            <div className="texto-para-logos parrafos">
            <span>Programa recordatorios de regado para los árboles</span>
            </div>
          </div>
          <div>
            <center>
            <img src={aprendelogo} alt="" width={200} />
            </center>
            <div className="texto-para-logos titulos">
            <span>Aprende</span>
            </div>
            <div className="texto-para-logos parrafos">
            <span>Revisa y aprende sobre las especies nativas e introducidas</span>
            </div>
          </div>
        </div>
        <br />
        <br />
        <PricingComponent />
        <br />
        <br />
        <Footer />
      </div>
    </>
  );
};

export default HomeComponent;
