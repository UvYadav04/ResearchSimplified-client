import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import { ROUTES } from "../lib/constants";
import Simplifier from "../pages/Home/Analyzer/Simplifier";
import Layout from "../pages/Layout/Layout";
import ErrorElement from "../pages/Error/ErrorElement";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement:<ErrorElement/>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: ROUTES.SIMPLIFIER.path,
                element:<Simplifier/>
            }
        ]
    }
])

export default router