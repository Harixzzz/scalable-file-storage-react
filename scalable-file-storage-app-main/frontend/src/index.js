// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const isLocal = window.location.hostname === "localhost";

const redirectUri = isLocal
  ? "http://localhost:3000/"
  : window.location.origin + "/";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_0Q99e553N",
  client_id: "120vfbb5r97d01vio63cisbqti",

  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,

  response_type: "code",
  scope: "openid email phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
