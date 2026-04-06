import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabs">
      {/* Headers */}
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={activeIndex === index ? "active" : ""}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;