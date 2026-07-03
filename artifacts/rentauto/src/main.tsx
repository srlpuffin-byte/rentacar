import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

// Si VITE_API_URL está configurada (ej: la URL de Railway), úsala como base.
// Si no, los fetch van a /api/* que son las Vercel Serverless Functions locales.
const apiUrl = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL configurada en Vercel:", apiUrl || "NINGUNA (usando /api local)");
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);

