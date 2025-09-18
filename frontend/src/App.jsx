import { Outlet } from "react-router-dom";

// main or index jsx/tsx mounts everything to the DOM, and App.js
// is the parent of all the components being 'fed' to main/index, 
// with Outlet governing which Component loads inside of it

export default function App() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
