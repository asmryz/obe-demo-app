import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from './Navbar';

function Layout() {
    return (
        <>
            <header><Navbar /></header>
            <main className="max-w-6xl mx-auto w-6/10 px-4">
                <Outlet />
            </main>
            <footer className="fixed bottom-0 left-0 right-0 z-10">Copyright</footer>
        </>
    )
}

export default Layout