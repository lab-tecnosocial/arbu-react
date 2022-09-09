import React from 'react'
import "./APIComponent.css"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import Footer from '../footer/Footer'
const APIComponent = () => {
    return (
        <div style={{marginTop:'85px'}}>
          {/* <h2>API</h2> */}
          
          {/* <SwaggerUI url="https://api-arbu.herokuapp.com/api-docs" /> */}
          <SwaggerUI url="https://api-arbu.herokuapp.com/swagger.json" />
          {/* <SwaggerUI url="http://localhost:4000/swagger.json" /> */}
          {/* <SwaggerUI url="http://localhost:4000/api-docs/" /> */}
          {/* <Footer /> */}
        </div>
      );
}

export default APIComponent