import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../api";

const createUseStore = (store) => (selector, equals) =>
    useZustandStore(store, selector, equals);

const parseWithdraws = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
};

export const store = createStore()(
    persist(
        (set, get) => ({
            initialized: false,
            signedIn: false,
            recap: null,
            closheet: null,
            recaps: [],
            recapPgNo: { currentPage: 1, recapsPerPage: 10, selectedSemester: 'All', selectedYear: 'All', searchQuery: '' },

            // CLO Sheet, PLO, and Report states
            cloSid: null,
            programId: 2,
            program: {},
            programs: [],
            curriculums: [],
            gradeChart: {},
            groupedPlanTotals: {},
            calCLOs: [],
            aggPLOs: {},
            withdraws: [],
            report: {},
            courses: [],

            signIn: () => set({ signedIn: true }),
            signOut: () => set({ signedIn: false }),
            setRecaps: (recaps) => set({ recaps }),
            setRecap: (recap) => set({ recap }),
            setClosheet: (closheet) => set({ closheet }),

            // Setters for sheet states
            setCLOSid: (cloSid) => set({ cloSid }),
            setProgramId: (programId) => {
                set({ programId });
                get().getProgram(programId);
                get().getCurriculum(programId);
                get().getCourses(programId);
            },
            setGradeChart: (gradeChart) => set({ gradeChart }),
            setGroupedPlanTotals: (groupedPlanTotals) => set({ groupedPlanTotals }),
            setCalCLOs: (calCLOs) => set({ calCLOs }),
            setAggPLOs: (aggPLOs) => set({ aggPLOs }),
            setWithdraws: (withdraws) => set({ withdraws: parseWithdraws(withdraws) }),
            setReport: (report) => set({ report: report ?? {} }),
            setCourses: (courses) => set({ courses }),

            // CLO Summary calculation helper using withdraws
            cloSummary: (localCalCLOs = [], cloNumbers = []) => {
                const withdrawsList = get().withdraws || [];
                const withdrawsCount = withdrawsList.length;

                return Object.entries(
                    localCalCLOs.reduce((acc, cloObj) => {
                        cloNumbers.forEach((cloNo) => {
                            const cloKey = `CLO${cloNo}`;
                            if (!acc[cloKey]) {
                                acc[cloKey] = [0, 0];
                            }
                            if (cloObj[cloKey] === 1) {
                                acc[cloKey][0] += 1;
                            } else if (cloObj[cloKey] === 0) {
                                acc[cloKey][1] += 1;
                            }
                        });
                        return acc;
                    }, {})
                ).map(([cloKey, acc]) => [
                    cloKey,
                    [acc[0], Math.max(acc[1] - withdrawsCount, 0)],
                ]);
            },

            setRecapPgNo: (recapPgNoUpdate) => set((state) => ({
                recapPgNo: { ...(state.recapPgNo || { currentPage: 1, recapsPerPage: 10, selectedSemester: 'All', selectedYear: 'All', searchQuery: '' }), ...recapPgNoUpdate }
            })),
            getRecaps: (query = "") => {
                return api.get(`/api/recaps?q=${encodeURIComponent(query)}`).then(res => {
                    set({ recaps: res.data });
                    return res.data;
                });
            },
            getCLOSheet: (closid) => {
                return api.get(`/api/closheet/${closid}`).then(res => {
                    const data = res.data;
                    const parsedWithdraws = parseWithdraws(data?.withdraws);
                    const reportData = data?.report ?? {};
                    set({
                        closheet: data,
                        withdraws: parsedWithdraws,
                        report: reportData,
                        cloSid: closid
                    });
                    return data;
                });
            },
            getReport: (closid) => {
                return api.get(`/api/closheet/${closid}/report`).then(res => {
                    const reportData = res.data?.report ?? {};
                    set({ report: reportData });
                    return reportData;
                });
            },
            getProgram: (prgid) => {
                const targetId = prgid !== undefined ? prgid : get().programId;
                return api.get('/api/programs').then(res => {
                    const allPrograms = res.data;
                    const selectedProgram = allPrograms.find(p => p.prgid === targetId) || null;
                    set({
                        programs: allPrograms,
                        program: selectedProgram || {}
                    });
                    return allPrograms;
                });
            },
            getCurriculum: (prgid) => {
                const targetId = prgid !== undefined ? prgid : get().programId;
                if (targetId === null || targetId === undefined) return Promise.resolve([]);
                return api.get(`/api/curriculums?prgid=${targetId}`).then(res => {
                    set({ curriculums: res.data });
                    return res.data;
                });
            },
            getCourses: (prgid) => {
                const targetId = prgid !== undefined ? prgid : get().programId;
                if (targetId === null || targetId === undefined) return Promise.resolve([]);
                return api.get(`/api/courses?prgid=${targetId}`).then(res => {
                    set({ courses: res.data });
                    return res.data;
                });
            }
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            // We don't need partialize anymore because we aren't storing the promise in the state
        }
    )
);

export const useStore = createUseStore(store);
