import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Dropdown = ({
    label,
    options,
    value,
    onChange,
    icon: Icon,
    description,
    placeholder = "Select...",
    showRoundedOutline = true,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isDisplayEmpty = (val) => !val || val.trim() === '';

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                    {Icon && <Icon size={14} className="text-gray-400" />}
                </div>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-sm font-normal transition-all 
                    ${disabled
                        ? `bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed ${showRoundedOutline ? 'rounded-md' : ''}`
                        : `text-gray-800 active:scale-[0.98] ${showRoundedOutline
                            ? `bg-white border border-gray-300 rounded-md hover:border-gray-400 ${isOpen ? 'ring-2 ring-blue-100 border-blue-400' : ''}`
                            : `bg-transparent hover:bg-gray-100 rounded-md ${isOpen ? 'bg-gray-100' : ''}`
                        }`
                    }`}
            >
                <span className="truncate">{isDisplayEmpty(value) ? placeholder : value}</span>
                {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-2 py-1 text-sm transition-colors hover:bg-gray-50 ${value === option ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600'}`}
                            >
                                {isDisplayEmpty(option) ? placeholder : option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {description && (
                <div className="text-[11px] text-gray-400 mt-1.5 px-1">
                    {description}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
