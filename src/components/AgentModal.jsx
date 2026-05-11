import React, { useState } from 'react';
import { X, Search, MoreVertical, Plus, Bot } from 'lucide-react';

const AgentModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Agents');
  const [searchQuery, setSearchQuery] = useState('');

  const agents = [
    { id: 1, name: 'Code Assistant', desc: 'Expert in React and Node.js', updated: '2 hours ago' },
    { id: 2, name: 'Data Analyst', desc: 'Analyzes CSVs and generates charts', updated: '1 day ago' },
    { id: 3, name: 'Copywriter', desc: 'Generates marketing copy', updated: '3 days ago' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Select an Agent</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs & Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('Models')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'Models' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Models
              </button>
              <button 
                onClick={() => setActiveTab('Agents')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'Agents' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Agents
              </button>
            </div>
            
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Create Agent
            </button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50">
          {activeTab === 'Agents' ? (
            <div className="space-y-1 p-2">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{agent.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {agent.updated}
                    </span>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              Model selection is available in the run settings panel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
