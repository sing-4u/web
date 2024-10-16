import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Join from "./pages/Join.tsx";
import Home from "./Home.tsx";
import CompleteJoin from "./pages/CompleteJoin.tsx";

import NewPassword from "./pages/NewPassword.tsx";
import FindPassword from "./pages/findPassword.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "join",
        element: <Join />
    },
    {
        path: "complete-join",
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
            <RouterProvider router={router} />
            <App />
        </QueryClientProvider>
    </StrictMode>
);
