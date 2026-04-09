--
-- PostgreSQL database dump
--

\restrict siW6iwvqrRy6OotLKndzTpuycQFDQsMZu6dFDhcuoq9O2SoAUHhhh8eE2hGZHYN

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\unrestrict siW6iwvqrRy6OotLKndzTpuycQFDQsMZu6dFDhcuoq9O2SoAUHhhh8eE2hGZHYN
\connect postgres
\restrict siW6iwvqrRy6OotLKndzTpuycQFDQsMZu6dFDhcuoq9O2SoAUHhhh8eE2hGZHYN

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clo (
    id integer NOT NULL,
    code character varying(512),
    title character varying(512),
    semester integer,
    clo character varying(512),
    statement character varying(512),
    domain character varying(512),
    taxonomy integer,
    plo integer,
    cid integer
);


ALTER TABLE public.clo OWNER TO postgres;

--
-- Name: clo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clo_id_seq OWNER TO postgres;

--
-- Name: clo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clo_id_seq OWNED BY public.clo.id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    cid integer NOT NULL,
    code character varying(512),
    title character varying(512),
    semester integer
);


ALTER TABLE public.course OWNER TO postgres;

--
-- Name: course_cid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_cid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_cid_seq OWNER TO postgres;

--
-- Name: course_cid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_cid_seq OWNED BY public.course.cid;


--
-- Name: clo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clo ALTER COLUMN id SET DEFAULT nextval('public.clo_id_seq'::regclass);


--
-- Name: course cid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course ALTER COLUMN cid SET DEFAULT nextval('public.course_cid_seq'::regclass);


