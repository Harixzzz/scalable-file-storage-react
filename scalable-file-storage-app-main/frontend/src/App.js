// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import { awsConfig } from "./aws-config";
import Dashboard from "./components/Dashboard";

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

function randomString(length = 64) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let res = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) res += charset[arr[i] % charset.length];
  return res;
}

function decodeIdTokenEmail(idToken) {
  try {
    const payloadPart = idToken.split(".")[1];
    const fixed = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(fixed);
    const payload = JSON.parse(json);
    return payload.email || payload["cognito:username"] || payload.sub || "Logged in user";
  } catch {
    return "Logged in user";
  }
}

export default function App() {
  const [idToken, setIdToken] = useState(localStorage.getItem("id_token") || "");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || "");
  const [email, setEmail] = useState(idToken ? decodeIdTokenEmail(idToken) : "");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = useMemo(() => !!idToken, [idToken]);

  const login = async () => {
    const verifier = randomString(64);
    const challenge = await sha256(verifier);
    const state = randomString(24);

    sessionStorage.setItem("pkce_verifier", verifier);
    sessionStorage.setItem("oauth_state", state);

    const redirectUri = awsConfig.redirectUriLocal;

    const url =
      `${awsConfig.cognitoDomain}/login` +
      `?client_id=${encodeURIComponent(awsConfig.userPoolClientId)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid email phone")}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${encodeURIComponent(challenge)}`;

    window.location.href = url;
  };

  const logout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("pkce_verifier");
    sessionStorage.removeItem("oauth_state");
    setIdToken("");
    setAccessToken("");
    setEmail("");

    const url =
      `${awsConfig.cognitoDomain}/logout` +
      `?client_id=${encodeURIComponent(awsConfig.userPoolClientId)}` +
      `&logout_uri=${encodeURIComponent(awsConfig.logoutUriLocal)}`;
    window.location.href = url;
  };

  const exchangeCodeForToken = async (code, returnedState) => {
    try {
      setLoading(true);

      const savedState = sessionStorage.getItem("oauth_state");
      const verifier = sessionStorage.getItem("pkce_verifier");

      if (!verifier) {
        alert("Missing PKCE verifier. Clear site data and login again.");
        return;
      }

      if (savedState && returnedState && savedState !== returnedState) {
        alert("State mismatch. Clear site data and login again.");
        return;
      }

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: awsConfig.userPoolClientId,
        code,
        redirect_uri: awsConfig.redirectUriLocal,
        code_verifier: verifier,
      });

      const res = await fetch(`${awsConfig.cognitoDomain}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const text = await res.text();
      console.log("TOKEN RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        alert(`Token exchange failed: ${data.error || "invalid_grant"} ${data.error_description || ""}`);
        return;
      }

      localStorage.setItem("id_token", data.id_token);
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

      setIdToken(data.id_token);
      setAccessToken(data.access_token);
      setEmail(decodeIdTokenEmail(data.id_token));

      sessionStorage.removeItem("pkce_verifier");
      sessionStorage.removeItem("oauth_state");

      // remove ?code=...&state=... from URL
      window.history.replaceState({}, document.title, "/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle callback after Hosted UI redirects back
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code && !idToken) exchangeCodeForToken(code, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dashboard
      isLoggedIn={isLoggedIn}
      loading={loading}
      login={login}
      logout={logout}
      idToken={idToken}
      accessToken={accessToken}
      email={email}
    />
  );
}
