import React from 'react';

/**
 * A reusable Tabs component with a smooth sliding indicator.
 * 
 * @param {Object} props
 * @param {string[]} props.tabs - Array of tab names
 * @param {string} props.activeTab - Currently active tab name
 * @param {function} props.onTabChange - Callback when a tab is clicked
 * @param {string} [props.className] - Optional extra classes for the container
 */
const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const activeIndex = tabs.indexOf(activeTab);
  const tabCount = tabs.length;

  return (
    <div className={`flex bg-gray-100/80 p-1 rounded-lg relative min-w-[200px] ${className}`}>
      {/* Sliding Indicator */}
      {activeIndex !== -1 && (
        <div
          className="absolute h-[calc(100%-8px)] top-1 bg-white shadow-sm rounded-md transition-all duration-300 ease-out"
          style={{
            width: `calc((100% - ${(tabCount + 1) * 4}px) / ${tabCount})`,
            left: `calc(4px + ${activeIndex} * (100% - 4px) / ${tabCount})`,
          }}
        />
      )}
      
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
