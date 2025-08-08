import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importa el componente principal de la app
import './styles/index.css'; // si lo moviste a src/styles
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
