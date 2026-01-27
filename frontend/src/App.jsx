import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground transition-colors duration-300">
      <Helmet>
        <title>Sesh</title>
      </Helmet>
      <main>
        <Outlet />
      </main>

      {/* Toasts always need to be globally mounted */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
