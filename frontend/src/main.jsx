import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import LoginRegisterPage from "./pages/LoginRegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/private-route.jsx";
import AllSeshes from "./components/all-seshes.jsx";
import ViewSesh from "./components/view-sesh.jsx";
import EditExercise from "./components/edit-exercise.jsx";
import { HelmetProvider } from "react-helmet-async";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public routes - the /users/ is preserved but loads the LoginRegisterPage 
      with the correct component based on the Route prop 'mode' */}

      {/*“The LoginRegisterPage is dynamic based on the mode prop, which is determined 
      by the route that matches the current URL.” */}
      <Route path="/users/login" element={<LoginRegisterPage mode="login" />} />
      <Route path="/users/register" element={<LoginRegisterPage mode="register" />} />

      {/* Private routes */}
     <Route element={<PrivateRoute />}>
      <Route path="/users/dashboard" element={<Dashboard />}> {/* Always mount this */}
        <Route index element={<AllSeshes />} /> {/* Load all seshes by default */}
        <Route path="sesh/:id" element={<ViewSesh />} /> {/* Load this if the path is /sesh/id: */}
        <Route path="sesh/:seshId/exercise/:exerciseId/edit" element={<EditExercise />} />
      </Route>
    </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/users/login" replace />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
  </ HelmetProvider>
);
