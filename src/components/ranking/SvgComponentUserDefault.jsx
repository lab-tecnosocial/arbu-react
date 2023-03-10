import * as React from "react"

const SvgComponentUserDefault = (props) => (
  <svg
    width="80px"
    height="80px"
    viewBox="0 0 720 720"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    className="img-user-list"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeMiterlimit: 1.5,
    }}
    {...props}
  >
    <circle
      cx={360}
      cy={360}
      r={360}
      style={{
        fill: "#ebf5ee",
        stroke: "#174c44",
        strokeWidth: 24,
      }}
    />
    <path
      d="M360 123.158c-69.364 0-126 56.636-126 126s56.636 126 126 126 126-56.636 126-126-56.636-126-126-126Zm-144.9 302.4c-31.091 0-56.7 25.61-56.7 56.7v15.111c0 37.054 23.495 70.292 59.333 93.146 35.838 22.854 84.872 36.643 142.267 36.643 57.395 0 106.429-13.789 142.267-36.643 35.838-22.854 59.333-56.092 59.333-93.146v-15.111c0-31.09-25.61-56.7-56.7-56.7H215.1Z"
      style={{
        fill: "#174c44",
        fillRule: "nonzero",
      }}
    />
  </svg>
)

export default SvgComponentUserDefault;