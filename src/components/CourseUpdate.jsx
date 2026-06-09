import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import Dropdown from './Dropdown';

const CourseUpdate = ({ course, onCancel }) => {
    const updateCourse = useStore((state) => state.updateCourse);
    const programs = useStore((state) => state.programs) || [];
    const getProgram = useStore((state) => state.getProgram);

    // const [code, setCode] = useState(course?.code || '');
    // const [title, setTitle] = useState(course?.title || '');
    // const [theory, setTheory] = useState(course?.theory ?? 0);
    // const [lab, setLab] = useState(course?.lab ?? 0);
    // const [prgid, setPrgid] = useState(course?.prgid || 2);

    const [selectedCourse, setSelectedCourse] = useState({
        ...course,
        code: course?.code || '',
        title: course?.title || '',
        theory: course?.theory ?? 0,
        lab: course?.lab ?? 0,
        prgid: course?.prgid || 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Sync state with course prop when it changes
    useEffect(() => {
        setSelectedCourse({
            ...course,
            code: course?.code || '',
            title: course?.title || '',
            theory: course?.theory ?? 0,
            lab: course?.lab ?? 0,
            prgid: course?.prgid || 0
        });
        setSuccess(false);
        setLoading(false);
        setError('');
    }, [course]);

    console.log(selectedCourse)

    // Fetch programs if not already loaded in the store
    const programsLength = programs.length;
    useEffect(() => {
        if (programsLength === 0) {
            getProgram();
        }
    }, [programsLength, getProgram]);

    const programOptions = programs.map((p) => p.program);
    const currentProgramName = programs.find((p) => p.prgid === selectedCourse.prgid)?.program || '';

    const handleProgramChange = (programName) => {
        const selectedProg = programs.find((p) => p.program === programName);
        if (selectedProg) {
            setSelectedCourse({ ...selectedCourse, prgid: selectedProg.prgid });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedCourse.code.trim()) {
            setError('Course code is required');
            return;
        }
        if (!selectedCourse.title.trim()) {
            setError('Course title is required');
            return;
        }

        setLoading(true);
        setError('');
        // setSuccess(false);

        try {
            await updateCourse(selectedCourse.cid, {
                code: selectedCourse.code.trim(),
                title: selectedCourse.title.trim(),
                theory: Number(selectedCourse.theory),
                lab: Number(selectedCourse.lab),
                prgid: Number(selectedCourse.prgid),
            });
            setSuccess(true);
            // Hide success state and close panel after a brief moment
            setTimeout(() => {
                onCancel();
            }, 1200);
        } catch (err) {
            console.error('Failed to update course:', err);
            setError(err.response?.data?.error || 'Failed to update course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="flex-1 flex flex-col h-full overflow-hidden text-left bg-white">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-left space-y-6">
                {/* Status Banners */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-800 text-sm font-medium animate-in fade-in duration-200">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <span className="flex-1">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2.5 text-green-800 text-sm font-medium animate-in fade-in duration-200">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        <span>Course details updated successfully!</span>
                    </div>
                )}

                {/* Course ID Indicator */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-gray-700 text-xs font-semibold">
                    <span>Course Identity</span>
                    <span className="bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded-full font-mono text-[10px]">
                        ID #{course?.cid}
                    </span>
                </div>

                {/* Course Code & Title Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                            Course Code
                        </label>
                        <input
                            type="text"
                            value={selectedCourse.code}
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, code: e.target.value })}
                            placeholder="e.g. CSC-101"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800 placeholder-gray-400 transition-shadow"
                            disabled={loading || success}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                            Course Title
                        </label>
                        <textarea
                            type="text"
                            name='title'
                            value={selectedCourse.title}
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                            placeholder="e.g. Software Engineering"
                            rows={2}
                            cols={30}
                            style={{ backgroundColor: 'white' }}
                            className="w-full border border-gray-300 bg-white rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400 transition-shadow"
                            // disabled={loading || success}
                            required
                        />
                    </div>
                </div>





                {/* Credits Input Fields */}
                <div className="space-y-4">
                    {/* Theory Credits */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                            Theory Credits
                        </label>
                        <input
                            type="number"
                            value={selectedCourse.theory}
                            onChange={(e) =>
                                setSelectedCourse({ ...selectedCourse, theory: Math.max(0, Math.min(4, parseInt(e.target.value) || 0)) })
                            }
                            placeholder="0"
                            className="w-full border border-gray-300 bg-white rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400 transition-shadow"
                            min="0"
                            max="3"
                            disabled={loading || success}
                            required
                        />
                    </div>

                    {/* Lab Credits */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                            Lab Credits
                        </label>
                        <input
                            type="number"
                            value={selectedCourse.lab}
                            onChange={(e) =>
                                setSelectedCourse({ ...selectedCourse, lab: Math.max(0, Math.min(4, parseInt(e.target.value) || 0)) })
                            }
                            placeholder="0"
                            className="w-full border border-gray-300 bg-white rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400 transition-shadow"
                            min="0"
                            max="1"
                            disabled={loading || success}
                            required
                        />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Program Dropdown */}
                {programs.length > 0 && (
                    <Dropdown
                        label="Program Allocation"
                        options={programOptions}
                        value={currentProgramName}
                        onChange={handleProgramChange}
                        description="Select the academic program this course belongs to"
                        disabled={true}
                    />
                )}

                <hr className="border-gray-200" />

                {/* Total Credits Info Card */}
                <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-sm">
                    <span className="font-semibold text-blue-900">Total Course Credits</span>
                    <span className="font-bold text-blue-600 text-lg">{selectedCourse.theory + selectedCourse.lab}</span>
                </div>
            </div>

            {/* Form Action Buttons */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md cursor-pointer transition-colors outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || success}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors flex items-center gap-2 outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || success}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CourseUpdate;
