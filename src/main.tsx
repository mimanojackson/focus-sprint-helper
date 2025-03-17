
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { Toaster } from "./components/ui/toaster";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SubscriptionProvider>
        <App />
        <Toaster />
      </SubscriptionProvider>
    </ThemeProvider>
  </React.StrictMode>
);
