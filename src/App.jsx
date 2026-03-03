import { RouterProvider, createBrowserRouter } from "react-router-dom";
import environment from "./config/config";
import Layout from "./layouts/Layout";
import HomePage from "./pages/Home";
import AllPosts from "./pages/AllPosts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddPost from "./pages/AddPost";
import Writers from "./pages/writers";
import About from "./pages/About";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "all-posts",
          element: <AllPosts />,
        },
        {
          path: "add-post",
          element: <AddPost />,
        },
        {
          path: "writers",
          element: <Writers />,
        },
        {
          path: "about",
          element: <About />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  console.log(environment.appwriteProjectId);

  return (
    <RouterProvider router={route}>
    </RouterProvider>
  );
}

export default App;
