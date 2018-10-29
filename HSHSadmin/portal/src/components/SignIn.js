import React from "react";
import { withRouter } from "react-router-dom";
import Background from "../background.jpg";
import { SignInCard } from "./cards/SignInCard";

const SignInPage = ({ history }) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      flexDirection: "column",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover"
    }}
  >
    <div>
      <p
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: "0",
          fontSize: 88,
          color: "white",
          fontWeight: "bold",
          padding: "0"
        }}
      >
        HARVARD SQUARE
      </p>
      <p
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginTop: "0",
          marginBottom: "0",
          fontSize: 58,
          color: "white",
          padding: "0"
        }}
      >
        HOMELESS SHELTER
      </p>
    </div>
    <SignInCard history={history} />
  </div>
);

export default withRouter(SignInPage);
