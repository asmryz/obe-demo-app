import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSettingsPanel from './RightSettingsPanel';
import { Menu, MoreVertical, User, Settings, LogOut } from 'lucide-react';

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [rightPanelArgs, setRightPanelArgs] = useState({});
    const [isMoreMenu, setIsMoreMenu] = useState(false);
    const moreMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setIsMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-medium text-gray-800">SZABIST OBE</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setIsMoreMenu(!isMoreMenu)}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all duration-200 text-gray-700 hover:bg-gray-100 outline-none ${isMoreMenu ? 'bg-gray-200' : ''
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                HMA
                            </div>
                            <div className="text-left leading-tight hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">Dr. Muhammad Umar Sidduqui</p>
                                <p className="text-sm text-gray-500">Admin</p>
                            </div>
                            {/* <MoreVertical size={16} className="text-gray-400 hover:text-gray-600 transition-colors" /> */}
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isMoreMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-md z-50 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-2.5 border-b border-gray-100 text-left">
                                    {/* <p className="text-sm font-semibold text-gray-900 truncate">Dr. Husnain Mansoor Ali</p> */}
                                    <p className="text-sm text-gray-500 truncate">husnain.mansoor@szabist.edu.pk</p>
                                </div>

                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left mt-2">
                                    User Profile
                                </div>
                                <div className="text-left">
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                                        <User size={18} className="text-gray-400" />
                                        <span>My Profile</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer">
                                        <Settings size={18} className="text-gray-400" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                <div className="h-px bg-gray-100 my-2" />

                                <div className="text-left">
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer">
                                        <LogOut size={18} className="text-red-400" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <Outlet context={{ isSidebarCollapsed, isRightPanelOpen, setIsRightPanelOpen, rightPanelArgs, setRightPanelArgs }} />
                    </main>
                </div>

                <RightSettingsPanel isOpen={isRightPanelOpen} onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)} args={rightPanelArgs} />
            </div>
        </div>
    );
}

export default Layout;
