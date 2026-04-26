import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, tabs.length - 1);

  return (
    <div className="tabs">
      {/* Headers */}
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={safeActiveIndex === index ? "active" : ""}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content">
        {tabs[safeActiveIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
