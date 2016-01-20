-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2015 at 05:16 AM
-- Server version: 5.7.9
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mscschedulizer`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL,
  `courseNumber` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `course_sections`
--

DROP TABLE IF EXISTS `course_sections`;
CREATE TABLE IF NOT EXISTS `course_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `course_id` int(11) NOT NULL,
  `courseterm_id` int(11) NOT NULL,
  `courseCRN` varchar(5) NOT NULL,
  `instructor` varchar(25) NOT NULL,
  `currentEnrollment` int(11) NOT NULL,
  `maxEnrollment` int(11) NOT NULL,
  `credits` int(11) NOT NULL,
  `identifier` varchar(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `course_terms`
--

DROP TABLE IF EXISTS `course_terms`;
CREATE TABLE IF NOT EXISTS `course_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `abbreviation` varchar(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `course_terms`
--

INSERT INTO `course_terms` (`id`, `abbreviation`, `name`) VALUES
(1, '1', 'Full Term'),
(2, '5', '5 Week Course/ 1st 5 weeks of term'),
(3, '6', '5 Week Course/ 2nd 5 weeks of term'),
(4, '7', '5 Week Course/ 3rd 5 weeks of term'),
(5, '8', '8 Week Course/ 1st 8 weeks of term'),
(6, '9', '8 Week Course/ 2nd 8 weeks of term'),
(7, 'A', '10 Week Course/ 1st 10 weeks of term'),
(8, 'B', '10 Week Course/ last 10 weeks of term'),
(9, 'C', 'Combined Parts of Term'),
(10, 'D', '6 Week Course/1st 6 weeks of term'),
(11, 'E', '6 Week Course/ 2nd 6 weeks of term'),
(12, 'F', 'Summer 1'),
(13, 'G', 'Summer 2'),
(14, 'H', 'Summer 3');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `abbreviation` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--
DROP TABLE IF EXISTS `meetings`;
CREATE TABLE IF NOT EXISTS `meetings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `monday` tinyint(1) NOT NULL DEFAULT '0',
  `tuesday` tinyint(1) NOT NULL DEFAULT '0',
  `wednesday` tinyint(1) NOT NULL DEFAULT '0',
  `thursday` tinyint(1) NOT NULL DEFAULT '0',
  `friday` tinyint(1) NOT NULL DEFAULT '0',
  `startTime` int(4) NOT NULL,
  `endTime` int(4) NOT NULL,
  `coursesection_id` int(11) NOT NULL,
  `building` varchar(25) NOT NULL,
  `room` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `required_identifiers`
--

DROP TABLE IF EXISTS `required_identifiers`;
CREATE TABLE IF NOT EXISTS `required_identifiers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(2) NOT NULL,
  `section_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `term_weeks`
--

DROP TABLE IF EXISTS `term_weeks`;
CREATE TABLE IF NOT EXISTS `term_weeks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `week` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=95 ;

--
-- Dumping data for table `term_weeks`
--

INSERT INTO `term_weeks` (`id`, `week`, `term_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 1, 2),
(17, 2, 2),
(18, 3, 2),
(19, 4, 2),
(20, 5, 2),
(21, 6, 3),
(22, 7, 3),
(23, 8, 3),
(24, 9, 3),
(25, 10, 3),
(26, 10, 3),
(27, 11, 4),
(28, 14, 4),
(29, 13, 4),
(30, 14, 4),
(31, 15, 4),
(32, 1, 5),
(33, 2, 5),
(34, 3, 5),
(35, 4, 5),
(36, 5, 5),
(37, 6, 5),
(38, 7, 5),
(39, 8, 5),
(40, 8, 6),
(41, 9, 6),
(42, 10, 6),
(43, 11, 6),
(44, 12, 6),
(45, 13, 6),
(46, 14, 6),
(47, 15, 6),
(48, 1, 7),
(49, 2, 7),
(50, 3, 7),
(51, 4, 7),
(52, 5, 7),
(53, 6, 7),
(54, 7, 7),
(55, 8, 7),
(56, 9, 7),
(57, 10, 7),
(58, 6, 8),
(59, 7, 8),
(60, 8, 8),
(61, 9, 8),
(62, 10, 8),
(63, 11, 8),
(64, 12, 8),
(65, 13, 8),
(66, 14, 8),
(67, 15, 8),
(68, 1, 9),
(69, 2, 9),
(70, 3, 9),
(71, 4, 9),
(72, 5, 9),
(73, 6, 9),
(74, 7, 9),
(75, 8, 9),
(76, 9, 9),
(77, 10, 9),
(78, 11, 9),
(79, 12, 9),
(80, 13, 9),
(81, 14, 9),
(82, 15, 9),
(83, 1, 10),
(84, 2, 10),
(85, 3, 10),
(86, 4, 10),
(87, 5, 10),
(88, 6, 10),
(89, 7, 11),
(90, 8, 11),
(91, 9, 11),
(92, 10, 11),
(93, 11, 11),
(94, 12, 11);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
