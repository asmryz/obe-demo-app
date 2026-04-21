import './CRRComponent.css'
import logo from '../assets/logo.jpg'
import { useSheetStore } from '../store/sheetStore'
import { useState } from 'react'


function CRRComponent() {
    const { gradeChart, recap, groupedPlanTotals } = useSheetStore()
    const [reason, setReason] = useState('')
    console.log(gradeChart)
    console.log(recap)
    console.log(groupedPlanTotals)
    // gradeChart['D+'] = 0;
    // gradeChart['D'] = 0;
    // gradeChart['D-'] = 0;

    // Pluralize a word, excluding certain exceptions
    function toPlural(word) {
        if (!word) return '';
        const exceptions = ['Final', 'Mid Term', 'Project'];
        if (exceptions.includes(word)) return word;
        // Basic rules for English plurals
        if (word.endsWith('y') && !/[aeiou]y$/i.test(word)) {
            return word.slice(0, -1) + 'ies';
        }
        if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
            return word + 'es';
        }
        return word + 's';
    }
    return (
        <section className="crr-page inl-1">
            <div className="WordSection1">
                <table
                    className="MsoNormalTable inl-2"
                    border="0"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-3">
                            <td width="100%" colSpan="6" valign="top" className="inl-4"
                                style={{ borderTopColor: 'white', borderLeftColor: 'white', borderRightColor: 'white', }}>
                                <img
                                    width="635"
                                    height="95"
                                    id="Picture 4"
                                    src={logo}
                                    alt="Description: SZABIST Logo"
                                    className="inl-5" /><br />
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-8"
                                    >Faculty Course Review Report</span
                                        ></b
                                    >
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-9"
                                    >(To be filled by each faculty at the time of Course
                                            Completion)</span
                                        ></b
                                    >
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-11">
                            <td width="23%" valign="top" className="inl-12">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Department</span>
                                </p>
                            </td>
                            <td width="33%" colSpan="2" valign="top" className="inl-13">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Mechatronics</span>
                                </p>
                            </td>
                            <td width="11%" valign="top" className="inl-14">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Faculty</span>
                                </p>
                            </td>
                            <td width="31%" colSpan="2" valign="top" className="inl-15">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >Computing &amp; Engineering Sciences</span
                                    >
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-16">
                            <td width="23%" valign="top" className="inl-17">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Course Code</span>
                                </p>
                            </td>
                            <td width="14%" valign="top" className="inl-18">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">{recap.course.split(' ')[0]}</span>
                                </p>
                            </td>
                            <td width="18%" valign="top" className="inl-19">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Title</span>
                                </p>
                            </td>
                            <td width="43%" colSpan="3" valign="top" className="inl-20">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">{recap.course.split(' ').splice(1, 2).join(' ')}</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-21">
                            <td width="23%" valign="top" className="inl-22">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Session</span>
                                </p>
                            </td>
                            <td width="14%" valign="top" className="inl-23">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">{recap.year}</span>
                                </p>
                            </td>
                            <td width="18%" valign="top" className="inl-24">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Semester</span>
                                </p>
                            </td>
                            {["Fall", "Spring", "Summer"].map((sem, index) => (
                                <td key={index} width="11%" valign="top" className="inl-25">
                                    <p className="MsoNormal" style={{ paddingTop: '5px' }}>
                                        <span lang="EN-US" className="inl-10">{sem}</span>
                                        {recap.semester === sem && (
                                            <span lang="EN-US" className="inl-26" style={{ Top: '45px', fontSize: '18pt' }}>&#10003;</span>
                                        )}
                                    </p>
                                </td>
                            ))}
                            {/* <td width="15%" valign="top" className="inl-28">
                                <p className="MsoNormal" style={{ paddingTop: '5px' }}>
                                    <span lang="EN-US" className="inl-10">Spring</span>
                                </p>
                            </td>
                            <td width="16%" valign="top" className="inl-29">
                                <p className="MsoNormal" style={{ paddingTop: '5px' }}>
                                    <span lang="EN-US" className="inl-10">Summer</span>
                                </p>
                            </td>*/}
                        </tr>
                        <tr className="inl-30">
                            <td width="23%" valign="top" className="inl-31">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Credit Value</span>
                                </p>
                            </td>
                            <td width="14%" valign="top" className="inl-32">
                                <p className="MsoNormal"><span lang="EN-US" className="inl-10">{recap.course.split(' ').splice(recap.course.split(' ').length - 2, 2)[0][1]}</span></p>
                            </td>
                            <td width="18%" valign="top" className="inl-33">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Level</span>
                                </p>
                            </td>
                            <td width="11%" valign="top" className="inl-34">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    ><br className="inl-35" />
                                        <br className="inl-27" />
                                    </span>
                                </p>
                            </td>
                            <td width="15%" valign="top" className="inl-36">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Prerequisites</span>
                                </p>
                            </td>
                            <td width="16%" valign="top" className="inl-37">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10" style={{ color: 'red' }}
                                    >ME1203-T Engineering Physics</span
                                    >
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-38">
                            <td width="23%" rowSpan="2" valign="top" className="inl-39">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Name of Course Instructor</span>
                                </p>
                            </td>
                            <td width="14%" rowSpan="2" valign="top" className="inl-40">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">{recap.faculty}</span>
                                </p>
                            </td>
                            <td width="18%" valign="top" className="inl-41">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">No. of Students </span>
                                </p>
                            </td>
                            <td width="43%" colSpan="3" valign="top" className="inl-42">
                                <p className="MsoNormal"><span lang="EN-US" className="inl-10">{recap.data.length - 2}</span></p>
                            </td>
                        </tr>
                        <tr className="inl-43">
                            <td width="18%" valign="top" className="inl-44">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >Total Number of Contact Hours</span
                                    >
                                </p>
                            </td>
                            <td width="43%" colSpan="3" valign="top" className="inl-45">
                                <p className="MsoNormal"><span lang="EN-US" className="inl-10">{Number(recap.course.split(' ').splice(recap.course.split(' ').length - 2, 2)[0][1]) * 16}</span></p>
                            </td>
                        </tr>
                        <tr className="inl-46">
                            <td width="38%" colSpan="2" valign="top" className="inl-47">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Assessment Methods:<br /> </span
                                    ><span lang="EN-US" className="inl-48"
                                    >give precise details (no &amp; length of assignments, exams,
                                        weightings etc.)</span
                                    ><span lang="EN-US" className="inl-10"></span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                            </td>
                            <td width="61%" colSpan="4" valign="top" className="inl-49">
                                {groupedPlanTotals &&
                                    Object.entries(groupedPlanTotals).sort((a, b) => b[1] - a[1])
                                        .map(([key, value], index) => (
                                            <p className="MsoNormal" key={index}>
                                                <span lang="EN-US" className="inl-10">{toPlural(key)} {value}%</span>
                                            </p>
                                        ))}
                                {/* <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Quizzes 30%</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Assignments 10%</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Midterm 20%</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Final 40%</span>
                                </p> */}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal inl-50">
                    <br clear="ALL" className="inl-52" />
                    <b className="inl-7"
                    ><span lang="EN-US" style={{ color: 'black' }}>Course Result</span></b
                    ><span lang="EN-US" className="inl-54"></span>
                </p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-56">
                            <td width="20%" className="inl-57">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">&nbsp;</span>
                                </p>
                            </td>
                            {gradeChart && Object.entries(gradeChart).map(([key], index) => (
                                <td key={index} width="5%" className="inl-59">
                                    <p className="MsoNormal inl-6" align="center">
                                        <span lang="EN-US" className="inl-58">{key}</span>
                                    </p>
                                </td>
                            ))}
                            {/* <td width="5%" className="inl-59">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">A+</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-60">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">A</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-61">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">A-</span>
                                </p>
                            </td>
                            <td width="5%" className="inl-62">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">B+</span>
                                </p>
                            </td>
                            <td width="3%" className="inl-63">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">B</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-64">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">B-</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-65">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">C+</span>
                                </p>
                            </td>
                            <td width="3%" className="inl-67">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">C</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-68">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">C-</span>
                                </p>
                            </td>
                            <td width="5%" className="inl-59">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">D+</span>
                                </p>
                            </td>
                            <td width="3%" className="inl-69">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">D</span>
                                </p>
                            </td>
                            <td width="6%" className="inl-70">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-66">D-</span>
                                </p>
                            </td>
                            <td width="6%" className="inl-70">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">F</span>
                                </p>
                            </td> */}
                            <td width="7%" className="inl-71">
                                <p className="MsoNormal inl-72" align="center">
                                    <span lang="EN-US" className="inl-58">W</span
                                    ><span lang="EN-US" className="inl-10">*</span
                                    ><span lang="EN-US" className="inl-73"></span>
                                </p>
                            </td>
                            <td width="7%" className="inl-74">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">Total</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-75">
                            <td width="20%" className="inl-76">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-77">Number of Students</span>
                                </p>
                            </td>
                            {gradeChart && Object.entries(gradeChart).map(([, value], index) => (
                                <td key={index} width="5%" className="inl-59">
                                    <p className="MsoNormal inl-6" align="center">
                                        <span lang="EN-US" className="inl-58">{value}</span>
                                    </p>
                                </td>
                            ))}
                            {/* <td width="5%" className="inl-78">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">2</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-79">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">1</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-80">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">4</span>
                                </p>
                            </td>
                            <td width="5%" className="inl-81">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">1</span>
                                </p>
                            </td>
                            <td width="3%" className="inl-82">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">2</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-83">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-84">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">1</span>
                                </p>
                            </td>
                            <td width="3%" className="inl-85">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">2</span>
                                </p>
                            </td>
                            <td width="4%" className="inl-86">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">3</span>
                                </p>
                            </td>
                            <td width="5%" className="inl-78">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0</span>
                                </p>
                            </td> */}
                            {/* <td width="3%" className="inl-87">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0</span>
                                </p>
                            </td>
                            <td width="6%" className="inl-88">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0</span>
                                </p>
                            </td>
                            <td width="6%" className="inl-88">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">1</span>
                                </p>
                            </td>*/}
                            <td width="7%" className="inl-89">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0</span>
                                </p>
                            </td>
                            <td width="7%" className="inl-90">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">{recap.data.length - 2}</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-91">
                            <td width="20%" className="inl-92">
                                <p className="MsoNormal" valign="top">
                                    <span lang="EN-US" className="inl-77"
                                    >Reason(s) if F's percentage is more than 25</span
                                    >
                                </p>
                            </td>
                            <td width="79%" colSpan="15" valign="top" className="inl-93">
                                <p className="MsoNormal inl-94" align="center">
                                    <span lang="EN-US" className="inl-58">
                                        {/* editable on screen */}
                                        <textarea name="reason" value={reason} onChange={e => setReason(e.target.value)} />
                                        {/* visible only when printing */}
                                        <div className="print-text">{reason}</div>
                                    </span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal inl-95">
                    <span lang="EN-US" className="inl-10">
                        * Either withdrew from course or didn't appear in Final Exam
                    </span>
                </p>
                <p className="MsoNormal inl-96">
                    <b className="inl-97">
                        <span lang="EN-US" className="inl-54">
                            &nbsp;</span>

                    </b>
                </p>
                <p className="MsoNormal inl-96">
                    <b className="inl-97"
                    ><u
                    ><span lang="EN-US" className="inl-54"
                    >Instructor Comments on CLO attainment</span
                            ></u
                        ></b
                    >
                </p>
                <p className="MsoNormal inl-99">
                    <span lang="EN-US" className="inl-10"
                    >The course has three CLOs, the threshold (KPI) set by the department
                        for CLO attainment at individual level is 50 %, whereas KPI for cohort
                        level is 60% i.e. 60% of the students should be able to attain defined
                        CLOs. It was observed that all three CLOs have been attained<b
                            className="inl-7"
                        >. </b
                        >Following table summarizes CLO attainment at cohort level.</span
                    >

                </p>
                <p className="MsoNormal inl-99">
                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                </p>
                {/* Page break for printing */}
                <div style={{ pageBreakAfter: 'always' }} />

                <table
                    className="MsoNormalTable inl-100"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-101">
                            <td width="32%" valign="top" className="inl-102">
                                <p className="MsoNormal inl-103">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-10"
                                    >Course Learning Outcome: Learning Domain - Level</span
                                        ></b
                                    >
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-104">
                                <p className="MsoNormal inl-105" align="center">
                                    <b className="inl-106"
                                    ><span lang="EN-US" className="inl-10"
                                    >Percentage of students attained CLO</span
                                        ></b
                                    >
                                </p>
                            </td>
                            <td width="13%" valign="top" className="inl-107">
                                <p className="MsoNormal inl-108" align="center">
                                    <b className="inl-106"
                                    ><span lang="EN-US" className="inl-10">KPI</span></b
                                    >
                                </p>
                            </td>
                            <td width="24%" valign="top" className="inl-109">
                                <p className="MsoNormal inl-108" align="center">
                                    <b className="inl-106"
                                    ><span lang="EN-US" className="inl-10">Remarks</span></b
                                    >
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-110">
                            <td width="32%" valign="top" className="inl-111">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">CLO 1 : C - 2</span>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-112">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">100%</span>
                                </p>
                            </td>
                            <td width="13%" valign="top" className="inl-113">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">60</span>
                                </p>
                            </td>
                            <td width="24%" valign="top" className="inl-114">
                                <p className="MsoNormal inl-103">
                                    <span lang="EN-US" className="inl-10">CLO 1 attained.</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-115">
                            <td width="32%" valign="top" className="inl-111">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">CLO 2 : C - 3</span>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-112">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">70.59%</span>
                                </p>
                            </td>
                            <td width="13%" valign="top" className="inl-113">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">60</span>
                                </p>
                            </td>
                            <td width="24%" valign="top" className="inl-114">
                                <p className="MsoNormal inl-103">
                                    <span lang="EN-US" className="inl-10">CLO 2 attained.</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-116">
                            <td width="32%" valign="top" className="inl-111">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">CLO 3 : C - 4</span>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-112">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">100%</span>
                                </p>
                            </td>
                            <td width="13%" valign="top" className="inl-113">
                                <p className="MsoNormal inl-105" align="center">
                                    <span lang="EN-US" className="inl-10">60</span>
                                </p>
                            </td>
                            <td width="24%" valign="top" className="inl-114">
                                <p className="MsoNormal inl-103">
                                    <span lang="EN-US" className="inl-10">CLO 3 attained.</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="MsoNormal">&nbsp;</div>
                <p className="MsoNormal inl-50">
                    <b className="inl-7"
                    ><u
                    ><span lang="EN-US" className="inl-54"
                    >Instructor Comments on PLO attainment</span
                            ></u
                        ></b
                    >
                </p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-117">
                            <td width="26%" className="inl-118">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-119"
                                    >Number of PLOs offered</span
                                        ></b
                                    >
                                </p>
                            </td>
                            <td width="10%" className="inl-120">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">2</span>
                                </p>
                            </td>
                            <td width="27%" className="inl-121">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-119"
                                    >PLOs which are being offered</span
                                        ></b
                                    >
                                </p>
                            </td>
                            <td width="34%" className="inl-122">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-77"
                                    >PLO 1 (Engineering Knowledge), PLO 2 (Problem Analysis)</span
                                    >
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-123">
                            <td width="26%" className="inl-124">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58"
                                    >Percentage of students who have not achieved PLO 1 (CLO
                                        1)</span
                                    >
                                </p>
                            </td>
                            <td width="10%" className="inl-125">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">0.00%</span>
                                </p>
                            </td>
                            <td width="27%" className="inl-126">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">&nbsp;</span>
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58"
                                    >Reason(s) if this percentage is more than 50
                                    </span>
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">&nbsp;</span>
                                </p>
                            </td>
                            <td width="34%" className="inl-127">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">-</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-128">
                            <td width="26%" className="inl-129">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58"
                                    >Percentage of students who have not achieved PLO 2 (CLO2 &amp;
                                        CLO3)</span
                                    >
                                </p>
                            </td>
                            <td width="10%" className="inl-130">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">12.50%</span>
                                </p>
                            </td>
                            <td width="27%" className="inl-131">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">&nbsp;</span>
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58"
                                    >Reason(s) if this percentage is more than 50 (if
                                        applicable)</span
                                    >
                                </p>
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">&nbsp;</span>
                                </p>
                            </td>
                            <td width="34%" className="inl-132">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-58">-</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal inl-133" style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <span lang="EN-US" className="inl-10"
                    >It was observed that one student (listed below) was not able to
                        achieve PLO 2 whereas PLO 1 was achieved by all students. Program
                        Manager will forward this information to Departmental Quality
                        Assurance Committee (DQAC), so that his/her progress could be
                        monitored.<b className="inl-7"></b
                        ></span>
                </p>
                <table
                    className="MsoNormalTable inl-100"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-101">
                            <td width="10%" valign="top" className="inl-134">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-10">S. No.</span></b
                                    >
                                </p>
                            </td>
                            <td width="34%" valign="top" className="inl-135">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"><span lang="EN-US" className="inl-10">Name</span></b>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-136">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-10">Registration Number</span></b
                                    >
                                </p>
                            </td>
                            <td width="25%" valign="top" className="inl-137">
                                <p className="MsoNormal inl-6" align="center">
                                    <b className="inl-7"
                                    ><span lang="EN-US" className="inl-10">PLO not attained</span></b
                                    >
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-110">
                            <td width="10%" valign="top" className="inl-138">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-10">1</span>
                                </p>
                            </td>
                            <td width="34%" valign="top" className="inl-139">
                                <p className="MsoNormal">
                                    <span lang="EN-US">Muhammad Shayaan Khan</span>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-140">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US">2345121</span>
                                </p>
                            </td>
                            <td width="25%" valign="top" className="inl-141">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-10">PLO 2</span>
                                </p>
                            </td>
                        </tr>
                        <tr className="inl-142">
                            <td width="10%" valign="top" className="inl-143">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-10">2</span>
                                </p>
                            </td>
                            <td width="34%" valign="top" className="inl-144">
                                <p className="MsoNormal">
                                    <span lang="EN-US">Abdul Basit Hussain</span>
                                </p>
                            </td>
                            <td width="29%" valign="top" className="inl-145">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US">2345135</span>
                                </p>
                            </td>
                            <td width="25%" valign="top" className="inl-146">
                                <p className="MsoNormal inl-6" align="center">
                                    <span lang="EN-US" className="inl-10">PLO 2</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal">
                    <b className="inl-7"><span lang="EN-US">&nbsp;</span></b>
                </p>
                <p className="MsoNormal">
                    <b className="inl-7"
                    ><span lang="EN-US" className="inl-10"
                    >Overview/Evaluation (Course Co-Coordinator's Comments)</span
                        ></b
                    >
                </p>
                <p className="MsoNormal">
                    <span lang="EN-US" className="inl-10"
                    >Feedback: first summarize, then comment on feedback received
                        from:</span
                    >
                </p>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-101">
                            <td width="100%" valign="top" className="inl-147">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >1. Student (Course Evaluation) Questionnaires</span
                                    >
                                </p>
                                <p className="MsoNormal inl-148">
                                    <span lang="EN-US" className="inl-10"
                                    >Course evaluation's score by the students: 92.03%</span
                                    >
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">Suggestions: - N/A </span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-149">
                            <td width="100%" valign="top" className="inl-150">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >2.Moderators (if any)</span
                                    >
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">N/A</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-152">
                            <td width="100%" valign="top" className="inl-153">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >3. Curriculum: comment on the
                                        continuing appropriateness of the Course curriculum in relation
                                        to the intended learning outcomes (Course objectives) and its
                                        compliance with the HEC Approved / Revised National Curriculum
                                        Guidelines</span
                                    >
                                </p>
                                <p className="MsoNormal inl-148">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal inl-148">
                                    <span lang="EN-US" className="inl-10"
                                    >Course content in relation to the intended learning outcomes is
                                        well defined. Furthermore, curriculum is in line with HEC
                                        guidelines and international standards.</span
                                    >
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <div style={{ pageBreakAfter: 'always' }} />
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-154">
                            <td width="100%" valign="top" className="inl-155">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >4. Assessment: comment on the continuing effectiveness of
                                        method(s) of assessment in relation to the intended learning
                                        outcomes (Course objectives)</span
                                    >
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >Current assessments methods seem enough to gauge defined
                                        PLOs.</span
                                    >
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-156">
                            <td width="100%" valign="top" className="inl-147">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >5. Enhancement: comment on the
                                        implementation of changes proposed in earlier
                                    </span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >Faculty Course Review Reports (if any)</span
                                    >
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >The number of tutorial problems associated with CLO 2 (C-3) has
                                        been increased as proposed in earlier CRR.</span
                                    >
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-156">
                            <td width="100%" valign="top" className="inl-147">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10"
                                    >6. Outline any changes in the
                                        future delivery or structure of the Course that this
                                        semester/term's experience may prompt </span
                                    ><span lang="EN-US" className="inl-58"
                                    >to improve student's performance</span
                                    ><span lang="EN-US" className="inl-10"></span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">None </span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US" className="inl-10">&nbsp;</span></p>
                <table
                    className="MsoNormalTable inl-55"
                    border="1"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                >
                    <tbody>
                        <tr className="inl-156">
                            <td width="100%" valign="top" className="inl-147">
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <table
                                    className="MsoTableGrid inl-157"
                                    width="100%"
                                    cellSpacing="0"
                                    cellPadding="0"
                                >
                                    <tbody>
                                        <tr className="inl-101">
                                            <td width="57" valign="top" className="inl-158">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">Name:</span>
                                                </p>
                                            </td>
                                            <td width="350" valign="top" className="inl-159">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="51" valign="top" className="inl-160">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">Date:</span>
                                                </p>
                                            </td>
                                            <td width="150" valign="top" className="inl-161">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="inl-149">
                                            <td width="57" valign="top" className="inl-158">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="350" valign="top" className="inl-162">
                                                <p className="MsoNormal inl-6" align="center">
                                                    <i className="inl-163"
                                                    ><span lang="EN-US" className="inl-10"
                                                    >(Course Instructor)</span
                                                        ></i
                                                    ><span lang="EN-US" className="inl-10"></span>
                                                </p>
                                            </td>
                                            <td width="51" valign="top" className="inl-160">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="150" valign="top" className="inl-164">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <table
                                    className="MsoTableGrid inl-157"
                                    width="100%"
                                    cellSpacing="0"
                                    cellPadding="0"
                                >
                                    <tbody>
                                        <tr className="inl-101">
                                            <td width="57" valign="top" className="inl-158">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">Name:</span>
                                                </p>
                                            </td>
                                            <td width="350" valign="top" className="inl-159">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="51" valign="top" className="inl-160">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">Date:</span>
                                                </p>
                                            </td>
                                            <td width="150" valign="top" className="inl-161">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="inl-149">
                                            <td width="57" valign="top" className="inl-158">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="350" valign="top" className="inl-162">
                                                <p className="MsoNormal inl-6" align="center">
                                                    <i className="inl-163"
                                                    ><span lang="EN-US" className="inl-10"
                                                    >(Head of Department)</span
                                                        ></i
                                                    ><span lang="EN-US" className="inl-10"></span>
                                                </p>
                                            </td>
                                            <td width="51" valign="top" className="inl-160">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                            <td width="150" valign="top" className="inl-164">
                                                <p className="MsoNormal">
                                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                                <p className="MsoNormal">
                                    <span lang="EN-US" className="inl-10">&nbsp;</span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
            </div>
        </section>
    )
}

export default CRRComponent
