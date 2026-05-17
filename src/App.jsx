import React from 'react';
import { createBrowserRouter, RouterProvider, useRouteError, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Apps from './pages/Apps';
import RecapSheets from './pages/RecapSheets';
import { store } from "./store";
import CLOSheet from './pages/CLOSheet';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">
                    <span className="text-3xl font-bold">!</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Oops!</h1>
                <pre className="text-xl text-gray-600 mb-8">
                    {error.statusText || error.message || "An unexpected error has occurred."}
                </pre>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export const Placeholder = ({ title }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    React.useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`h-full flex items-center justify-center bg-gray-50 transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-300 mb-2">{title}</h1>
                <p className="text-gray-500">This page is under development.</p>
            </div>
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "apps", element: <Apps /> },
            { path: "recap-sheets", element: <RecapSheets /> },
            { path: "closheet/:closid", element: <CLOSheet /> },
            { path: "gallery", element: <Placeholder title="Gallery" /> },
            { path: "templates", element: <Placeholder title="Templates" /> },
            { path: "overview", element: <Placeholder title="Overview" /> },
            { path: "usage", element: <Placeholder title="Usage" /> },
            { path: "billing", element: <Placeholder title="Billing" /> },
            { path: "quickstart", element: <Placeholder title="Quick Start" /> },
            { path: "api-reference", element: <Placeholder title="API Reference" /> },
            { path: "guides", element: <Placeholder title="Guides" /> },
            { path: "search", element: <Placeholder title="Search" /> },
            { path: "news", element: <Placeholder title="What's New" /> },
            { path: "api-key", element: <Placeholder title="API Key" /> },
            { path: "settings", element: <Placeholder title="Settings" /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} fallbackElement={<p>Loading…</p>} />;
}
