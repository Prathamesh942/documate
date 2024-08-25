import './App.css'
import axios from "axios";
import Login from './components/Login'
import Register from './components/Register'
import { createBrowserRouter, RouterProvider } from "react-router-dom";


axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Documate</h1>
  },
  {
    path: "/login",
    element: <Login/>
  },{
    path: "/register",
    element: <Register/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
