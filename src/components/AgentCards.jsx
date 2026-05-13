import React from 'react';
import { Settings2 } from 'lucide-react';

const AgentCards = ({ onOpenModal }) => {
    return (
        <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <Settings2 className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">Custom AI Agents</h3>
            <p className="text-gray-600 max-w-sm mb-8 leading-relaxed">
                Build and deploy specialized agents that can use tools, search the web, and execute code to solve complex problems.
            </p>
            <button
                onClick={onOpenModal}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-medium active:scale-95"
            >
                Create New Agent
            </button>
        </div>
    );
};

export default AgentCards;
