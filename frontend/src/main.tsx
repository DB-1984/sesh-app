import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/private-route.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public routes - the /users/ is preserved but loads the LoginRegisterPage 
      with the correct component based on the Route prop 'mode' */}
      <Route path="/users/login" element={<LoginRegisterPage mode="login" />} />
      <Route path="/users/register" element={<LoginRegisterPage mode="register" />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/users/dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/users/login" replace />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
