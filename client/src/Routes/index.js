import { createBrowserRouter } from "react-router-dom"
import App from '../App';
import LoginRegister from "../Pages/loginRegister"
import Home from "../Pages/Home"
import MessagePage from "../Components/MessagePage"


const router = createBrowserRouter([

    {
        path : "/",
        element: <App/>,
        children: [
            {
                path: "login",
                element: <LoginRegister/>
            },
            {
                path: "",
                element: <Home/>,
                children:[
                    {
                        path: ':userId',
                        element: <MessagePage/>,
                    }
                ]
            }
        ]
    }
])

export default router