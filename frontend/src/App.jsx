import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const isLoggedIn = false; // replace with session logic later

  return (
    <Router>
      <Routes>
        <Route
          path="/users/login"
          element={isLoggedIn ? <Navigate to="/users/login" /> : <LoginPage />}
        />
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/users/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
