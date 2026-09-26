import React from "react";
import img from "../assets/arbuimg.webp";
import { Link } from "react-router-dom";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
const ProbarApi = () => {
  return (
    <>
      <SwaggerUI url="https://arbu-api.onrender.com/v3/api-docs" />
    </>
  );
};

export default ProbarApi;
