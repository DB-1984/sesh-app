// Import the toastify library & stylesheet into the main app (parent level)
import { Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Then we'll find a place for it to hide until needed in the DOM
const App = () => {
  return (
    <>
      <LoginPage />
      <Outlet />
    </>
  );
};

export default App;
