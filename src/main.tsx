import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./Home";
import Join from "./pages/Join";
import CompleteJoin from "./pages/CompleteJoin";
import { ModalProvider } from "./components/Modal/ModalProvider";
import NewPassword from "./pages/NewPassword";
import FindPassword from "./pages/FindPassword";
import Mypage from "./pages/Mypage";

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
    },
    {
        path: "mypage",
        element: <Mypage />
    }
]);

createRoot(document.getElementById("root")!).render(
    <ModalProvider>
        <QueryClientProvider client={queryClient}>
            <App />
            <RouterProvider router={router} />
        </QueryClientProvider>
    </ModalProvider>
);
