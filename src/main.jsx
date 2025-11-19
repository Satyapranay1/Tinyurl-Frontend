import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="code/:code" element={<StatsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