--
-- Data for Name: clo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clo VALUES
	(1, 'ME4823', 'Engineering Management', 8, '1', 'Explain the role that the operations management function plays in business and how the operations function can play a strategic role in improving the competitiveness of the organization.', 'Cognitive', 2, 11, 51),
	(2, 'ME4823', 'Engineering Management', 8, '2', 'Explain how an organization can improve its processes and integrate its several functions through the best use of quality engineering.', 'Cognitive', 2, 7, 51),
	(3, 'ME4823', 'Engineering Management', 8, '3', 'Apply important strategies like total quality management,Six-Sigma,and Benchmarking into organizations', 'Cognitive', 3, 11, 51),
	(4, 'ME1101', 'Communication & Presentation Skills', 1, '1', 'Interpret words and sentences clearly and efficiently.', 'Cognitive', 2, 10, 1),
	(5, 'ME1101', 'Communication & Presentation Skills', 1, '2', 'Demonstrate written and oral presentation skills by preparing presentation materials / assignments', 'Cognitive', 3, 10, 1),
	(6, 'ME1101', 'Communication & Presentation Skills', 1, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 10, 1),
	(7, 'ME1111-T', 'Electric Ciruits', 1, '1', 'Interpret the concepts of electric current and voltage,and their interaction in different electric circuit configurations.', 'Cognitive', 2, 1, 7),
	(8, 'ME1111-T', 'Electric Ciruits', 1, '2', 'Apply the laws of electrical engineering to series,parallel,series-parallel and complex electric circuits.', 'Cognitive', 3, 2, 7),
	(9, 'ME1111-L', 'Electric Ciruits', 1, '1', 'Construct given open ended lab project', 'Psychomotor', 3, 3, 6),
	(10, 'ME1111-L', 'Electric Ciruits', 1, '2', 'Investigate the voltages and currents of a complete electronic circuit', 'Cognitive', 4, 3, 6),
	(11, 'ME1111-L', 'Electric Ciruits', 1, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 3, 6),
	(12, 'ME1111-L', 'Electric Ciruits', 1, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 6),
	(13, 'ME1111-L', 'Electric Ciruits', 1, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 6),
	(14, 'ME1111-L', 'Electric Ciruits', 1, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 6),
	(15, 'ME1109', 'Engineering Drawing-I', 1, '1', 'Describe drawing principles for adequate representation of engineering drawing models.', 'Cognitive', 2, 1, 4),
	(16, 'ME1109', 'Engineering Drawing-I', 1, '2', 'Apply principles of Engineering visualization and Projection theory for drafting purposes', 'Cognitive', 3, 10, 4),
	(17, 'ME1109', 'Engineering Drawing-I', 1, '3', 'Inspect parts to make an effective assembly drawing in order to communicate effectively.', 'Cognitive', 4, 10, 4),
	(18, 'ME1104', 'Engineering Mathematics-I', 1, '1', 'Classify the concept of limit / continuity / complex numbers / derivatives / the notions of definite and indefinite integration / techniques of integration', 'Cognitive', 2, 1, 2),
	(19, 'ME1104', 'Engineering Mathematics-I', 1, '2', 'Apply the derivatives to find extrema,calculate lengths of curves / area of regions / volume of solids and show the convergence of the series.', 'Cognitive', 3, 1, 2),
	(20, 'ME1106', 'Islamic Studies', 1, '1', 'Explain issues related to faith and religious life; fundamental human rights and relation with non-Muslims through discussion', 'Cognitive', 2, 6, 3),
	(21, 'ME1106', 'Islamic Studies', 1, '2', 'Explain knowledge of Islamic civilization and moral values', 'Cognitive', 2, 8, 3),
	(22, 'ME1116', 'Humnities', 1, '1', 'Classify architecture throughout time including designs and styles from periods. Analyze the relationship between religious beliefs and art in Ancient Egypt and Ancient Greece. Explain early Greek philosophers,the study of religion and philosophy and philosophy in the Middle Ages,Renaissance and the 20th Century.', 'Cognitive', 2, 6, 8),
	(23, 'ME1116', 'Humnities', 1, '2', 'Appraise the different time periods and techniques of British and American literature. Demonstrate understanding of the effect of the Renaissance and Reformation in Europe on society,religion,and the arts. Examine art and identify distinguishing elements representative of various time periods and styles,including Greek,neoclassical and modern.', 'Cognitive', 2, 8, 8),
	(24, 'ME1203-T', 'Engineering Physics', 1, '1', 'Define the basic terminologies related to applied physics.', 'Cognitive', 1, 1, 14),
	(25, 'ME1203-T', 'Engineering Physics', 1, '2', 'Interpret concepts related to Mechanics; Fluids; Heat; Optics and Electromagnetism', 'Cognitive', 2, 1, 14),
	(26, 'ME1203-T', 'Engineering Physics', 1, '3', 'Apply the key concepts of applied physics to solve engineering problems', 'Cognitive', 3, 2, 14),
	(27, 'ME1203-T', 'Engineering Physics', 1, '4', 'Communicate effectively solution to assigned problem individually', 'Affective', 2, 10, 14),
	(28, 'ME1203-L', 'Engineering Physics', 1, '1', 'Describe the basic principle of physics related to the apparatus and complete lab manual through experiment.', 'Cognitive', 2, 9, 13),
	(29, 'ME1203-L', 'Engineering Physics', 1, '2', 'Setup the apparatus to find the experimental values that can be related with theoretical values using modern physics apparatus', 'Psychomotor', 2, 9, 13),
	(30, 'ME1203-L', 'Engineering Physics', 1, '3', 'Communicate effectively by submitting lab reports on time', 'Affective', 2, 9, 13),
	(31, 'ME1203-L', 'Engineering Physics', 1, '4', 'Constructs semester project as per provided guidelines.', 'Psychomotor', 3, 3, 13),
	(32, 'ME1203-L', 'Engineering Physics', 1, '5', 'Prepares a project report to show the design and analysis involved in the project.', 'Cognitive', 3, 3, 13),
	(33, 'ME1203-L', 'Engineering Physics', 1, '6', 'Respond to viva questions related to the project', 'Affective', 2, 3, 13),
	(34, 'ME1209', 'Computer Programming', 1, '1', 'Interpret the basic concepts of procedural/structured programming', 'Cognitive', 2, 1, 18),
	(35, 'ME1209', 'Computer Programming', 1, '2', 'Communicate effectively in oral form.', 'Affective', 2, 1, 18),
	(36, 'ME1209', 'Computer Programming', 1, '3', 'Construct a Program i.e. a computer-based solution to a well-defined problem. This includes developing a general flow of logic,identifying the variables,conditional/iterative execution,fail conditions.', 'Cognitive', 3, 5, 18),
	(37, 'ME1209', 'Computer Programming', 1, '4', 'Investigate appropriate solution for assigned task.', 'Cognitive', 4, 12, 18),
	(38, 'ME1209', 'Computer Programming', 1, '5', 'Demonstrates the valuing attributes of a life-long learner for project selection and completion.', 'Affective', 3, 12, 18),
	(39, 'ME1201-T', 'Electronic Devices and Circuits', 2, '1', 'Describe the construction and operating characteristics of Semiconductor diodes and bipolar junction transistors', 'Cognitive', 2, 1, 10),
	(40, 'ME1201-T', 'Electronic Devices and Circuits', 2, '2', 'Solve diode and BJT based circuits.', 'Cognitive', 3, 2, 10),
	(41, 'ME1201-L', 'Electronic Devices and Circuits', 2, '1', 'Demonstrate the results of a complete electronic circuit system (project).', 'Cognitive', 3, 3, 9),
	(42, 'ME1201-L', 'Electronic Devices and Circuits', 2, '2', 'Construct the hardware of the assigned project.', 'Psychomotor', 3, 3, 9),
	(43, 'ME1201-L', 'Electronic Devices and Circuits', 2, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 3, 9),
	(44, 'ME1201-L', 'Electronic Devices and Circuits', 2, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 9),
	(45, 'ME1201-L', 'Electronic Devices and Circuits', 2, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 9),
	(46, 'ME1201-L', 'Electronic Devices and Circuits', 2, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 9),
	(47, 'ME1202', 'Engineering Mathematics – II: Linear Algebra & Ordinary Differential Equations', 2, '1', 'Explain the basic concepts of linear algebra,matrix algebra and vector algebra,linear/nonlinear,homogeneous/ non-homogeneous ODE.', 'Cognitive', 2, 1, 11),
	(48, 'ME1203', 'Engineering Mathematics – II: Linear Algebra & Ordinary Differential Equations', 2, '2', 'Solve problems of ODEs,Linear Algebra and related topics.', 'Cognitive', 3, 2, 12),
	(49, 'ME2306', 'Pakistan Studies', 2, '1', 'Define the ideology of Pakistan with reference to the basic values of Islam and the socio-cultural milieu of Muslims in the sub-continent', 'Cognitive', 1, 6, 24),
	(50, 'ME2306', 'Pakistan Studies', 2, '2', 'Describe the early problems with particular emphasis on economic,geopolitical,refugee,state,and administrative problems,constitutional reforms of 1956,1962,and 1973’s', 'Cognitive', 2, 6, 24),
	(51, 'ME2306', 'Pakistan Studies', 2, '3', 'Communicate the knowledge of topics relevant to geography,resources,and foreign policy of Pakistan which emphasizes progression and peaceful co-existence,and document their findings', 'Affective', 2, 6, 24),
	(52, 'ME1204', 'Engineering Statics', 2, '1', 'Interpret concepts of vectors and scalars,forces,moments and couples.', 'Cognitive', 2, 1, 15),
	(53, 'ME1204', 'Engineering Statics', 2, '2', 'Apply the learned concepts of forces,moments and couples to solve problems of equilibrium in 2-d and 3-d and problems of   friction', 'Cognitive', 3, 2, 15),
	(54, 'ME1204', 'Engineering Statics', 2, '3', 'Analyze structures such as plain trusses,frames and machines for reaction forces', 'Cognitive', 4, 2, 15),
	(55, 'ME1207', 'Engineering Workshop', 2, '1', 'Explain the working and classification of different tools and machines used in engineering workshop.', 'Cognitive', 2, 1, 16),
	(56, 'ME1207', 'Engineering Workshop', 2, '2', 'Construct parts/assemblies using carpentry,metal,foundry,welding,machine,robotics and electronics shops.', 'Psychomotor', 3, 1, 16),
	(57, 'ME1207', 'Engineering Workshop', 2, '3', 'Construct a wooden assembly to achieve the current theme of the workshop project and design a printed circuit boards (PCB) by a given schematics.', 'Psychomotor', 3, 4, 16),
	(58, 'ME1207', 'Engineering Workshop', 2, '4', 'Prepares a project report to show the design and analysis involved.', 'Cognitive', 3, 4, 16),
	(59, 'ME1207', 'Engineering Workshop', 2, '5', 'Participate responsibly to complete a task', 'Affective', 2, 9, 16),
	(60, 'ME1208', 'Materials and Manufacturing Processes', 2, '1', 'Interpret core concepts in materials science and manufacturing processes', 'Cognitive', 2, 1, 17),
	(61, 'ME1208', 'Materials and Manufacturing Processes', 2, '2', 'Illustrate the appropriate operation and its parameters for performing manufacturing processes', 'Cognitive', 3, 2, 17),
	(62, 'ME1208', 'Materials and Manufacturing Processes', 2, '3', 'Describe the environmental impacts of various materials and manufacturing processes.', 'Cognitive', 2, 7, 17),
	(63, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '1', 'Define basic terminologies of programming such as loops,classes,and functions.', 'Cognitive', 1, 1, 30),
	(64, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '2', 'Identify bugs and conclude the output of the program.', 'Cognitive', 2, 1, 30),
	(65, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '3', 'Implement concept of object-oriented programming to construct a given program.', 'Cognitive', 3, 5, 30),
	(66, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '4', 'Design an android app to achieve the proposed idea.', 'Cognitive', 6, 5, 30),
	(67, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '5', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 5, 30),
	(68, 'ME2312', 'Data Structures & Object Oriented Programming', 2, '6', 'Demonstrate ethical coding practices by avoiding plagiarism', 'Affective', 3, 8, 30),
	(69, 'ME1110', 'Teching Holuy Quran', 2, '1', 'Recite Holy Quran according to Tajweed principles,with translation of Ayat.', 'Cognitive', 1, 6, 5),
	(70, 'ME1110', 'Teching Holuy Quran', 2, '2', 'Define the principles of Ethics described in the Holy Quran', 'Cognitive', 1, 8, 5),
	(71, 'ME1211', 'Ideology and Constitution of Pakistan', 3, '1', 'Understand the significance of Pakistan''s ideology,national identity,historical context,culture,civilization,and foreign policy on both the national and international fronts in today''s globalized world.', 'Cognitive', 1, 6, 19),
	(72, 'ME1211', 'Ideology and Constitution of Pakistan', 3, '2', 'Describe the fundamental concerns,concepts,and regulations associated with the Constitution,the framework of government,and the political/administrative system in the nation.', 'Cognitive', 2, 6, 19),
	(73, 'ME1211', 'Ideology and Constitution of Pakistan', 3, '3', 'Communicate the knowledge of topics relevant to Pakistan''s geography,resources,and foreign policy,which emphasizes progression and peaceful co-existence,and document their findings.', 'Affective', 2, 6, 19),
	(116, 'ME2407-L', 'Actuating Systems', 4, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 36),
	(74, 'ME2302-T', 'Digital Logic Design', 3, '1', 'Describe:
i. The use of Boolean Algebra and K-maps in designing efficient combinational and sequential logic circuits
ii. The operation of logic gates,flip flops,memory,sequential circuits and programmable logic', 'Cognitive', 2, 1, 21),
	(75, 'ME2302-T', 'Digital Logic Design', 3, '2', 'Solve combinational circuits,sequential circuits and medium-scale integrated circuits (Decoders,MUX,etc.)', 'Cognitive', 3, 2, 21),
	(76, 'ME2302-T', 'Digital Logic Design', 3, '3', 'Design combinational and sequential logic circuits using Boolean Algebra and K-maps', 'Cognitive', 6, 2, 21),
	(77, 'ME2302-L', 'Digital Logic Design', 3, '1', 'Demonstrate an electronic circuit system using different logic gates,combinational and sequential circuits.', 'Cognitive', 3, 3, 20),
	(78, 'ME2302-L', 'Digital Logic Design', 3, '2', 'Construct the hardware of the assigned project.', 'Psychomotor', 3, 3, 20),
	(79, 'ME2302-L', 'Digital Logic Design', 3, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 3, 20),
	(80, 'ME2302-L', 'Digital Logic Design', 3, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 20),
	(81, 'ME2302-L', 'Digital Logic Design', 3, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 20),
	(82, 'ME2302-L', 'Digital Logic Design', 3, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 20),
	(83, 'ME2303', 'Engineering Dynamics', 3, '1', 'Interpret concepts of the kinematics and kinetics of a single particle and simple particle systems,to simple problems of engineering interest.', 'Cognitive', 2, 1, 22),
	(84, 'ME2303', 'Engineering Dynamics', 3, '2', 'Apply the concepts of the kinematics of planar motion and kinetics of rigid bodies in planar motion.', 'Cognitive', 3, 2, 22),
	(130, 'ME2406-L', 'Strength of Materials', 4, '6', 'Write weekly lab reports', 'Cognitive', 3, 2, 34),
	(85, 'ME2304', 'Engineering Mathematics – III: 3D Geometry & Vector Calculus', 3, '1', 'Classify problems involving the geometry of lines,curves,planes and surfaces in space.', 'Cognitive', 2, 1, 23),
	(86, 'ME2304', 'Engineering Mathematics – III: 3D Geometry & Vector Calculus', 3, '2', 'Solve vector functions using differentiation techniques and double / triple integrals by using appropriate theorems.', 'Cognitive', 3, 1, 23),
	(87, 'ME2311', 'Network Analysis', 3, '1', 'Describe the transient behavior of the first and second order passive circuits.', 'Cognitive', 2, 1, 29),
	(88, 'ME2311', 'Network Analysis', 3, '2', 'Apply sinusoidal-steady-state analysis of passive networks using the impedance method,including AC power analysis.', 'Cognitive', 3, 2, 29),
	(89, 'ME2311', 'Network Analysis', 3, '3', 'Use computer aid for passive networks.', 'Cognitive', 3, 5, 29),
	(90, 'ME2309', 'Eng. Drawing - II', 3, '1', 'Practice features of AUTOCAD in order to make orthographic,sectional and isometric views.', 'Cognitive', 3, 5, 27),
	(91, 'ME2309', 'Eng. Drawing - II', 3, '2', 'Prepare layouts that effectively communicate engineering drawing standards.', 'Cognitive', 3, 10, 27),
	(92, 'ME2309', 'Eng. Drawing - II', 3, '3', 'Inspect a 2D drawing in order to develop a 3D model or assembly and present as per standards.', 'Cognitive', 5, 10, 27),
	(93, 'ME2308-T', 'Fundamentals of Thermal Sciences', 3, '1', 'Describe the thermofluid properties,Distinguish different thermodynamic systems from a given scenario and explain the principles of heat transfer.', 'Cognitive', 2, 1, 26),
	(94, 'ME2308-T', 'Fundamentals of Thermal Sciences', 3, '2', 'Determine state characteristics for working fluids undergoing various processes,Solve the governing mathematical equations for conduction,convection and radiation heat transfer and Apply mass conservation,energy conservation and entropy balance relationships to thermodynamic problems related to closed and open systems.', 'Cognitive', 3, 2, 26),
	(95, 'ME2308-T', 'Fundamentals of Thermal Sciences', 3, '3', 'Analyze various thermodynamic cycles for reciprocating engines,power plants and refrigeration systems.', 'Cognitive', 4, 3, 26),
	(96, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '1', 'Interpret the different parameters related to experiments and relate the interactions of those parameters with engineering principles.', 'Cognitive', 2, 9, 25),
	(97, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '2', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 25),
	(98, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '3', 'Participate responsibly to complete a task', 'Affective', 2, 9, 25),
	(99, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '4', 'Construct hardware of open ended project for given constraints.', 'Psychomotor', 3, 3, 25),
	(100, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '5', 'Propose solution to the assigned open ended project for given constraints.', 'Cognitive', 6, 3, 25),
	(101, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3, '6', 'Demonstrate project management skills for project scheduling,execution and completion.', 'Affective', 3, 11, 25),
	(102, 'ME2401-T', 'Electronics Circuit Design', 4, '1', 'Explain the construction and operating characteristics of Field Effect Transistors (FETs) and Op-Amps.', 'Cognitive', 2, 1, 32),
	(103, 'ME2401-T', 'Electronics Circuit Design', 4, '2', 'Solve various FET,Op-Amp and BJT configurations.', 'Cognitive', 3, 2, 32),
	(104, 'ME2401-L', 'Electronics Circuit Design', 4, '1', 'Design a complete electronic circuit system using a top-down approach which starts from system specifications.', 'Cognitive', 6, 4, 31),
	(105, 'ME2401-L', 'Electronics Circuit Design', 4, '2', 'Construct the hardware of the assigned problem.', 'Psychomotor', 3, 4, 31),
	(106, 'ME2401-L', 'Electronics Circuit Design', 4, '3', 'Discuss the working of the project and represent the effective use of time and resources in the form of report.', 'Affective', 2, 10, 31),
	(107, 'ME2401-L', 'Electronics Circuit Design', 4, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 31),
	(108, 'ME2401-L', 'Electronics Circuit Design', 4, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 31),
	(109, 'ME2401-L', 'Electronics Circuit Design', 4, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 31),
	(110, 'ME2401-L', 'Electronics Circuit Design', 4, '7', 'Demonstrate project management skills for project scheduling,execution and completion.', 'Affective', 3, 11, 31),
	(111, 'ME2407-T', 'Actuating Systems', 4, '1', 'Explain principles of AC and DC motors and generators,and AC transformers,hydraulics and pneumatics actuators', 'Cognitive', 2, 1, 37),
	(112, 'ME2407-T', 'Actuating Systems', 4, '2', 'Calculate parameters and credentials of AC and DC machines', 'Cognitive', 3, 2, 37),
	(113, 'ME2407-L', 'Actuating Systems', 4, '1', 'Construct the hardware of the project using top-down approach.', 'Psychomotor', 3, 3, 36),
	(114, 'ME2407-L', 'Actuating Systems', 4, '2', 'Investigate electromechanical systems by following the defined constraints.', 'Cognitive', 4, 3, 36),
	(115, 'ME2407-L', 'Actuating Systems', 4, '3', 'Discuss the working of the project in the form of report and answers queries in form of viva.', 'Affective', 2, 3, 36),
	(117, 'ME2407-L', 'Actuating Systems', 4, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 36),
	(118, 'ME2407-L', 'Actuating Systems', 4, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 36),
	(119, 'ME2403', 'Engineering Mathematics – IV Transformation Techniques', 4, '1', 'Explain the types of signals,systems and their time and frequency domain descriptions', 'Cognitive', 2, 1, 33),
	(120, 'ME2403', 'Engineering Mathematics – IV Transformation Techniques', 4, '2', 'Calculate the time and frequency versions of signals and systems', 'Cognitive', 3, 2, 33),
	(121, 'ME2403', 'Engineering Mathematics – IV Transformation Techniques', 4, '3', 'Analyze the discrete systems using relevant software.', 'Cognitive', 4, 5, 33),
	(122, 'ME2406-T', 'Strength of Materials', 4, '1', 'Explain the concepts of stress,strain and mechanical properties of Engineering materials', 'Cognitive', 2, 1, 35),
	(123, 'ME2406-T', 'Strength of Materials', 4, '2', 'Calculate the stresses and deflections in structures and machine components subjected to different modes of loading.', 'Cognitive', 3, 2, 35),
	(124, 'ME2406-T', 'Strength of Materials', 4, '3', 'Analyze structures and machine components by applying principles of mechanics to achieve safe design.', 'Cognitive', 4, 2, 35),
	(125, 'ME2406-L', 'Strength of Materials', 4, '1', 'Construct project: fabrication of test specimens with provided dimensions to imitate stress analysis', 'Psychomotor', 3, 4, 34),
	(126, 'ME2406-L', 'Strength of Materials', 4, '2', 'Analyze trusses and measuring mechanical properties of structural materials.', 'Cognitive', 4, 4, 34),
	(127, 'ME2406-L', 'Strength of Materials', 4, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 10, 34),
	(128, 'ME2406-L', 'Strength of Materials', 4, '4', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 2, 34),
	(129, 'ME2406-L', 'Strength of Materials', 4, '5', 'Participate responsibly to complete a task', 'Affective', 2, 2, 34),
	(131, 'ME2411-T', 'Fluid Mechanics', 4, '1', 'Explain the basic concepts of fluid mechanics based on analytical relations and Describe the fluid properties', 'Cognitive', 2, 1, 40),
	(132, 'ME2411-T', 'Fluid Mechanics', 4, '2', 'Apply the basic concepts of fluid mechanics to solve problems related to hydrostatic fluids.', 'Cognitive', 3, 2, 40),
	(133, 'ME2411-T', 'Fluid Mechanics', 4, '3', 'Solve fluid flow problems employing continuity,momentum and energy equations using Reynold Transport Theorem (RTT)', 'Cognitive', 3, 3, 40),
	(134, 'ME2411-T', 'Fluid Mechanics', 4, '4', 'Differentiate between laminar and turbulent pipe flows,investigate losses in pipe systems and Analyze fluid flow problems using concepts of dimensional analysis and similitude.', 'Cognitive', 4, 3, 40),
	(135, 'ME2411-L', 'Fluid Mechanics', 4, '1', 'Investigate assigned problem for given constraints through literature review.', 'Cognitive', 4, 4, 39),
	(136, 'ME2411-L', 'Fluid Mechanics', 4, '2', 'Construct hardware of assigned problem.', 'Psychomotor', 3, 4, 39),
	(137, 'ME2411-L', 'Fluid Mechanics', 4, '3', 'Write weekly lab reports', 'Cognitive', 3, 9, 39),
	(138, 'ME2411-L', 'Fluid Mechanics', 4, '4', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 39),
	(139, 'ME2411-L', 'Fluid Mechanics', 4, '5', 'Participate responsibly to complete a task', 'Affective', 2, 9, 39),
	(140, 'ME3601', 'Solid Modeling', 4, '1', 'Apply engineering drawing standards and knowledge to develop 3D models and assemblies.', 'Cognitive', 3, 5, 50),
	(141, 'ME3601', 'Solid Modeling', 4, '2', 'Propose solution for specific engineering problems and Create a CAD design for the proposed solution.', 'Cognitive', 6, 4, 50),
	(142, 'ME3601', 'Solid Modeling', 4, '3', 'Demonstrates the valuing attributes of a life-long learner for project selection and completion.', 'Affective', 3, 12, 50),
	(143, 'ME3601', 'Solid Modeling', 4, '4', 'Use tool box components and mechanical mates of CAD Software.', 'Cognitive', 3, 12, 50),
	(144, 'ME3601', 'Solid Modeling', 4, '5', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 10, 50),
	(145, 'ME2310', 'Community Service', 4, '1', 'Discuss various areas of community service (as listed under the topics list) and of relevant ongoing philanthropic activities in the community', 'Affective', 2, 6, 28),
	(146, 'ME2310', 'Community Service', 4, '2', 'Demonstrate a sense of responsibility,compassion and empathy towards the community', 'Affective', 3, 8, 28),
	(147, 'ME2310', 'Community Service', 4, '3', 'Displays meaningful contribution to have a discernible impact on the community', 'Psychomotor', 3, 6, 28),
	(148, 'ME3501', 'Engineering Mathematics – V Numerical Methods', 5, '1', 'Classify the solution of an engineering problem as analytical or numerical', 'Cognitive', 2, 1, 41),
	(149, 'ME3501', 'Engineering Mathematics – V Numerical Methods', 5, '2', 'Solve linear and nonlinear equations,differential equations and boundary value problems.', 'Cognitive', 3, 2, 41),
	(150, 'ME3501', 'Engineering Mathematics – V Numerical Methods', 5, '3', 'Use computer tools to engineering problems using numerical methods', 'Cognitive', 3, 5, 41),
	(151, 'ME2408', 'Signals and Systems', 5, '1', 'Interpret mathematical description and representation of continuous and discrete time signals and systems', 'Cognitive', 2, 1, 38),
	(152, 'ME2408', 'Signals and Systems', 5, '2', 'Apply linear systems tools,especially transform analysis and convolution,to  predict  the behavior of linear systems', 'Cognitive', 3, 2, 38),
	(153, 'ME2408', 'Signals and Systems', 5, '3', 'Analyze linear systems and gain an appreciation for the importance of linear systems analysis in Mechatronics systems.', 'Cognitive', 4, 5, 38),
	(154, 'ME3508-T', 'Artificial Intelligence in Engineering', 5, '1', 'Apply techniques for computer-based representation and manipulation of complex information,knowledge,uncertainty,search problems,optimization,machine learning,neural networks and NLP', 'Cognitive', 3, 2, 46),
	(155, 'ME3508-T', 'Artificial Intelligence in Engineering', 5, '2', 'Explain ethical issues pertaining to the use of AI in society', 'Cognitive', 2, 8, 46),
	(156, 'ME3508-L', 'Artificial Intelligence in Engineering', 5, '1', 'Develop algorithms to solve problem related to Artificial Intelligence in Engineering.', 'Cognitive', 6, 5, 44),
	(157, 'ME3508-L', 'Artificial Intelligence in Engineering', 5, '2', 'Investigate appropriate solution for assigned task.', 'Cognitive', 4, 12, 44),
	(158, 'ME3508-L', 'Artificial Intelligence in Engineering', 5, '3', 'Demonstrates the valuing attributes of a life-long learner for project selection and completion.', 'Affective', 3, 12, 44),
	(159, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 5, '1', 'Explain the fundamentals of hardware and software of the microprocessor and microcontroller and the application of serial interface,timer and interrupt.', 'Cognitive', 2, 1, 49),
	(160, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 5, '2', 'Apply the capabilities of the 8051 Microcontroller/Arduino to execute a machine code program.', 'Cognitive', 3, 2, 49),
	(161, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 5, '3', 'Analyze the programming proficiency using the various addressing modes and data transfer instructions.', 'Cognitive', 4, 5, 49),
	(162, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '1', 'Interpret the concepts of programming and embedded systems used in engineering applications.', 'Cognitive', 2, 4, 48),
	(163, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '2', 'Construct an assigned team project by integrating mechanical,electronics and embedded control for the given theme.', 'Psychomotor', 3, 4, 48),
	(164, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 4, 48),
	(165, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '4', 'Use different techniques to develop algorithms on microcontrollers software to perform different tasks and note down the readings in the lab manual.', 'Cognitive', 3, 5, 48),
	(166, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 48),
	(167, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 48),
	(168, 'ME3508-T', 'Instrumentation and Measurements', 5, '1', 'Describe the types and working of instruments and sensors', 'Cognitive', 2, 1, 47),
	(169, 'ME3508-T', 'Instrumentation and Measurements', 5, '2', 'Calculate the electrical parameters of instruments and sensors', 'Cognitive', 3, 2, 47),
	(170, 'ME3508-L', 'Instrumentation and Measurements', 5, '1', 'Construct the hardware of the assigned project.', 'Psychomotor', 3, 3, 45),
	(171, 'ME3508-L', 'Instrumentation and Measurements', 5, '2', 'Analyze a system containing Sensors and Actuators using a top-down approach,initializing from system specifications.', 'Cognitive', 4, 3, 45),
	(172, 'ME3508-L', 'Instrumentation and Measurements', 5, '3', 'Communicate effectively in both written and oral forms.', 'Affective', 2, 3, 45),
	(173, 'ME3508-L', 'Instrumentation and Measurements', 5, '4', 'Write weekly lab reports', 'Cognitive', 3, 9, 45),
	(174, 'ME3508-L', 'Instrumentation and Measurements', 5, '5', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 45),
	(175, 'ME3508-L', 'Instrumentation and Measurements', 5, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 45),
	(176, 'ME3507-T', 'Theory of Machines', 5, '1', 'Explain the fundamentals of mechanics of machines and identify mechanisms and their degrees of freedom.', 'Cognitive', 2, 1, 43),
	(177, 'ME3507-T', 'Theory of Machines', 5, '2', 'Compute kinematic characteristics of mechanisms.', 'Cognitive', 3, 2, 43),
	(178, 'ME3507-T', 'Theory of Machines', 5, '3', 'Analyze a mechanism’s kinetics and balancing requirements to ensure safe operation', 'Cognitive', 4, 2, 43),
	(179, 'ME3507-L', 'Theory of Machines', 5, '1', 'Construct given team project: Fabrication of mechanism to demonstrate its application', 'Psychomotor', 3, 3, 42),
	(180, 'ME3507-L', 'Theory of Machines', 5, '2', 'Compare different mechanism for a given application and justify their selection', 'Cognitive', 5, 3, 42),
	(181, 'ME3507-L', 'Theory of Machines', 5, '3', 'Presents information and findings of the project concisely and logically (project presentation and VIVA)', 'Affective', 2, 3, 42),
	(182, 'ME3507-L', 'Theory of Machines', 5, '4', 'Reproduce the Setup for weekly experiments and lab exams', 'Psychomotor', 2, 9, 42),
	(183, 'ME3507-L', 'Theory of Machines', 5, '5', 'Write weekly lab reports', 'Cognitive', 3, 9, 42),
	(184, 'ME3507-L', 'Theory of Machines', 5, '6', 'Participate responsibly to complete a task', 'Affective', 2, 9, 42);


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.course VALUES
	(1, 'ME1101', 'Communication & Presentation Skills', 1),
	(2, 'ME1104', 'Engineering Mathematics-I', 1),
	(3, 'ME1106', 'Islamic Studies', 1),
	(4, 'ME1109', 'Engineering Drawing-I', 1),
	(5, 'ME1110', 'Teching Holuy Quran', 2),
	(6, 'ME1111-L', 'Electric Ciruits', 1),
	(7, 'ME1111-T', 'Electric Ciruits', 1),
	(8, 'ME1116', 'Humnities', 1),
	(9, 'ME1201-L', 'Electronic Devices and Circuits', 2),
	(10, 'ME1201-T', 'Electronic Devices and Circuits', 2),
	(11, 'ME1202', 'Engineering Mathematics – II: Linear Algebra & Ordinary Differential Equations', 2),
	(12, 'ME1203', 'Engineering Mathematics – II: Linear Algebra & Ordinary Differential Equations', 2),
	(13, 'ME1203-L', 'Engineering Physics', 1),
	(14, 'ME1203-T', 'Engineering Physics', 1),
	(15, 'ME1204', 'Engineering Statics', 2),
	(16, 'ME1207', 'Engineering Workshop', 2),
	(17, 'ME1208', 'Materials and Manufacturing Processes', 2),
	(18, 'ME1209', 'Computer Programming', 1),
	(19, 'ME1211', 'Ideology and Constitution of Pakistan', 3),
	(20, 'ME2302-L', 'Digital Logic Design', 3),
	(21, 'ME2302-T', 'Digital Logic Design', 3),
	(22, 'ME2303', 'Engineering Dynamics', 3),
	(23, 'ME2304', 'Engineering Mathematics – III: 3D Geometry & Vector Calculus', 3),
	(24, 'ME2306', 'Pakistan Studies', 2),
	(25, 'ME2308-L', 'Fundamentals of Thermal Sciences', 3),
	(26, 'ME2308-T', 'Fundamentals of Thermal Sciences', 3),
	(27, 'ME2309', 'Eng. Drawing - II', 3),
	(28, 'ME2310', 'Community Service', 4),
	(29, 'ME2311', 'Network Analysis', 3),
	(30, 'ME2312', 'Data Structures & Object Oriented Programming', 2),
	(31, 'ME2401-L', 'Electronics Circuit Design', 4),
	(32, 'ME2401-T', 'Electronics Circuit Design', 4),
	(33, 'ME2403', 'Engineering Mathematics – IV Transformation Techniques', 4),
	(34, 'ME2406-L', 'Strength of Materials', 4),
	(35, 'ME2406-T', 'Strength of Materials', 4),
	(36, 'ME2407-L', 'Actuating Systems', 4),
	(37, 'ME2407-T', 'Actuating Systems', 4),
	(38, 'ME2408', 'Signals and Systems', 5),
	(39, 'ME2411-L', 'Fluid Mechanics', 4),
	(40, 'ME2411-T', 'Fluid Mechanics', 4),
	(41, 'ME3501', 'Engineering Mathematics – V Numerical Methods', 5),
	(42, 'ME3507-L', 'Theory of Machines', 5),
	(43, 'ME3507-T', 'Theory of Machines', 5),
	(44, 'ME3508-L', 'Artificial Intelligence in Engineering', 5),
	(45, 'ME3508-L', 'Instrumentation and Measurements', 5),
	(46, 'ME3508-T', 'Artificial Intelligence in Engineering', 5),
	(47, 'ME3508-T', 'Instrumentation and Measurements', 5),
	(48, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 5),
	(49, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 5),
	(50, 'ME3601', 'Solid Modeling', 4),
	(51, 'ME4823', 'Engineering Management', 8);


--
-- Name: clo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clo_id_seq', 184, true);


--
-- Name: course_cid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_cid_seq', 51, true);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (cid);


--
-- PostgreSQL database dump complete
--

\unrestrict siW6iwvqrRy6OotLKndzTpuycQFDQsMZu6dFDhcuoq9O2SoAUHhhh8eE2hGZHYN

