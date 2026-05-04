import { useEffect } from "react";
import { useSheetStore } from "../store/sheetStore";

const Tabs = ({ tabs, onTabSelect }) => {
    const { activeTabIndex, setActiveTabIndex } = useSheetStore()
    const safeActiveTabIndex = tabs.length > 0 ? Math.min(activeTabIndex, tabs.length - 1) : 0;

    useEffect(() => {
        if (tabs.length > 0 && safeActiveTabIndex !== activeTabIndex) {
            setActiveTabIndex(safeActiveTabIndex);
        }
    }, [activeTabIndex, safeActiveTabIndex, setActiveTabIndex, tabs.length]);

    if (tabs.length === 0) {
        return null;
    }

    return (
        <div className="tabs">
            {/* Headers */}
            
            <div className="tab-buttons" style={{top: 0}}>
                <div style={{height: '70px', width: '100%'}}></div>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onTabSelect?.(index);
                            setActiveTabIndex(index);
                        }}
                        style={{ marginLeft: index === 0 ? '20px' : '' }}
                        className={safeActiveTabIndex === index ? "active" : ""}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="tab-content">
                {tabs[safeActiveTabIndex].content}
            </div>
        </div>
    );
};

export default Tabs;
