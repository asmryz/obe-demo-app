import { ChevronRight, ChevronLeft } from 'lucide-react';
import RightPanelComponent from './RightPanelComponent';
import CourseUpdate from './CourseUpdate';

const RightSettingsPanel = ({ isOpen, onToggle, args = {} }) => {
    return (
        <div className={`absolute right-0 top-0 h-full transition-all duration-300 z-40 ${isOpen ? 'w-md border-l border-gray-200 shadow-xl' : 'w-0 border-none'}`}>
            {/* Tiny Sticky Toggle Button */}
            {Object.entries(args).length === 0 &&
                <div className="absolute top-4 -left-3.5 z-30">
                    <button
                        onClick={onToggle}
                        className="p-0 rounded-l-md bg-white border border-r-0 border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm transition-all duration-200 flex items-center justify-center h-6 active:scale-90"
                        title={isOpen ? "Hide settings" : "Show settings"}
                    >
                        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            }
            <div className={`w-md h-full bg-white flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="font-semibold text-gray-800">
                        {args?.course ? 'Update Course Details' : 'OBE Run Settings'}
                    </span>
                    <button
                        onClick={onToggle}
                        className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer outline-none"
                        title="Close drawer"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {args?.course ? (
                    <CourseUpdate key={`${args.course.cid}-${isOpen}`} course={args.course} onCancel={onToggle} />
                ) : (
                    <RightPanelComponent />
                )}
            </div>
        </div>
    );
};

export default RightSettingsPanel;
