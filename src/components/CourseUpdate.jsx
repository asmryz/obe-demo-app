import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import Dropdown from './Dropdown';

const CourseUpdate = ({ course, onCancel }) => {
    const updateCourse = useStore((state) => state.updateCourse);
    const programs = useStore((state) => state.programs) || [];
    const getProgram = useStore((state) => state.getProgram);

    const [code, setCode] = useState(course?.code || '');
    const [title, setTitle] = useState(course?.title || '');
    const [theory, setTheory] = useState(course?.theory ?? 0);
    const [lab, setLab] = useState(course?.lab ?? 0);
    const [prgid, setPrgid] = useState(course?.prgid || 2);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch programs if not already loaded in the store
    const programsLength = programs.length;
    useEffect(() => {
        if (programsLength === 0) {
            getProgram();
        }
    }, [programsLength, getProgram]);

    const programOptions = programs.map((p) => p.program);
    const currentProgramName = programs.find((p) => p.prgid === prgid)?.program || '';

    const handleProgramChange = (programName) => {
        const selectedProg = programs.find((p) => p.program === programName);
        if (selectedProg) {
            setPrgid(selectedProg.prgid);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Course code is required');
            return;
        }
        if (!title.trim()) {
            setError('Course title is required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await updateCourse(course.cid, {
                code: code.trim(),
                title: title.trim(),
                theory: Number(theory),
                lab: Number(lab),
                prgid: Number(prgid),
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
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. CSC-101"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800 placeholder-gray-400 transition-shadow"
                            disabled={loading || success}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                            Course Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Software Engineering"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800 placeholder-gray-400 transition-shadow"
                            disabled={loading || success}
                            required
                        />
                    </div>
                </div>

                {/* Program Dropdown */}
                {programs.length > 0 && (
                    <Dropdown
                        label="Program Allocation"
                        options={programOptions}
                        value={currentProgramName}
                        onChange={handleProgramChange}
                        description="Select the academic program this course belongs to"
                    />
                )}

                <hr className="border-gray-200" />

                {/* Sliders */}
                <div className="space-y-5">
                    {/* Theory Credits */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-800">Theory Credits</label>
                            <input
                                type="number"
                                value={theory}
                                onChange={(e) =>
                                    setTheory(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))
                                }
                                className="w-14 text-right border border-gray-300 rounded p-1 text-sm bg-gray-50 font-medium text-gray-800"
                                min="0"
                                max="4"
                                disabled={loading || success}
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            step="1"
                            value={theory}
                            onChange={(e) => setTheory(parseInt(e.target.value) || 0)}
                            className="w-full accent-blue-600 cursor-pointer"
                            disabled={loading || success}
                        />
                    </div>

                    {/* Lab Credits */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-800">Lab Credits</label>
                            <input
                                type="number"
                                value={lab}
                                onChange={(e) =>
                                    setLab(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))
                                }
                                className="w-14 text-right border border-gray-300 rounded p-1 text-sm bg-gray-50 font-medium text-gray-800"
                                min="0"
                                max="4"
                                disabled={loading || success}
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            step="1"
                            value={lab}
                            onChange={(e) => setLab(parseInt(e.target.value) || 0)}
                            className="w-full accent-blue-600 cursor-pointer"
                            disabled={loading || success}
                        />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Total Credits Info Card */}
                <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-sm">
                    <span className="font-semibold text-blue-900">Total Course Credits</span>
                    <span className="font-bold text-blue-600 text-lg">{theory + lab}</span>
                </div>
            </div>

            {/* Form Action Buttons */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || success}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2 outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
