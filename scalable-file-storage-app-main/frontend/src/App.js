// src/App.jsx (only the important part)
import React from "react";
import { useAuth } from "react-oidc-context";
import Dashboard from "./components/Dashboard";

function App() {
  const auth = useAuth();

  if (auth.isLoading) return <p>Loading...</p>;

  if (!auth.isAuthenticated) {
    return <button onClick={() => auth.signinRedirect()}>Login</button>;
  }

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
