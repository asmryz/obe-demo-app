import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-medium text-gray-800">SZABIST OBE</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Run settings removed from here */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
