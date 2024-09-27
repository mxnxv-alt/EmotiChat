// src/router/index.js

import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import LoginRegister from "../Pages/loginRegister";
import Home from "../Pages/Home";
import MessagePage from "../Components/MessagePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "login",
                element: <LoginRegister />,
            },
            {
                path: "", // This is the Home route
                element: <Home />,
                children: [
                    {
                        path: 'message/:userId', // Explicitly define the message route
                        element: <MessagePage />,
                    },
                ],
            },
            {
                path: "*", // Catch-all route for undefined paths
                element: <div>404 Not Found</div>,
            },
        ],
    },
]);

export default router;
