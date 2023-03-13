
import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/root";
import Login from "./components/login";
import Auth from "./components/auth";
import ErrorPage from "./components/error";
import Adminadd from "./components/adminadd";
import Userpage from "./components/userpage";
import Cookies from "universal-cookie";

const cookie = new Cookies();

const isAdmin = cookie.get("role") === "true";
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

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
