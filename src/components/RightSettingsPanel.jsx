import React, { useState } from 'react';
import { X, Code, PlaySquare, Settings2, Info, ChevronDown, ChevronRight, ChevronLeft, Edit2 } from 'lucide-react';

const RightSettingsPanel = ({ isOpen, onToggle }) => {
    const [sections, setSections] = useState({
        model: true,
        tools: true,
        advanced: false,
        safety: false
    });

    const [toggles, setToggles] = useState({
        structured: false,
        code: false,
        function: false,
        search: false,
        maps: false,
        url: false
    });

    const [sliders, setSliders] = useState({
        temperature: 1.0,
        topP: 0.95,
        outputLength: 2048
    });

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleSwitch = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={`relative h-full transition-all duration-300 flex-shrink-0 ${isOpen ? 'w-80 border-l border-gray-200' : 'w-0 border-none'}`}>
            {/* Tiny Sticky Toggle Button */}
            <div className="absolute top-4 -left-3.5 z-30">
                <button
                    onClick={onToggle}
                    className="p-0 rounded-l-md bg-white border border-r-0 border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm transition-all duration-200 flex items-center justify-center h-6 active:scale-90"
                    title={isOpen ? "Hide settings" : "Show settings"}
                >
                    {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <div className={`w-80 h-full bg-white flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="font-semibold text-gray-800">Run settings</span>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center text-sm font-medium text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
                            <Code size={16} className="mr-1.5" /> Get code
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {/* Model Info Section */}
                    <div className="mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</span>
                            <Info size={14} className="text-gray-400" />
                        </div>
                        <div className="font-medium text-gray-800">Gemini 1.5 Pro</div>
                        <div className="text-xs text-gray-500 mt-1">Multi-modal, reasoning, code</div>
                    </div>

                    {/* System Instructions */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm text-gray-800">System instructions</span>
                            <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={14} /></button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-500 h-20">
                            Optional instructions for the model...
                        </div>
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Sliders */}
                    <div className="space-y-5 mb-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-800">Temperature</label>
                                <input
                                    type="number"
                                    value={sliders.temperature}
                                    onChange={(e) => setSliders({ ...sliders, temperature: parseFloat(e.target.value) })}
                                    className="w-14 text-right border border-gray-300 rounded p-1 text-sm bg-gray-50"
                                    step="0.1" min="0" max="2"
                                />
                            </div>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={sliders.temperature}
                                onChange={(e) => setSliders({ ...sliders, temperature: parseFloat(e.target.value) })}
                                className="w-full accent-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800 block mb-2">Thinking Level</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none focus:border-blue-500">
                                <option>Standard</option>
                                <option>Deep</option>
                            </select>
                        </div>
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Tools Section */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleSection('tools')}
                            className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-3"
                        >
                            Tools
                            {sections.tools ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {sections.tools && (
                            <div className="space-y-3 pl-1">
                                {[
                                    { id: 'structured', label: 'Structured outputs' },
                                    { id: 'code', label: 'Code execution' },
                                    { id: 'function', label: 'Function calling' },
                                    { id: 'search', label: 'Grounding with Search' },
                                    { id: 'maps', label: 'Grounding with Maps' },
                                    { id: 'url', label: 'URL context' }
                                ].map(tool => (
                                    <div key={tool.id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{tool.label}</span>
                                        <div
                                            onClick={() => toggleSwitch(tool.id)}
                                            className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${toggles[tool.id] ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggles[tool.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Advanced Settings */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleSection('advanced')}
                            className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-3"
                        >
                            Advanced settings
                            {sections.advanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {sections.advanced && (
                            <div className="space-y-4 pl-1">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Stop sequence</label>
                                    <input type="text" placeholder="Add sequence" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-gray-500">Output length</label>
                                        <input
                                            type="number"
                                            value={sliders.outputLength}
                                            onChange={(e) => setSliders({ ...sliders, outputLength: parseInt(e.target.value) })}
                                            className="w-16 text-right border border-gray-300 rounded p-1 text-sm bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-gray-500">Top P</label>
                                        <input
                                            type="number"
                                            value={sliders.topP}
                                            onChange={(e) => setSliders({ ...sliders, topP: parseFloat(e.target.value) })}
                                            className="w-14 text-right border border-gray-300 rounded p-1 text-sm bg-gray-50"
                                            step="0.05" min="0" max="1"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={sliders.topP}
                                        onChange={(e) => setSliders({ ...sliders, topP: parseFloat(e.target.value) })}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="my-5 border-gray-200" />

                    {/* Safety Settings */}
                    <div className="mb-8">
                        <button
                            onClick={() => toggleSection('safety')}
                            className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-1"
                        >
                            Safety settings
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Block some</span>
                                {sections.safety ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RightSettingsPanel;
