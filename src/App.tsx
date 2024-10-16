import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import Navbar from "./components/Navbar";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <></>
    </GoogleOAuthProvider>
  );
}

export default App;
