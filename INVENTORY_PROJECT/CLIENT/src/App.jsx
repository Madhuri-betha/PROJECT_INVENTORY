
import React, { useState,useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/root";
import Login from "./components/login";
import Auth from "./components/auth";
import ErrorPage from "./components/error";
import Adminadd from "./components/adminadd";
import Userpage from "./components/userpage";
import Cookies from "universal-cookie";

export default function App() {

  const cookie = new Cookies();
  const [isAdmin, setIsAdmin] = useState(cookie.get("admin") === "true");
  useEffect(() => {
    setIsAdmin(cookie.get("admin") === "true");
  }, []);
    

const router=createBrowserRouter(!isAdmin
  ?[
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "",
         element: <Userpage />,
       },
       {
          path: "inventory/authenticate",
          element: <Auth />,
        }, {
          path: "*",
          element: <ErrorPage />,
        }
      ],
    },
  ]
 
 :  [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/admin",
        element: <Adminadd />,
        },
      {
         path: "",
        element: <Userpage />,
      },
      {
        path: "inventory/authenticate",
        element: <Auth />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]  )

return (
    // <React.StrictMode>
      <RouterProvider router={router} />
    /* </React.StrictMode> */
  );
}
