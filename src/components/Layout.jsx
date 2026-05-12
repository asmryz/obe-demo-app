import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSettingsPanel from './RightSettingsPanel';
import { Menu } from 'lucide-react';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

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

            {/* Main Wrapper */}
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

                <div className="flex-1 flex flex-col relative overflow-hidden">
                    {/* Hamburger Button - Toggles Sidebar */}
                    <div className="absolute top-2 left-2 z-20">
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-600 transition-colors bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
                            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-hidden">
                        <Outlet context={{ isSidebarCollapsed, isRightPanelOpen, setIsRightPanelOpen }} />
                    </main>
                </div>

                <RightSettingsPanel isOpen={isRightPanelOpen} onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)} />
            </div>
        </div>
    );
}

export default Layout;
