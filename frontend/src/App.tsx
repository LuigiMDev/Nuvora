import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import ProductPage from "./pages/Product";

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
