import React, { useState } from 'react';
import {
    Menu, ChevronDown, ChevronRight, Play, LayoutGrid, LayoutDashboard,
    BookOpen, Search, Sparkles, Key, Settings, Zap, User
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        Build: false,
        Dashboard: false,
        Documentation: false
    });

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        { name: 'Playground', icon: <Play size={20} />, active: true },
        {
            name: 'Build',
            icon: <LayoutGrid size={20} />,
            children: ['Apps', 'Gallery', 'Templates']
        },
        {
            name: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
            children: ['Overview', 'Usage', 'Billing']
        },
        {
            name: 'Documentation',
            icon: <BookOpen size={20} />,
            children: ['Quick Start', 'API Reference', 'Guides']
        }
    ];

    const bottomLinks = [
        { name: 'Search', icon: <Search size={20} /> },
        { name: 'What\'s new', icon: <Sparkles size={20} /> },
        { name: 'Get API key', icon: <Key size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className={`flex flex-col h-full bg-gray-50/50 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 border-none opacity-0' : 'w-64 border-r border-gray-200 opacity-100'}`}>
            {/* Header */}
            <div className="flex items-center p-4 h-16 border-b border-transparent">
                {!isCollapsed && <span className="font-semibold text-lg tracking-tight">AI Studio</span>}
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
                {menuItems.map((item) => (
                    <div key={item.name}>
                        <div
                            onClick={() => item.children ? toggleMenu(item.name) : null}
                            className={`flex items-center p-2 rounded-lg cursor-pointer ${item.active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'
                                }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    {item.children && (
                                        expandedMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                    )}
                                </>
                            )}
                        </div>

                        {/* Child items */}
                        {!isCollapsed && item.children && expandedMenus[item.name] && (
                            <div className="ml-9 mt-1 space-y-1">
                                {item.children.map(child => (
                                    <div key={child} className="p-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer rounded hover:bg-blue-50">
                                        {child}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="p-2 space-y-1 border-t border-gray-200">
                {!isCollapsed && (
                    <div className="p-3 mb-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                        <div className="flex items-center text-blue-800 font-medium text-sm mb-1">
                            <Zap size={16} className="mr-1.5 fill-blue-600 text-blue-600" /> Upgrade plan
                        </div>
                        <p className="text-xs text-blue-600/80 mb-2">Get more quota and features</p>
                    </div>
                )}

                {bottomLinks.map((link) => (
                    <div key={link.name} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-700" title={isCollapsed ? link.name : ''}>
                        <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                            {link.icon}
                        </div>
                        {!isCollapsed && <span className="text-sm font-medium">{link.name}</span>}
                    </div>
                ))}

                {/* User Profile */}
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200">
                        <div className={`w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">Alex Developer</p>
                                <p className="text-xs text-gray-500 truncate">alex@example.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
