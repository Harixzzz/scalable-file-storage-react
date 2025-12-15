// src/App.js
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "120vfbb5r97d01vio63cisbqti",
      code: code,
      redirect_uri: "http://localhost:3000/",
    });

    const response = await fetch(
      "https://us-east-1-0Q99e553N.auth.us-east-1.amazoncognito.com/oauth2/token",
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

    localStorage.setItem("id_token", data.id_token);
    localStorage.setItem("access_token", data.access_token);

    window.history.replaceState({}, document.title, "/");
  };

  const login = () => {
    window.location.href =
      "https://us-east-1-0Q99e553N.auth.us-east-1.amazoncognito.com/login" +
      "?client_id=120vfbb5r97d01vio63cisbqti" +
      "&response_type=code" +
      "&scope=openid+email+phone" +
      "&redirect_uri=http://localhost:3000/";
  };

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
