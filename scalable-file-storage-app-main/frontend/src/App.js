import { useEffect } from "react";
import { awsConfig } from "./aws-config";

const isLocal = window.location.hostname === "localhost";
const redirectUri = isLocal ? "http://localhost:3000/" : `${window.location.origin}/`;

// ✅ Cognito Hosted UI endpoints
const loginUrl = `${awsConfig.cognitoDomain}/login`;
const tokenUrl = `${awsConfig.cognitoDomain}/oauth2/token`;

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) exchangeCodeForToken(code);
  }, []);

  const exchangeCodeForToken = async (code) => {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: awsConfig.userPoolClientId,
      code,
      redirect_uri: redirectUri,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();
    console.log("TOKENS:", data);

    if (!response.ok) {
      alert(`Token exchange failed: ${data.error || ""} ${data.error_description || ""}`);
      return;
    }

    localStorage.setItem("id_token", data.id_token);
    localStorage.setItem("access_token", data.access_token);

    // clean URL
    window.history.replaceState({}, document.title, "/");
    alert("Login success ✅");
  };

  const login = () => {
    const url =
      `${loginUrl}` +
      `?client_id=${encodeURIComponent(awsConfig.userPoolClientId)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid email phone")}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = url;
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
