import React, { useState, useRef, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RightSettingsPanel from './components/RightSettingsPanel';
import ModelCards from './components/ModelCards';
import PromptComposer from './components/PromptComposer';
import AgentModal from './components/AgentModal';
import RegionTable from './components/RegionTable';
import { Menu, MoreVertical, Settings2, Settings, FileCode, HelpCircle, MessageSquare, Trash2, Share2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from './components/Layout';

function Home() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Models');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setIsMoreMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-1 overflow-hidden relative h-full">
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Hamburger Button - Now in front of sidebar, below the main header */}
                <div className="absolute top-2 left-2 z-20">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-600 transition-colors bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Scrollable Center Content */}
                <main className="flex-1 overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col">
                    <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
                        <h2 className="text-3xl font-normal text-gray-900 mb-8">Explore AI models</h2>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex bg-gray-100/80 p-1 rounded-lg relative min-w-[200px]">
                                {/* Sliding Indicator */}
                                <div
                                    className="absolute h-[calc(100%-8px)] top-1 bg-white shadow-sm rounded-md transition-all duration-300 ease-out"
                                    style={{
                                        left: activeTab === 'Models' ? '4px' : 'calc(50% + 2px)',
                                        width: 'calc(50% - 6px)'
                                    }}
                                />
                                <button
                                    onClick={() => setActiveTab('Models')}
                                    className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'Models' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Models
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('Agents');
                                        // setIsAgentModalOpen(true); // Removed automatic modal on tab switch for better UX
                                    }}
                                    className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'Agents' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Agents
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                                    Start building &rarr;
                                </button>
                                <div className="relative" ref={moreMenuRef}>
                                    <button
                                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                        className={`p-1.5 rounded-full transition-all duration-200 ${isMoreMenuOpen ? 'bg-gray-100 text-gray-900 shadow-inner' : 'hover:bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {isMoreMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-md z-50 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Playground Actions
                                            </div>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Settings size={18} className="text-gray-400" />
                                                <span>View settings</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Share2 size={18} className="text-gray-400" />
                                                <span>Share playground</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Download size={18} className="text-gray-400" />
                                                <span>Export configuration</span>
                                            </button>

                                            <div className="h-px bg-gray-100 my-2" />

                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Support
                                            </div>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <HelpCircle size={18} className="text-gray-400" />
                                                <span>Help & documentation</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <MessageSquare size={18} className="text-gray-400" />
                                                <span>Send feedback</span>
                                            </button>

                                            <div className="h-px bg-gray-100 my-2" />

                                            <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                                <Trash2 size={18} className="text-red-400" />
                                                <span>Reset to default</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative flex-1">
                            {/* Models Content */}
                            <div
                                className={`transition-all duration-500 ease-in-out ${activeTab === 'Models'
                                    ? 'translate-x-0 opacity-100'
                                    : '-translate-x-8 opacity-0 pointer-events-none absolute inset-0'
                                    }`}
                            >
                                <ModelCards />
                                <RegionTable />
                            </div>

                            {/* Agents Content */}
                            <div
                                className={`transition-all duration-500 ease-in-out ${activeTab === 'Agents'
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0'
                                    }`}
                            >
                                <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Settings2 className="text-blue-600" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-medium text-gray-900 mb-3">Custom AI Agents</h3>
                                    <p className="text-gray-600 max-w-sm mb-8 leading-relaxed">
                                        Build and deploy specialized agents that can use tools, search the web, and execute code to solve complex problems.
                                    </p>
                                    <button
                                        onClick={() => setIsAgentModalOpen(true)}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-medium active:scale-95"
                                    >
                                        Create New Agent
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1"></div>
                    </div>
                </main>
            </div>

            <RightSettingsPanel isOpen={isRightPanelOpen} onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)} />

            {isAgentModalOpen && (
                <AgentModal onClose={() => setIsAgentModalOpen(false)} />
            )}
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} fallbackElement={<p>Loading…</p>} />;
}
