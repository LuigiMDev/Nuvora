import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import ProductPage from "./pages/Product";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/product/:productId",
          element: <ProductPage />
        },
        {
          path: "cart",
          element: <Cart />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "login",
          element: <Login />
        }
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer pauseOnHover position="bottom-right" />
    </>
  );
}

export default App;
