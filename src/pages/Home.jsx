import React, { useState, useRef, useEffect } from 'react';
import ModelCards from '../components/ModelCards';
import AgentCards from '../components/AgentCards';
// import PromptComposer from '../components/PromptComposer';
import AgentModal from '../components/AgentModal';
import Table from '../components/Table';
import { MoreVertical, Settings2, Settings, HelpCircle, MessageSquare, Trash2, Share2, Download } from 'lucide-react';
import { store } from '../store';

function Home() {
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Models');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const moreMenuRef = useRef(null);
    useEffect(() => {
        const { initialized, } = store.getState();
        if (!initialized) {
            store.setState({ initialized: true });
        }
        setIsVisible(true);
    }, []);

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
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
                <h2 className="text-3xl font-normal text-gray-900 mb-8">Dash Board</h2>

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
                        {/* <Table /> */}
                    </div>

                    {/* Agents Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === 'Agents'
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0'
                            }`}
                    >
                        <AgentCards onOpenModal={() => setIsAgentModalOpen(true)} />
                    </div>
                </div>

                <div className="flex-1"></div>
            </div>

            {isAgentModalOpen && (
                <AgentModal onClose={() => setIsAgentModalOpen(false)} />
            )}
        </div>
    );
}

export default Home;
