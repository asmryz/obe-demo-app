// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import Table from './components/Table'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import './App.css'
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from './components/Navbar'
import { store, useStore } from "./store";
import Dashboard from './components/Dashboard';
import Table from './components/Table';

const layoutLoader = async () => {
    console.log("layoutLoader");
    const { initialized } = store.getState();
    if (!initialized) {
        console.log("initialize app");
        await new Promise((r) => setTimeout(r, 2000));
        store.setState({ initialized: true });
    }
    return null;
};



const router = createBrowserRouter([
    {
        Component: Layout,
        loader: layoutLoader,
        children: [
            {
                path: "/",
                Component: Dashboard,
            },
            {
                // Component guard
                Component: ProtectedRoute,
                // Loader guard
                // loader: protectedRouteLoader,
                children: [
                    {
                        path: "table",
                        Component: Table,
                    },
                ],
            },
            {
                path: "signin",
                action: () => {
                    console.log("signInAction");
                    store.getState().signIn();
                    return redirect("/");
                },
                // loader: signInLoader,
            },
            {
                path: "signout",
                action: () => {
                    console.log("signOutAction");
                    store.getState().signOut();
                    return redirect("/");
                },
                // loader: signOutLoader,
            },
        ],
    },
]);




export default function App() {
    console.log("App");
    return <RouterProvider router={router} fallbackElement={<p>Loading…</p>} />;
}

