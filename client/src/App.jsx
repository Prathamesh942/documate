import "./App.css";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SingleDocument from "./pages/SingleDocument";

axios.defaults.baseURL = "https://documate-36bo.onrender.com";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/doc/:id",
    element: <SingleDocument />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
