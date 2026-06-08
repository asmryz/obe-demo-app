import React, { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';
import { Info } from 'lucide-react';
import { useStore } from '../store';

function Curriculum() {
    const curriculums = useStore((state) => state.curriculums) || [];
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select');

    const options = ['Select', ...curriculums.map(c => String(c.year))];

    useEffect(() => {
        setSelectedOption('Select');
    }, [curriculums]);

    const selectedCurriculum = curriculums.find(c => String(c.year) === selectedOption);
    const curriculumId = selectedCurriculum ? selectedCurriculum.curid : null;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header Row */}
            <div className="max-w-7xl w-full flex flex-row items-center justify-between pb-4 mb-8">
                <h2 className="text-3xl font-normal text-gray-900">Curriculums</h2>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year:</span>
                    <Dropdown
                        options={options}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        placeholder="Select"
                        showRoundedOutline={false}
                        className="w-26"
                    />
                </div>
            </div>

            {/* Display Content Area */}
            <div className="w-full border border-dashed border-gray-200 rounded-2xl p-16 bg-gray-50/50 flex flex-col items-center justify-center">
                {curriculumId ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-sm w-full">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Active Curriculum ID</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-blue-600">{curriculumId}</span>
                            <span className="text-sm text-gray-500 font-medium">({selectedOption} Plan)</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full border border-dashed border-gray-200 rounded-2xl p-16 bg-gray-50/50 flex flex-col items-center justify-center">
                        <span className="text-base text-gray-400 italic">Please select a year to load the curriculum details</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Curriculum;
