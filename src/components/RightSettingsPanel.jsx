import React from 'react';
import { ChevronRight, ChevronLeft, Info } from 'lucide-react';
import RightPanelComponent from './RightPanelComponent';

const RightSettingsPanel = ({ isOpen, onToggle, args = {} }) => {
    return (
        <div className={`absolute right-0 top-0 h-full transition-all duration-300 z-40 ${isOpen ? 'w-lg border-l border-gray-200 shadow-xl' : 'w-0 border-none'}`}>
            {/* Tiny Sticky Toggle Button */}
            {Object.entries(args).length === 0 &&
                <div className="absolute top-4 -left-3.5 z-30">
                    <button
                        onClick={onToggle}
                        className="p-0 rounded-l-md bg-white border border-r-0 border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm transition-all duration-200 flex items-center justify-center h-6 active:scale-90"
                        title={isOpen ? "Hide settings" : "Show settings"}
                    >
                        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            }
            <div className={`w-lg h-full bg-white flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="font-semibold text-gray-800">OBE Run Settings</span>
                </div>

                {args?.cid && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5 text-blue-800 text-sm font-medium">
                        <Info size={16} className="text-blue-500 shrink-0" />
                        <pre>{JSON.stringify({ onToggle, isOpen })}</pre>
                        <span>Configuring Course ID: <strong className="font-bold">#{args.cid}</strong></span>
                    </div>
                )}

                <RightPanelComponent />
            </div>
        </div>
    );
};

export default RightSettingsPanel;
