export const TabButtons = ({ tabs, activeIndex, setActiveIndex }) => (
  <div className="tab-buttons">
    {tabs.map((tab, index) => (
      <button
        key={index}
        className={activeIndex === index ? "active" : ""}
        onClick={() => setActiveIndex(index)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const TabContent = ({ tabs, activeIndex }) => (
  <div className="tab-content">
    {tabs[activeIndex].content}
  </div>
);