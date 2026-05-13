import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Menu, ChevronDown, ChevronRight, Play, LayoutGrid, LayoutDashboard,
    BookOpen, Search, Sparkles, Key, Settings, Zap, User
} from 'lucide-react';
import { store } from '../store';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        Build: false,
        Dashboard: false,
        Analytics: false,
        Documentation: false
    });

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        {
            name: 'Build',
            icon: <LayoutGrid size={20} />,
            children: [
                { name: 'Recap Sheets', path: '/recap-sheets' },
                { name: 'Apps', path: '/apps' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Templates', path: '/templates' }
            ]
        },
        {
            name: 'Analytics',
            icon: <LayoutDashboard size={20} />,
            children: [
                { name: 'Overview', path: '/overview' },
                { name: 'Usage', path: '/usage' },
                { name: 'Billing', path: '/billing' }
            ]
        },
        {
            name: 'Documentation',
            icon: <BookOpen size={20} />,
            children: [
                { name: 'Quick Start', path: '/quickstart' },
                { name: 'API Reference', path: '/api-reference' },
                { name: 'Guides', path: '/guides' }
            ]
        }
    ];

    const bottomLinks = [
        { name: 'Search', icon: <Search size={20} />, path: '/search' },
        { name: 'What\'s new', icon: <Sparkles size={20} />, path: '/news' },
        { name: 'Get API key', icon: <Key size={20} />, path: '/api-key' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' }
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
                        {item.path ? (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'}`
                                }
                                title={isCollapsed ? item.name : ''}
                            >
                                <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className="flex-1 text-sm font-medium">{item.name}</span>}
                            </NavLink>
                        ) : (
                            <div
                                onClick={() => toggleMenu(item.name)}
                                className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-700`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                        {expandedMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Child items */}
                        {!isCollapsed && item.children && expandedMenus[item.name] && (
                            <div className="ml-9 mt-1 space-y-1">
                                {item.children.map(child => (
                                    <NavLink
                                        key={child.name}
                                        to={child.path}
                                        className={({ isActive }) =>
                                            `block p-1.5 text-sm rounded transition-colors ${isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`
                                        }
                                    >
                                        {child.name}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <pre style={{ fontSize: "12px", height: "200px", overflowY: "auto" }}>{JSON.stringify(store.getState(), null, 2)}</pre>
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
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'}`
                        }
                        title={isCollapsed ? link.name : ''}
                    >
                        <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                            {link.icon}
                        </div>
                        {!isCollapsed && <span className="text-sm font-medium">{link.name}</span>}
                    </NavLink>
                ))}

                <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-700" title={isCollapsed ? 'Profile' : ''}>
                    <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            JD
                        </div>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                            <div className="truncate mr-2">
                                <p className="text-xs font-bold text-gray-800 truncate">John Doe</p>
                                <p className="text-[10px] text-gray-500 truncate">Pro Plan</p>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
