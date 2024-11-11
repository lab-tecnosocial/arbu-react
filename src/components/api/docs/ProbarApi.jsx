import React from "react";
import img from "../assets/arbuimg.webp";
import { Link } from "react-router-dom";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
const ProbarApi = () => {
  return (
    <>
      <SwaggerUI url="https://serviceapiarbu.onrender.com/swagger.json" />
    </>
  );
};

export default ProbarApi;
