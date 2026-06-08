import React, { useState } from 'react';
import { Info, Edit2, ChevronDown, ChevronRight } from 'lucide-react';
import Dropdown from './Dropdown';

const RightPanelComponent = () => {
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

    const [selectedModel, setSelectedModel] = useState('Washington Accord Standard v3');
    const [selectedThinkingLevel, setSelectedThinkingLevel] = useState('CLO-Level');

    const models = [
        'Washington Accord Standard v3',
        'HEC Policy Guideline 2023',
        'SZABIST Custom OBE Framework',
        'Outcome-Based Assessment v2',
        'Cognitive Focus Evaluator',
        'Affective & Psychomotor Evaluator',
        'Direct/Indirect Attainment Mode'
    ];

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleSwitch = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-left">

            {/* Custom Model Dropdown */}
            <Dropdown
                label="Evaluation Model"
                options={models}
                value={selectedModel}
                onChange={setSelectedModel}
                icon={Info}
                description="Washington Accord aligned Direct/Indirect attainment evaluation"
                className="mb-6"
            />

            {/* System Instructions */}
            <div className="mb-6 text-left">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-800">OBE Directives & Instructions</span>
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded cursor-pointer"><Edit2 size={14} /></button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-500 h-20 text-left">
                    Optional custom directives for OBE evaluation calculations...
                </div>
            </div>

            <hr className="my-5 border-gray-200" />

            {/* Sliders */}
            <div className="space-y-5 mb-6 text-left">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-800">Calculation Threshold Weight</label>
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

                <Dropdown
                    label="Assessment Depth"
                    options={['CLO-Level', 'PLO-Cohort Level']}
                    value={selectedThinkingLevel}
                    onChange={setSelectedThinkingLevel}
                />
            </div>

            <hr className="my-5 border-gray-200" />

            {/* Tools Section */}
            <div className="mb-4 text-left">
                <button
                    onClick={() => toggleSection('tools')}
                    className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-3 cursor-pointer outline-none"
                >
                    OBE Analytical Tools
                    {sections.tools ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {sections.tools && (
                    <div className="space-y-3 pl-1">
                        {[
                            { id: 'structured', label: 'Structured Washington Accord reports' },
                            { id: 'code', label: 'Automated attainment calculations' },
                            { id: 'function', label: 'Indirect survey feedback analysis' },
                            { id: 'search', label: 'Grounding with HEC Guidelines' },
                            { id: 'maps', label: 'Mapping with Course Objectives' },
                            { id: 'url', label: 'Web-based Course Folder import' }
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
            <div className="mb-4 text-left">
                <button
                    onClick={() => toggleSection('advanced')}
                    className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-3 cursor-pointer outline-none"
                >
                    Advanced OBE Parameters
                    {sections.advanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {sections.advanced && (
                    <div className="space-y-4 pl-1">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Convergence Criteria</label>
                            <input type="text" placeholder="Add criteria" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none bg-white" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-500">Max Student Cohort Size</label>
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
                                <label className="text-xs text-gray-500">Attainment Confidence Interval (Top P)</label>
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
            <div className="mb-8 text-left">
                <button
                    onClick={() => toggleSection('safety')}
                    className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-1 cursor-pointer outline-none"
                >
                    Academic Integrity Filters
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Strict validation</span>
                        {sections.safety ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default RightPanelComponent;
