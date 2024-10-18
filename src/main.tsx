import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./Home";
import Join from "./pages/Join";
import CompleteJoin from "./pages/CompleteJoin";

import NewPassword from "./pages/NewPassword.tsx";
import FindPassword from "./pages/findPassword.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/join",
        element: <Join />
    },
    {
        path: "/complete-join",
        element: <CompleteJoin />
    },
    {
        path: "find-password",
        element: <FindPassword />
    },
    {
        path: "new-password",
        element: <NewPassword />
    }
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);
