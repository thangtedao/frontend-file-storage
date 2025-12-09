import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import FilesPage from "./pages/FilesPage";
import RecentPage from "./pages/RecentPage";
import TrashPage from "./pages/TrashPage";
import ErrorPage from "./pages/ErrorPage";
import FileSharePage from "./pages/FileSharePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";

import { loader as rootLoader } from "./pages/Root";
import { loader as filesLoader } from "./pages/FilesPage";
import { loader as trashLoader } from "./pages/TrashPage";
import { loader as shareLoader } from "./pages/FileSharePage";
import { loader as searchLoader } from "./pages/SearchPage";
import { loader as publicShareLoader } from "./pages/PublicSharePage";
import RegisterPage from "./pages/RegisterPage";
import PublicSharePage from "./pages/PublicSharePage";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <FilesPage />,
        loader: filesLoader,
      },
      {
        path: "files",
        element: <FilesPage />,
        loader: filesLoader,
      },
      {
        path: "recent",
        element: <RecentPage />,
      },
      {
        path: "trash",
        element: <TrashPage />,
        loader: trashLoader,
      },
      {
        path: "search/:term",
        element: <SearchPage />,
        loader: searchLoader,
      },
      {
        path: "share",
        element: <FileSharePage />,
        loader: shareLoader,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "file/:token/share",
    element: <PublicSharePage />,
    loader: publicShareLoader,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
