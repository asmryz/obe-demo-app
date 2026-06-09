--
-- PostgreSQL database dump
--

\restrict we2evGK3W3l8oUVq3CeiZOdCZMSSIWgSnAaaGucS372KE5Tvq0UUlDWcNz7E76f

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

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

DROP DATABASE IF EXISTS obe;
--
-- Name: obe; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE obe WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\unrestrict we2evGK3W3l8oUVq3CeiZOdCZMSSIWgSnAaaGucS372KE5Tvq0UUlDWcNz7E76f
\connect obe
\restrict we2evGK3W3l8oUVq3CeiZOdCZMSSIWgSnAaaGucS372KE5Tvq0UUlDWcNz7E76f

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course (
    cid integer NOT NULL,
    code text,
    title text,
    theory integer,
    lab integer,
    prgid integer
);


--
-- Name: course_cid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_cid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_cid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_cid_seq OWNED BY public.course.cid;


--
-- Name: course cid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course ALTER COLUMN cid SET DEFAULT nextval('public.course_cid_seq'::regclass);


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.course VALUES
	(3, 'ME1106', 'Islamic Studies', 3, 0, 2),
	(4, 'ME1109', 'Engineering Drawing-I', 3, 0, 2),
	(10, 'ME1209', 'Computer Programming', 3, 0, 2),
	(16, 'ME1204', 'Engineering Statics', 3, 0, 2),
	(17, 'ME1207', 'Engineering Workshop', 3, 0, 2),
	(18, 'ME1208', 'Materials and Manufacturing Processes', 3, 0, 2),
	(19, 'ME2306', 'Pakistan Studies', 3, 0, 2),
	(21, 'ME1211', 'Ideology and Constitution of Pakistan', 3, 0, 2),
	(76, 'ME4821', 'Engineering Elective –II (Digital Image Processing)', 3, 0, 2),
	(77, 'ME4823', 'Engineering Management', 3, 0, 2),
	(78, 'ME4823', 'Management Sciences Elective ( Engineering and Management)', 3, 0, 2),
	(79, 'ME4824', 'Social Sciences (Organizational Behaviour)', 3, 0, 2),
	(84, 'ME2351', 'Foreign Languages', 3, 0, 2),
	(86, 'ME4731', 'Supply Chain Management', 3, 0, 2),
	(87, 'ME4834', 'Machine Learning', 3, 0, 2),
	(88, 'ME4734', 'Sensors and Sensing Technologies', 3, 0, 2),
	(89, 'ME1120', 'Chemistry Fundamentals', 3, 0, 2),
	(90, 'ME1121', 'Fundamentals of Engineering Mathematics', 3, 0, 2),
	(91, 'ME2353', 'Psychology', 3, 0, 2),
	(95, 'ME3506', 'Materials and Manufacturing Processes', 3, 0, 2),
	(96, 'ME3607', 'Solid Modeling', 3, 0, 2),
	(1, 'ME1101', 'Communication and Presentation Skills', 3, 0, 2),
	(85, 'ME1112', 'Communication and Presentation Skills', 3, 0, 2),
	(2, 'ME1104', 'Engineering Mathematics-I: Calculus and Analytical Geometry', 3, 0, 2),
	(7, 'ME1116', 'Humanities', 3, 0, 2),
	(11, 'ME1110', 'Teachings of Holy Quran', 3, 0, 2),
	(14, 'ME1202', 'Engineering Mathematics-II: Linear Algebra and Ordinary Differential Equations (ODEs)', 3, 0, 2),
	(20, 'ME2312', 'Data Structures and Object Oriented Programming', 3, 0, 2),
	(25, 'ME2304', 'Engineering Mathematics-III: 3D Geometry and Vector Calculus', 3, 0, 2),
	(28, 'ME2309', 'Engineering Drawing-II', 3, 0, 2),
	(33, 'ME2403', 'Engineering Mathematics-IV: Transformation Techniques', 3, 0, 2),
	(42, 'ME3501', 'Engineering Mathematics-V: Numerical Methods', 3, 0, 2),
	(8, 'ME1203-L', 'Engineering Physics', 0, 1, 2),
	(12, 'ME1201-L', 'Electronic Devices and Circuits', 0, 1, 2),
	(22, 'ME2302-L', 'Digital Logic Design', 0, 1, 2),
	(9, 'ME1203-T', 'Engineering Physics', 2, 0, 2),
	(13, 'ME1201-T', 'Electronic Devices and Circuits', 2, 0, 2),
	(40, 'ME3607', 'Solid Modeling', 3, 0, 2),
	(83, 'ME4703-L', 'Heat Transfer', 0, 1, 2),
	(60, 'ME4702', 'Engineering Economics & Project Management', 3, 0, 2),
	(24, 'ME2303', 'Engineering Dynamics', 3, 0, 2),
	(29, 'ME2311', 'Network Analysis', 3, 0, 2),
	(30, 'ME2310', 'Community Service', 3, 0, 2),
	(41, 'ME2408', 'Signals and Systems', 3, 0, 2),
	(53, 'ME3603', 'Engineering Mathematics VI: Probability & Statistics', 3, 0, 2),
	(54, 'ME3604', 'Machine Design', 3, 0, 2),
	(59, 'ME1205', 'Technical Writing Skills', 3, 0, 2),
	(61, 'ME4706', 'Professional Practices', 3, 0, 2),
	(62, 'ME4709', 'Final Design Project- I *', 3, 0, 2),
	(63, 'ME4711', 'Finite Element Analysis', 3, 0, 2),
	(64, 'ME4727', 'Engineering Elective –I ( Digital Control Systems)', 3, 0, 2),
	(67, 'ME4826', 'Embedded Systems', 3, 0, 2),
	(68, 'ME2xxx', 'Social Sciences', 3, 0, 2),
	(69, 'ME3608', 'Technopreneurship', 3, 0, 2),
	(70, 'ME4721', 'Engineering Elective –II (Modeling and Simulation)', 3, 0, 2),
	(71, 'ME4722', 'Engineering Elective –II (Digital Signal Processing)', 3, 0, 2),
	(72, 'ME4725', 'Management Sciences Elective (Leadership and Motivation Technique)', 3, 0, 2),
	(75, 'ME4809', 'Final Design Project- II *', 3, 0, 2),
	(26, 'ME2308-L', 'Fundamentals of Thermal Sciences', 0, 1, 2),
	(31, 'ME2401-L', 'Electronics Circuit Design', 0, 1, 2),
	(34, 'ME2406-L', 'Strength of Materials', 0, 1, 2),
	(36, 'ME2407-L', 'Actuating Systems', 0, 1, 2),
	(43, 'ME3507-L', 'Theory of Machines', 0, 1, 2),
	(45, 'ME3508-L', 'Artificial Intelligence in Engineering', 0, 1, 2),
	(46, 'ME3508-L', 'Instrumentation and Measurements', 0, 1, 2),
	(49, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 0, 1, 2),
	(51, 'ME3602-L', 'Control System', 0, 1, 2),
	(55, 'ME3605-L', 'Power Electronics', 0, 1, 2),
	(57, 'ME4705-L', 'Mechatronics System Design', 0, 1, 2),
	(65, 'ME4802-L', 'Robotics', 0, 1, 2),
	(73, 'ME4807-L', 'Manufacturing Automation', 0, 1, 2),
	(38, 'ME3502-L', 'Fluid Mechanics', 0, 1, 2),
	(81, 'ME2405-L', 'Thermodynamics', 0, 1, 2),
	(5, 'ME1111-L', 'Electric Circuits', 0, 1, 2),
	(92, 'ME2409-L', 'Strength of Materials', 0, 1, 2),
	(23, 'ME2302-T', 'Digital Logic Design', 2, 0, 2),
	(27, 'ME2308-T', 'Fundamentals of Thermal Sciences', 2, 0, 2),
	(32, 'ME2401-T', 'Electronics Circuit Design', 2, 0, 2),
	(35, 'ME2406-T', 'Strength of Materials', 2, 0, 2),
	(37, 'ME2407-T', 'Actuating Systems', 2, 0, 2),
	(44, 'ME3507-T', 'Theory of Machines', 2, 0, 2),
	(47, 'ME3508-T', 'Artificial Intelligence in Engineering', 2, 0, 2),
	(48, 'ME3508-T', 'Instrumentation and Measurements', 2, 0, 2),
	(50, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 2, 0, 2),
	(52, 'ME3602-T', 'Control System', 2, 0, 2),
	(56, 'ME3605-T', 'Power Electronics', 2, 0, 2),
	(58, 'ME4705-T', 'Mechatronics System Design', 2, 0, 2),
	(66, 'ME4802-T', 'Robotics', 2, 0, 2),
	(74, 'ME4807-T', 'Manufacturing Automation', 2, 0, 2),
	(39, 'ME3502-T', 'Fluid Mechanics', 2, 0, 2),
	(80, 'ME2405-T', 'Thermodynamics', 2, 0, 2),
	(82, 'ME4703-T', 'Heat Transfer', 2, 0, 2),
	(93, 'ME2409-T', 'Strength of Materials', 2, 0, 2),
	(94, 'ME3504-T', 'Sensors, Actuators and Instrumentation', 2, 0, 2),
	(6, 'ME1111-T', 'Electric Circuits', 2, 0, 2);


--
-- Name: course_cid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_cid_seq', 96, true);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (cid);


--
-- PostgreSQL database dump complete
--

\unrestrict we2evGK3W3l8oUVq3CeiZOdCZMSSIWgSnAaaGucS372KE5Tvq0UUlDWcNz7E76f

