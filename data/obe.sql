--
-- PostgreSQL database dump
--

\restrict GMWUObcdDDmImHcEgXKfmhzNQ8gbr3ZWnbr3pb1Lfm57mmLBI9QbwNMsZlSceZV

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


\unrestrict GMWUObcdDDmImHcEgXKfmhzNQ8gbr3ZWnbr3pb1Lfm57mmLBI9QbwNMsZlSceZV
\connect obe
\restrict GMWUObcdDDmImHcEgXKfmhzNQ8gbr3ZWnbr3pb1Lfm57mmLBI9QbwNMsZlSceZV

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
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    cid bigint,
    code text,
    title text,
    theory integer,
    lab integer,
    total bigint
);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses VALUES
	(1, 'ME2407-T', 'Actuating Systems', 3, 0, 6),
	(2, 'ME2407-L', 'Actuating Systems', 0, 1, 6),
	(3, 'ME5101', 'Advanced Embedded Systems', 3, 0, 3),
	(4, 'ME5321', 'Advanced Manufacturing Design Techniques', 3, 0, 3),
	(5, 'ME5227', 'Advanced Modeling and Simulation', 3, 0, 3),
	(6, 'ME5102', 'Advanced Robotics', 3, 0, 3),
	(7, 'ME5327', 'Artificial Intelligence', 3, 0, 3),
	(8, 'ME4721', 'Artificial Intelligence and Computer Vision', 3, 0, 4),
	(9, 'ASA1101', 'Calculus and Analytical Geometry', 3, 0, 3),
	(10, 'ME1120', 'Chemistry Fundamentals', 1, 0, 2),
	(11, 'ASA1102-L', 'Circuit Analysis', 0, 1, 3),
	(12, 'ASA1102-T', 'Circuit Analysis', 2, 0, 3),
	(13, 'ME1112', 'Communication and Presentation Skills', 3, 0, 1),
	(14, 'ME1101', 'Communication and Presentation Skills', 2, 0, 4),
	(15, 'ASA1103', 'Communication and Presentation Skills', 3, 0, 3),
	(16, 'ME2310', 'Community Service', 1, 1, 5),
	(17, 'ASA1104', 'Computer Aided Design', 1, 1, 3),
	(18, 'ME5322', 'Computer Integrated Manufacturing', 3, 0, 1),
	(19, 'ME1209', 'Computer Programming', 0, 2, 6),
	(20, 'ME3602-T', 'Control Systems', 3, 0, 8),
	(21, 'ME3602-L', 'Control Systems', 0, 1, 8),
	(22, 'ME5201', 'Data Acquisition and Control', 3, 0, 3),
	(23, 'ME2312', 'Data Structures and Object Oriented Programming', 0, 2, 5),
	(24, 'ME4821', 'Digital Image Processing', 3, 0, 5),
	(25, 'ME2302-T', 'Digital Logic Design', 2, 0, 6),
	(26, 'ME2302-L', 'Digital Logic Design', 0, 1, 5),
	(27, 'ME4722', 'Digital Signal Processing', 3, 0, 2),
	(28, 'ME1111-T', 'Electric Circuits', 2, 0, 5),
	(29, 'ME1111-L', 'Electric Circuits', 0, 1, 5),
	(30, 'ME2402-L', 'Electro-Mechanical Systems', 0, 1, 1),
	(31, 'ME1201-L', 'Electronic Devices and Circuits', 0, 1, 5),
	(32, 'ME1201-T', 'Electronic Devices and Circuits', 3, 0, 5),
	(33, 'ME2401-T', 'Electronics Circuit Design', 3, 0, 5),
	(34, 'ME2401-L', 'Electronics Circuit Design', 0, 1, 5),
	(35, 'ME1109', 'Engineering Drawing-I', 0, 2, 5),
	(36, 'ME2309', 'Engineering Drawing-II', 0, 1, 5),
	(37, 'ME2303', 'Engineering Dynamics', 3, 0, 6),
	(38, 'ME4702', 'Engineering Economics and Project Management', 3, 0, 7),
	(39, 'ME4823', 'Engineering Management', 3, 0, 1),
	(40, 'ME1104', 'Engineering Mathematics-I: Calculus and Analytical Geometry', 3, 0, 8),
	(41, 'ME2304', 'Engineering Mathematics-III: 3D Geometry and Vector Calculus', 3, 0, 6),
	(42, 'ME1202', 'Engineering Mathematics-II: Linear Algebra and Ordinary Differential Equations (ODEs)', 3, 0, 5),
	(43, 'ME2403', 'Engineering Mathematics-IV: Transformation Techniques', 3, 0, 7),
	(44, 'ME3603', 'Engineering Mathematics-VI: Probability and Statistics', 3, 0, 6),
	(45, 'ME3501', 'Engineering Mathematics-V: Numerical Methods', 3, 0, 7),
	(46, 'ME1203-L', 'Engineering Physics', 0, 1, 5),
	(47, 'ME1203-T', 'Engineering Physics', 2, 0, 6),
	(48, 'ME1204', 'Engineering Statics', 3, 0, 5),
	(49, 'ME1207', 'Engineering Workshop', 0, 2, 5),
	(50, 'ME4724', 'Entrepreneurship', 3, 0, 1),
	(51, 'ME4709', 'Final Design Project-I', 3, 0, 8),
	(52, 'ME4809', 'Final Design Project-II', 3, 0, 9),
	(53, 'ME4711', 'Finite Element Analysis', 0, 1, 7),
	(54, 'ME3502-L', 'Fluid Mechanics', 0, 1, 7),
	(55, 'ME3502-T', 'Fluid Mechanics', 3, 0, 6),
	(56, 'ME2351', 'Foreign Languages', 2, 0, 4),
	(57, 'ASA1115', 'Fundamentals of Engineering Mathematics', 1, 0, 1),
	(58, 'ME1121', 'Fundamentals of Engineering Mathematics', 1, 0, 2),
	(59, 'ME2308-T', 'Fundamentals of Thermal Sciences', 3, 0, 2),
	(60, 'ME2308-L', 'Fundamentals of Thermal Sciences', 0, 1, 2),
	(61, 'ME4703-L', 'Heat Transfer', 0, 1, 11),
	(62, 'ME4703-T', 'Heat Transfer', 2, 0, 8),
	(63, 'ME1116', 'Humanities', 2, 0, 1),
	(64, 'ASA1108', 'Humanities', 2, 0, 2),
	(65, 'ASA1105', 'ICT and Programming Fundamentals', 1, 1, 3),
	(66, 'ME1211', 'Ideology and Constitution of Pakistan', 2, 0, 2),
	(67, 'ME5202', 'Image Processing for Intelligent Systems', 3, 0, 2),
	(68, 'ME4801-L', 'Industrial Automation', 0, 1, 1),
	(69, 'ME4801-T', 'Industrial Automation', 2, 0, 2),
	(70, 'ME5323', 'Industrial Control Technology', 3, 0, 1),
	(71, 'ME3508-T', 'Instrumentation and Measurements', 3, 0, 7),
	(72, 'ME3508-L', 'Instrumentation and Measurements', 0, 1, 6),
	(73, 'ASA1106-T', 'Introduction to Autonomous Systems', 2, 0, 3),
	(74, 'ASA1106-L', 'Introduction to Autonomous Systems', 0, 1, 3),
	(75, 'ASA1107', 'Islamic Studies', 2, 0, 3),
	(76, 'ME1106', 'Islamic Studies', 2, 0, 5),
	(77, 'ME4725', 'Leadership and Motivation Techniques', 3, 0, 1),
	(78, 'ME5228', 'Linear Control Systems', 3, 0, 2),
	(79, 'ME3604', 'Machine Design', 3, 0, 6),
	(80, 'ME4834', 'Machine Learning', 3, 0, 1),
	(81, 'ME5324', 'Machine Vision', 3, 0, 1),
	(82, 'ME4807-T', 'Manufacturing Automation', 2, 0, 8),
	(83, 'ME4807-L', 'Manufacturing Automation', 0, 1, 9),
	(84, 'ME3506', 'Materials and Manufacturing Processes', 3, 0, 6),
	(85, 'ME1208', 'Materials and Manufacturing Processes', 2, 0, 3),
	(86, 'ME4705-T', 'Mechatronics System Design', 3, 0, 6),
	(87, 'ME4705-L', 'Mechatronics System Design', 0, 1, 6),
	(88, 'ME3503-L', 'Microcontroller Based Systems', 0, 1, 1),
	(89, 'ME3503-T', 'Microcontroller Based Systems', 2, 0, 1),
	(90, 'ME3509-L', 'Microprocessor and Microcontroller Based Systems', 0, 1, 6),
	(91, 'ME3509-T', 'Microprocessor and Microcontroller Based Systems', 2, 0, 6),
	(92, 'ME4828', 'Modeling and Simulation', 3, 0, 1),
	(93, 'ME2311', 'Network Analysis', 2, 0, 6),
	(94, 'ME2306', 'Pakistan Studies', 2, 0, 5),
	(95, 'ME5231', 'Pattern Recognition and Analysis', 3, 0, 1),
	(96, 'ME3605-T', 'Power Electronics', 3, 0, 7),
	(97, 'ME3605-L', 'Power Electronics', 0, 1, 7),
	(98, 'ME4706', 'Professional Practices', 2, 0, 6),
	(99, 'ME2353', 'Psychology', 2, 0, 3),
	(100, 'ME5105', 'Research Methodology', 3, 0, 4),
	(101, 'ME4802-T', 'Robotics', 3, 0, 10),
	(102, 'ME4802-L', 'Robotics', 0, 1, 6),
	(103, 'ME5332', 'Sensor and Sensing Technology', 3, 0, 4),
	(104, 'ME3504-L', 'Sensors, Actuators and Instrumentation', 0, 1, 1),
	(105, 'ME3504-T', 'Sensors, Actuators and Instrumentation', 3, 0, 1),
	(106, 'ME4734', 'Sensors and Sensing Technologies', 3, 0, 3),
	(107, 'ME2408', 'Signals and Systems', 2, 0, 7),
	(108, 'ME3607', 'Solid Modeling', 0, 1, 5),
	(109, 'ME2406-L', 'Strength of Materials', 0, 1, 1),
	(110, 'ME2409-T', 'Strength of Materials', 2, 0, 6),
	(111, 'ME2409-L', 'Strength of Materials', 0, 1, 5),
	(112, 'ME4731', 'Supply Chain Management', 3, 0, 2),
	(113, 'ME1110', 'Teachings of Holy Quran', NULL, NULL, 2),
	(114, 'ME1205', 'Technical Writing Skills', 2, 0, 6),
	(115, 'ME3608', 'Technopreneurship', 2, 0, 7),
	(116, 'ME3507-T', 'Theory of Machines', 2, 0, 6),
	(117, 'ME3507-L', 'Theory of Machines', 0, 1, 5),
	(118, 'ME2405-L', 'Thermodynamics', 0, 1, 4),
	(119, 'ME2405-T', 'Thermodynamics', 2, 0, 5);


--
-- PostgreSQL database dump complete
--

\unrestrict GMWUObcdDDmImHcEgXKfmhzNQ8gbr3ZWnbr3pb1Lfm57mmLBI9QbwNMsZlSceZV

