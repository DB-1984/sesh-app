import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import LoginRegisterPage from "./pages/LoginRegisterPage.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AllSeshes from "./components/AllSeshes.jsx";
import ViewSesh from "./components/ViewSesh.jsx";
import EditExercise from "./components/EditExercise.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardStats from "./components/DashboardStats.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/users/login" element={<LoginRegisterPage mode="login" />} />
      <Route
        path="/users/register"
        element={<LoginRegisterPage mode="register" />}
      />
      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        {/* Header acts as the Layout for the entire /users prefix */}
        <Route path="/users" element={<Header />}>
          <Route path="dashboard" element={<Dashboard />}>
            {/* The 'index' is the default left panel (Stats) */}
            <Route index element={<DashboardStats />} />
            {/* This will render the Profile in that same spot */}
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="all-seshes" element={<AllSeshes />} />
          <Route path="sesh/:id" element={<ViewSesh />} />
          <Route
            path="sesh/:seshId/exercise/:exerciseId/edit"
            element={<EditExercise />}
          />
          {/* Default to dashboard if someone just goes to /users */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
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
