// src/App.js
import { awsConfig } from "./aws-config";

function App() {
  const login = () => {
    window.location.href =
      `${awsConfig.cognitoDomain}/login` +
      `?client_id=${awsConfig.userPoolClientId}` +
      `&response_type=code` +
      `&scope=openid+email+phone` +
      `&redirect_uri=${encodeURIComponent(awsConfig.redirectUri)}`;
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
