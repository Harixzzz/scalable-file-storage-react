function App() {
  const login = () => {
    window.location.href =
      "https://us-east-1-0o99e553n.auth.us-east-1.amazoncognito.com/login" +
      "?client_id=120vfbb5r97d01vio63cisbqti" +
      "&response_type=code" +
      "&scope=openid+email+phone" +
      "&redirect_uri=http://localhost:3000/";
  };

  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
