import React, { useState } from 'react';
import { Plus, Mic, Globe, Play } from 'lucide-react';

const PromptComposer = () => {
  const [prompt, setPrompt] = useState('');
  const [groundingEnabled, setGroundingEnabled] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-2 relative transition-all">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type a prompt..."
        className="w-full bg-transparent resize-none outline-none p-3 pb-12 text-gray-800 text-sm placeholder-gray-400"
        rows="3"
      ></textarea>
      
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Plus size={20} />
          </button>
          
          <button 
            onClick={() => setGroundingEnabled(!groundingEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              groundingEnabled 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Globe size={14} className={groundingEnabled ? 'text-blue-600' : 'text-gray-400'} />
            Grounding with Search
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Mic size={20} />
          </button>
          
          <button 
            disabled={!prompt.trim()}
            className={`flex items-center justify-center p-2 rounded-full transition-colors ${
              prompt.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptComposer;
