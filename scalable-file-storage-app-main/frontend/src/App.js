// src/App.js
import { useEffect } from "react";
import { awsConfig } from "./aws-config";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const login = () => {
    window.location.href =
      `${awsConfig.cognitoDomain}/login` +
      `?client_id=${awsConfig.userPoolClientId}` +
      `&response_type=code` +
      `&scope=openid+email+phone` +
      `&redirect_uri=${encodeURIComponent(awsConfig.redirectUri)}`;
  };

  const exchangeCodeForToken = async (code) => {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: awsConfig.userPoolClientId,
      code: code,
      redirect_uri: awsConfig.redirectUri,
    });

    const response = await fetch(
      `${awsConfig.cognitoDomain}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const data = await response.json();
    console.log("TOKENS:", data);

    if (data.id_token) {
      localStorage.setItem("id_token", data.id_token);
      localStorage.setItem("access_token", data.access_token);
      alert("Login successful!");
    } else {
      alert("Login failed. Check console.");
    }

    // clean URL
    window.history.replaceState({}, document.title, "/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Cognito Login Test</h2>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
