-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 05, 2023 at 10:46 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `regov`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `userId` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `IDX_5e568e001f9d1b91f67815c580` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`userId`, `username`, `password`, `salt`, `name`) VALUES
('XPVFTQWSMU', 'adminTest', '$2b$10$a7s5WWbpPIFPeuJ7/6.kyO5iu099GzNNv4NcMbKJECJA/or7yd6dG', '$2b$10$a7s5WWbpPIFPeuJ7/6.kyO', 'Test Admin 1');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `courseId` varchar(255) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `maxEnrollmentCapacity` int NOT NULL DEFAULT '0',
  `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `manageByUserId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`courseId`),
  KEY `FK_d7046ac307a52d37ce894c21f6e` (`manageByUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`courseId`, `courseName`, `key`, `maxEnrollmentCapacity`, `createdDate`, `updatedDate`, `manageByUserId`) VALUES
('C3631420064', 'Course5', 'COURSE_5', 8, '2023-05-05 13:54:24.627759', '2023-05-05 13:54:24.627759', 'XPVFTQWSMU'),
('C4719028277', 'Course4', 'COURSE_4', 8, '2023-05-05 13:54:12.654381', '2023-05-05 13:54:12.654381', 'XPVFTQWSMU'),
('C6228463962', 'Course3', 'COURSE_3', 8, '2023-05-05 13:54:05.335219', '2023-05-05 13:54:05.335219', 'XPVFTQWSMU'),
('C6555150200', 'Course1', 'COURSE_1', 2, '2023-05-05 13:53:29.466801', '2023-05-05 13:53:29.466801', 'XPVFTQWSMU'),
('C8349496075', 'Course6', 'COURSE_6', 7, '2023-05-05 13:54:33.329158', '2023-05-05 13:57:30.000000', 'XPVFTQWSMU'),
('C8842518562', 'Course2', 'COURSE_2', 1, '2023-05-05 13:53:51.010922', '2023-05-05 16:06:59.000000', 'XPVFTQWSMU');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE IF NOT EXISTS `enrollment` (
  `enrollmentId` varchar(255) NOT NULL,
  `enrollmentStatus` varchar(255) NOT NULL DEFAULT 'REGISTERED',
  `courseKey` varchar(255) NOT NULL,
  `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `studentStudentId` varchar(255) DEFAULT NULL,
  `courseCourseId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`enrollmentId`),
  KEY `FK_e3d999ae2a896bf872a18c8680b` (`studentStudentId`),
  KEY `FK_97353d46417aafd330178553b4e` (`courseCourseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`enrollmentId`, `enrollmentStatus`, `courseKey`, `createdDate`, `updatedDate`, `studentStudentId`, `courseCourseId`) VALUES
('E0250154666', 'UNREGISTERED', 'COURSE_2', '2023-05-05 15:31:17.137171', '2023-05-05 16:06:41.000000', '3095551257', 'C8842518562'),
('E9698343287', 'REGISTERED', 'COURSE_2', '2023-05-05 16:04:46.508454', '2023-05-05 16:04:46.508454', '7461254741', 'C8842518562');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `studentId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `joinedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` varchar(255) NOT NULL DEFAULT 'ACTIVATED',
  PRIMARY KEY (`studentId`),
  KEY `IDX_9316abc534487368cfd8527e8d` (`studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`studentId`, `name`, `email`, `password`, `salt`, `joinedDate`, `status`) VALUES
('3095551257', 'Dilan B', 'dilanb@gmail.com', '$2b$10$e6bgTCxWDUsGfDSbNTk2cOuVYNItS81KEuiAjtpK3qxEP9h5kz9l6', '$2b$10$e6bgTCxWDUsGfDSbNTk2cO', '2023-05-05 14:21:14.389583', 'ACTIVATED'),
('7461254741', 'Dilan A', 'dilana@gmail.com', '$2b$10$WGtDE/GeqBetglUQ8dZ/I.yBlydqwyiGtxbLEGKva3QYH/v1T.fEm', '$2b$10$WGtDE/GeqBetglUQ8dZ/I.', '2023-05-05 14:19:27.269667', 'ACTIVATED');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `FK_d7046ac307a52d37ce894c21f6e` FOREIGN KEY (`manageByUserId`) REFERENCES `admin` (`userId`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `FK_97353d46417aafd330178553b4e` FOREIGN KEY (`courseCourseId`) REFERENCES `course` (`courseId`),
  ADD CONSTRAINT `FK_e3d999ae2a896bf872a18c8680b` FOREIGN KEY (`studentStudentId`) REFERENCES `student` (`studentId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
