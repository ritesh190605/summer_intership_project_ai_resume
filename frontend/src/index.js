import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ResumeProvider } from "./context/ResumeContext";
import CursorGlow from "./components/Common/CursorGlow";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ResumeProvider>
      <CursorGlow />
      <App />
    </ResumeProvider>
  </React.StrictMode>
);

