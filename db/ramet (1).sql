-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2021 at 08:13 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ramet`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_affiliate`
--

CREATE TABLE `account_affiliate` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `AFF_DATE` datetime NOT NULL,
  `AFF_CLICK` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `AFF_POINT` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `AFF_REGISTER` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `AFF_TOPUP` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `AFF_WITHDRAW` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `BALANCE_LATEST` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `account_session`
--

CREATE TABLE `account_session` (
  `CustomerID` int(11) NOT NULL,
  `SL_SESSION` varchar(255) NOT NULL,
  `SL_ADMIN_SESSION` varchar(255) DEFAULT NULL,
  `SL_LOGINIP` varchar(255) NOT NULL,
  `SESSION_STATUS` int(1) NOT NULL DEFAULT 0,
  `DATE` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `account_session`
--

INSERT INTO `account_session` (`CustomerID`, `SL_SESSION`, `SL_ADMIN_SESSION`, `SL_LOGINIP`, `SESSION_STATUS`, `DATE`) VALUES
(138499, '1aa1042a656ab36ae85828ec9d64ddb8b84ed5e8', NULL, '127.0.0.1', 0, '2021-02-15 17:03:01'),
(138500, '084759174660123f05b514b3828129b5a2d7ebfc', NULL, '127.0.0.1', 0, '2021-02-16 14:29:51'),
(138502, '0', NULL, '127.0.0.1', 0, '2021-02-16 15:00:40'),
(138503, '5b7322696de62a3418744a93844c0c7cf87d4cd2', NULL, '127.0.0.1', 0, '2021-02-19 04:03:57'),
(138504, '4ceb9103c23b3f12b76cf959ac6b2764171dfc79', NULL, '127.0.0.1', 0, '2021-02-19 06:41:34'),
(138505, '7a2e1e13b6ba0c960d5ddc4735e4b37b52333703', NULL, '127.0.0.1', 0, '2021-02-19 07:19:03'),
(138506, '9412ac2573b629096624e2e65f04ab5760fe3afd', NULL, '127.0.0.1', 0, '2021-02-19 07:21:28'),
(138507, '32e5192945c99950b734b4b615be7116f943a2db', NULL, '127.0.0.1', 0, '2021-02-19 07:47:42'),
(138508, '29ae3dc786f7e4bcf4df25e9e55eb805c79bf2ee', NULL, '127.0.0.1', 0, '2021-02-19 07:57:20'),
(138509, '347fcbae3d219e980990d6eb381eead428d9bdc0', NULL, '127.0.0.1', 0, '2021-02-19 19:01:24'),
(138510, 'ae5509405823fd618c38ffe8278bcbc3dddd999b', NULL, '127.0.0.1', 0, '2021-02-19 11:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `account_statuslog`
--

CREATE TABLE `account_statuslog` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `SL_STATUS` varchar(255) NOT NULL,
  `DATETIME` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `account_statuslog`
--

INSERT INTO `account_statuslog` (`ID`, `CustomerID`, `SL_STATUS`, `DATETIME`) VALUES
(120649, 138503, 'vip', '2021-02-17 06:14:46'),
(120650, 138503, 'vip', '2021-02-17 06:52:32'),
(120651, 138503, 'vip', '2021-02-17 06:54:02'),
(120652, 138503, 'vip', '2021-02-17 06:58:10'),
(120653, 138503, 'vip', '2021-02-17 06:59:25'),
(120654, 138503, 'free', '2021-02-18 10:23:31'),
(120655, 138503, 'free', '2021-02-18 11:20:33'),
(120656, 138503, 'free', '2021-02-18 11:23:27'),
(120657, 138504, 'free', '2021-02-19 04:41:11'),
(120658, 138505, 'free', '2021-02-19 06:53:52'),
(120659, 138509, 'vip', '2021-02-19 09:27:17'),
(120660, 138510, 'vip', '2021-02-19 09:29:44');

-- --------------------------------------------------------

--
-- Table structure for table `account_users`
--

CREATE TABLE `account_users` (
  `CustomerID` int(11) NOT NULL,
  `SLOT_USER` varchar(255) DEFAULT NULL,
  `SL_USERNAME` varchar(255) NOT NULL,
  `SL_PLAYERNAME` varchar(255) DEFAULT NULL,
  `SL_PASSWORD` varchar(32) NOT NULL,
  `SL_FIRSTNAME` varchar(255) NOT NULL,
  `SL_LASTNAME` varchar(255) NOT NULL,
  `SL_BANK_ID` int(2) DEFAULT NULL,
  `SL_BANKID` varchar(255) DEFAULT NULL,
  `SL_LINEID` varchar(255) DEFAULT NULL,
  `SL_REGISDATE` datetime NOT NULL,
  `SL_LASTLOGIN` datetime DEFAULT NULL,
  `SL_REGISIP` varchar(255) NOT NULL,
  `SL_STATUS` varchar(255) NOT NULL DEFAULT 'normal',
  `SL_LEVEL` int(1) NOT NULL DEFAULT 0,
  `SL_FREECODE` varchar(255) DEFAULT NULL,
  `SL_REFERER` varchar(255) DEFAULT NULL,
  `SL_BONUS` varchar(255) DEFAULT '0',
  `SL_AFFBALANCE` varchar(255) DEFAULT '0',
  `SL_AFFSTATUS` varchar(255) NOT NULL DEFAULT '0',
  `SL_AFFCUSTOMERID` int(11) DEFAULT NULL,
  `SL_AFFDATEUPDATE` datetime DEFAULT NULL,
  `SL_WALLETNAME` varchar(255) DEFAULT NULL,
  `SL_SCBNAME` varchar(255) DEFAULT NULL,
  `SL_SEX` varchar(20) DEFAULT NULL,
  `SL_AGE` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `account_users`
--

INSERT INTO `account_users` (`CustomerID`, `SLOT_USER`, `SL_USERNAME`, `SL_PLAYERNAME`, `SL_PASSWORD`, `SL_FIRSTNAME`, `SL_LASTNAME`, `SL_BANK_ID`, `SL_BANKID`, `SL_LINEID`, `SL_REGISDATE`, `SL_LASTLOGIN`, `SL_REGISIP`, `SL_STATUS`, `SL_LEVEL`, `SL_FREECODE`, `SL_REFERER`, `SL_BONUS`, `SL_AFFBALANCE`, `SL_AFFSTATUS`, `SL_AFFCUSTOMERID`, `SL_AFFDATEUPDATE`, `SL_WALLETNAME`, `SL_SCBNAME`, `SL_SEX`, `SL_AGE`) VALUES
(138498, 'xx80801844819', '2541687125', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Daniel', 'Ramos', 23, 'lorem ipsum', '0047092', '2021-02-14 21:13:32', NULL, '127.0.0.1', 'normal', 0, 'PMU1-1596-TWJM', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138499, 'mtx90905459707', '2541687137', NULL, '18e8cc9b662787d719e2acad643cb614', 'Garcia', 'Ramos', 23, 'lorem ipsu3', '0047092', '2021-02-15 12:27:42', '2021-02-15 17:03:01', '127.0.0.1', 'normal', 0, 'D7SV-7011-FP1I', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138500, 'mtx90997549995', '2541687107', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Garci', 'Ramos', 23, 'lorem ipsu4', '0047092', '2021-02-16 13:22:50', '2021-02-16 14:29:51', '127.0.0.1', 'normal', 0, '2UN*-4737-s0iJ', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138501, 'mtx90993612010', '2541687117', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Garci', 'Ramo', 23, 'lorem ipsu5', '0047092', '2021-02-16 14:56:33', NULL, '127.0.0.1', 'normal', 0, '99t[-2851-)1*A', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138502, 'mtx90989527029', '2541687127', NULL, '93a8fa513442047b611b8dc1e300fd5a', 'Garcia', 'Ramo', 23, 'lorem ipsu6', '0047092', '2021-02-16 14:57:42', '2021-02-16 15:00:40', '127.0.0.1', 'normal', 0, 'VgH7-4749-2t$P', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138503, 'mtx90919401805', '2541687177', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Garca', 'Ramo', 23, 'lorem ipsu7', '0047092', '2021-02-16 15:32:05', '2021-02-19 04:03:57', '127.0.0.1', 'free', 0, 'lDln-5918-rs*w', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138504, 'mtx90917380886', '2541687187', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Aarca', 'RamoS', 23, 'lorem ipsu8', '0047092', '2021-02-19 04:37:24', '2021-02-19 06:41:34', '127.0.0.1', 'free', 0, 'lk)Q-5035-8kU&', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138505, 'mtx90933100493', '2541687197', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Barca', 'RamoS', 23, 'lorem ipsu9', '0047092', '2021-02-19 06:49:36', '2021-02-19 07:19:03', '127.0.0.1', 'free', 0, 'zvW(-1199-oD16', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138506, 'mtx90948933642', '2541687207', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Carca', 'RamoS', 23, 'lorem ipsu10', '0047092', '2021-02-19 07:21:11', '2021-02-19 07:21:28', '127.0.0.1', 'normal', 0, 'J2O6-1344-58^i', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138507, 'mtx90949375789', '2541687227', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Darca', 'RamoS', 23, 'lorem ipsu11', '0047092', '2021-02-19 07:47:26', '2021-02-19 07:47:42', '127.0.0.1', 'normal', 0, 'Vfim-2886-jd1J', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138508, 'mtx90973331438', '2541687237', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Earca', 'RamoS', 23, 'lorem ipsu12', '0047092', '2021-02-19 07:57:05', '2021-02-19 07:57:20', '127.0.0.1', 'normal', 0, 'O)2B-1015-9Tu^', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138509, 'mtx90993017928', '2541687247', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Farca', 'RamoS', 23, 'lorem ipsu13', '0047092', '2021-02-19 09:22:53', '2021-02-19 19:01:24', '127.0.0.1', 'vip', 0, 'jX&2-5165-pRPo', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31'),
(138510, 'mtx90930739411', '2541687257', NULL, '9eda0ac267e7cbc8506b9c4ee6a80f06', 'Harca', 'RamoS', 23, 'lorem ipsu14', '0047092', '2021-02-19 09:28:39', '2021-02-19 11:56:08', '127.0.0.1', 'vip', 0, 'PX4c-4232-BYM1', '004574', '0', '0', '0', NULL, NULL, NULL, NULL, 'Man', '31');

-- --------------------------------------------------------

--
-- Table structure for table `bank_information`
--

CREATE TABLE `bank_information` (
  `BANK_ID` int(2) NOT NULL,
  `BANK_NAME` varchar(255) NOT NULL,
  `BANK_CODE` varchar(255) DEFAULT NULL,
  `BANK_CODE_X` varchar(255) DEFAULT NULL,
  `BANK_CODE_L` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `bank_information`
--

INSERT INTO `bank_information` (`BANK_ID`, `BANK_NAME`, `BANK_CODE`, `BANK_CODE_X`, `BANK_CODE_L`) VALUES
(23, 'lorem ipsum', 'AZd2', 'AB-1237654', '654');

-- --------------------------------------------------------

--
-- Table structure for table `bank_setting`
--

CREATE TABLE `bank_setting` (
  `id` int(11) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_number` varchar(15) NOT NULL,
  `bank_username` varchar(255) NOT NULL,
  `bank_password` varchar(255) NOT NULL,
  `pin` varchar(255) DEFAULT NULL,
  `bank_type` int(11) NOT NULL,
  `bank_status` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `balance` varchar(255) DEFAULT NULL,
  `deviceId` varchar(2555) DEFAULT 'a7bda275-8c68-486b-a042-940594a731d7',
  `ApiRefresh` varchar(2555) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `function` int(11) DEFAULT 1,
  `datestart` datetime DEFAULT NULL,
  `idcard` varchar(30) DEFAULT NULL,
  `birtday` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `bank_setting`
--

INSERT INTO `bank_setting` (`id`, `bank_name`, `bank_number`, `bank_username`, `bank_password`, `pin`, `bank_type`, `bank_status`, `created_at`, `balance`, `deviceId`, `ApiRefresh`, `rating`, `function`, `datestart`, `idcard`, `birtday`, `email`) VALUES
(7, '', '', '', '', NULL, 23, 0, '2021-02-18 10:48:08', NULL, 'a7bda275-8c68-486b-a042-940594a731d7', NULL, NULL, 1, NULL, NULL, NULL, NULL),
(8, '', '2541687177', '', '', NULL, 22, 0, '2021-02-18 13:04:50', NULL, 'a7bda275-8c68-486b-a042-940594a731d7', NULL, NULL, 1, NULL, NULL, NULL, NULL),
(9, '', '', '', '', NULL, 1, 0, '2021-02-19 06:35:51', NULL, 'a7bda275-8c68-486b-a042-940594a731d7', NULL, NULL, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bank_transaction`
--

CREATE TABLE `bank_transaction` (
  `DEPOSIT_ID` int(255) NOT NULL,
  `DEPOSIT_OWNER` varchar(10) NOT NULL,
  `DEPOSIT_DATE` datetime NOT NULL,
  `DEPOSIT_BANKCODE` varchar(255) NOT NULL,
  `DEPOSIT_CLIENTID` varchar(255) NOT NULL,
  `DEPOSIT_AMOUNT` varchar(32) NOT NULL,
  `DEPOSIT_ITEMS` int(2) NOT NULL DEFAULT 1,
  `DEPOSIT_TXSTATUS` int(1) NOT NULL DEFAULT 0,
  `DEPOSIT_NAME_SCB` varchar(255) DEFAULT NULL,
  `DEPOSIT_OWNERCODE` varchar(255) DEFAULT NULL,
  `DEPOSIT_WALLET_ID` varchar(255) DEFAULT NULL,
  `SIM` varchar(255) DEFAULT NULL,
  `BALANCE` varchar(255) DEFAULT NULL,
  `DEPOSIT_TEXT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `bank_transaction`
--

INSERT INTO `bank_transaction` (`DEPOSIT_ID`, `DEPOSIT_OWNER`, `DEPOSIT_DATE`, `DEPOSIT_BANKCODE`, `DEPOSIT_CLIENTID`, `DEPOSIT_AMOUNT`, `DEPOSIT_ITEMS`, `DEPOSIT_TXSTATUS`, `DEPOSIT_NAME_SCB`, `DEPOSIT_OWNERCODE`, `DEPOSIT_WALLET_ID`, `SIM`, `BALANCE`, `DEPOSIT_TEXT`) VALUES
(9, '', '2021-02-19 06:54:54', 'WALLET', '2541687197', '10.00', 1, 2, NULL, 'WALLET', 'eijkQrddgjj0d5wbbp', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bonus_settings`
--

CREATE TABLE `bonus_settings` (
  `ID` int(11) NOT NULL,
  `SL_BONUS` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_TURNOVER` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_MAXBONUS` varchar(255) COLLATE utf8_unicode_ci DEFAULT '1000',
  `SL_IMAGE` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_TITLE` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_CONTENT` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_STATUS` varchar(255) COLLATE utf8_unicode_ci DEFAULT '1',
  `SL_FUNC` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_MINIMUM` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SL_OEM` int(11) DEFAULT 0,
  `SL_WITHDRAW` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `bonus_settings`
--

INSERT INTO `bonus_settings` (`ID`, `SL_BONUS`, `SL_TURNOVER`, `SL_MAXBONUS`, `SL_IMAGE`, `SL_TITLE`, `SL_CONTENT`, `SL_STATUS`, `SL_FUNC`, `SL_MINIMUM`, `SL_OEM`, `SL_WITHDRAW`) VALUES
(14, '50', '50', '1000', '2.png', 'test', 'bonus test', '1', '50', NULL, 0, NULL),
(15, '2', '2', '1000', NULL, NULL, NULL, '1', '2', NULL, 0, NULL),
(16, '3', '3', '1000', NULL, NULL, NULL, '1', '3', NULL, 0, NULL),
(17, '4', '4', '1000', NULL, NULL, NULL, '1', '4', NULL, 0, NULL),
(18, '5', '5', '1000', NULL, NULL, NULL, '1', '5', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `codesms_setting`
--

CREATE TABLE `codesms_setting` (
  `ID` int(11) NOT NULL,
  `Max_credit` int(10) NOT NULL,
  `Max_user` int(10) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `codesms_setting`
--

INSERT INTO `codesms_setting` (`ID`, `Max_credit`, `Max_user`, `status`) VALUES
(2, 50, 5000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `credit_freelog`
--

CREATE TABLE `credit_freelog` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `FREE_CODE` varchar(255) NOT NULL,
  `FREE_AMOUNT` varchar(255) NOT NULL,
  `FREE_DATETIME` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `credit_freelog`
--

INSERT INTO `credit_freelog` (`ID`, `CustomerID`, `FREE_CODE`, `FREE_AMOUNT`, `FREE_DATETIME`) VALUES
(1, 138503, 'lDln-5918-rs*w', '50', '2021-02-18 11:23:27'),
(2, 138504, 'lk)Q-5035-8kU&', '50', '2021-02-19 04:41:11'),
(3, 138505, 'zvW(-1199-oD16', '50', '2021-02-19 06:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `credit_turnover`
--

CREATE TABLE `credit_turnover` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `WITHDRAW_TXID` int(11) NOT NULL,
  `TURN_STATUS` int(1) NOT NULL DEFAULT 0,
  `CREDIT_AMOUNT` varchar(255) NOT NULL,
  `TURN_AMOUNT` varchar(255) NOT NULL,
  `TURN_DATETIME` datetime NOT NULL,
  `TURN_BETAMOUNT` varchar(255) DEFAULT '0',
  `TURN_BETWIN` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `credit_turnover`
--

INSERT INTO `credit_turnover` (`ID`, `CustomerID`, `WITHDRAW_TXID`, `TURN_STATUS`, `CREDIT_AMOUNT`, `TURN_AMOUNT`, `TURN_DATETIME`, `TURN_BETAMOUNT`, `TURN_BETWIN`) VALUES
(30287, 138503, 237371, 1, '3000', '0', '2021-02-17 06:06:13', '0', NULL),
(30288, 138503, 237372, 1, '3000', '0', '2021-02-17 06:14:46', '0', NULL),
(30289, 138503, 237373, 1, '3000', '0', '2021-02-17 06:18:10', '0', NULL),
(30290, 138503, 237374, 1, '3000', '0', '2021-02-17 06:22:17', '0', NULL),
(30291, 138503, 237375, 1, '3000', '0', '2021-02-17 06:29:07', '0', NULL),
(30292, 138503, 237376, 1, '3000', '0', '2021-02-17 06:32:46', '0', NULL),
(30293, 138503, 237377, 1, '3000', '0', '2021-02-17 06:48:05', '0', NULL),
(30294, 138503, 237378, 1, '3000', '0', '2021-02-17 06:52:32', '0', NULL),
(30295, 138503, 237379, 1, '3000', '0', '2021-02-17 06:54:02', '0', NULL),
(30296, 138503, 237380, 1, '3000', '0', '2021-02-17 06:58:10', '0', NULL),
(30297, 138503, 237381, 0, '3000', '0', '2021-02-17 06:59:25', '0', NULL),
(30298, 138510, 237387, 1, '50', '0', '2021-02-19 09:40:04', '0', NULL),
(30299, 138510, 237388, 1, '50.1', '0', '2021-02-19 09:44:46', '0', NULL),
(30300, 138510, 237389, 1, '50.1', '100.2', '2021-02-19 09:47:14', '0', NULL),
(30301, 138510, 237390, 1, '50.2', '200.8', '2021-02-19 09:50:02', '0', NULL),
(30302, 138510, 237391, 1, '50.25', '251.25', '2021-02-19 09:56:39', '0', NULL),
(30303, 138510, 237392, 1, '52.5', '2625', '2021-02-19 09:57:14', '0', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `credit_withdrawlog`
--

CREATE TABLE `credit_withdrawlog` (
  `CustomerID` int(11) NOT NULL,
  `WITHDRAW_TXID` int(11) NOT NULL,
  `WITHDRAW_AMOUNT` varchar(255) NOT NULL,
  `WITHDRAW_BEFORE` varchar(255) NOT NULL,
  `WITHDRAW_AFTER` varchar(255) NOT NULL,
  `WITHDRAW_DATETIME` datetime NOT NULL,
  `WITHDRAW_STATUS` int(1) NOT NULL,
  `WITHDRAW_STAFF` varchar(255) DEFAULT NULL,
  `WITHDRAW_TEXT` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) NOT NULL DEFAULT '0',
  `NOTIFIED` varchar(255) DEFAULT NULL,
  `REFID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `credit_withdrawlog`
--

INSERT INTO `credit_withdrawlog` (`CustomerID`, `WITHDRAW_TXID`, `WITHDRAW_AMOUNT`, `WITHDRAW_BEFORE`, `WITHDRAW_AFTER`, `WITHDRAW_DATETIME`, `WITHDRAW_STATUS`, `WITHDRAW_STAFF`, `WITHDRAW_TEXT`, `STATUS`, `NOTIFIED`, `REFID`) VALUES
(138510, 1, '308.15', '308.15', '0', '2021-02-19 10:47:08', 1, NULL, NULL, '0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `event_wheel`
--

CREATE TABLE `event_wheel` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `SL_USERNAME` varchar(255) DEFAULT NULL,
  `W_POINT` varchar(4) NOT NULL DEFAULT '0',
  `W_DATE` datetime DEFAULT NULL,
  `W_STATUS` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs_backend`
--

CREATE TABLE `logs_backend` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `TEXT` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BEFORE` varchar(2555) COLLATE utf8_unicode_ci DEFAULT NULL,
  `AFTER` varchar(2555) COLLATE utf8_unicode_ci DEFAULT NULL,
  `METHOD` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ADMIN` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DATETIME` datetime DEFAULT NULL,
  `USER_AGENT` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IP` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `logs_balance`
--

CREATE TABLE `logs_balance` (
  `CustomerID` int(11) NOT NULL,
  `SL_DEPOSIT` varchar(32) NOT NULL DEFAULT '0',
  `SL_WITHDRAW` varchar(32) NOT NULL DEFAULT '0',
  `SL_BALANCE` varchar(32) NOT NULL DEFAULT '0',
  `SL_BALANCE_OLD` varchar(32) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `logs_balance`
--

INSERT INTO `logs_balance` (`CustomerID`, `SL_DEPOSIT`, `SL_WITHDRAW`, `SL_BALANCE`, `SL_BALANCE_OLD`) VALUES
(138499, '0', '0', '0', '0'),
(138503, '20.00', '0', '20.00', '0'),
(138504, '20', '0', '20', '0'),
(138505, '0', '0', '20', '0'),
(138506, '0', '0', '0', '0'),
(138507, '0', '0', '0', '0'),
(138508, '0', '0', '0', '0'),
(138509, '0', '0', '0', '0'),
(138510, '0', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `logs_chgpassword`
--

CREATE TABLE `logs_chgpassword` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `SLOT_USER` varchar(255) DEFAULT NULL,
  `OLD_PASS` varchar(255) DEFAULT NULL,
  `NEW_PASS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `logs_chgpassword`
--

INSERT INTO `logs_chgpassword` (`ID`, `CustomerID`, `SLOT_USER`, `OLD_PASS`, `NEW_PASS`) VALUES
(1252, 138499, '2541687137', 'Daniel123', 'Daniel1235'),
(1253, 138499, 'mtx90905459707', 'Daniel1235', 'Daniel1236'),
(1254, 138502, 'mtx90989527029', 'Daniel123', 'Daniel1231'),
(1255, 138502, 'mtx90989527029', 'Daniel123', 'Daniel1231'),
(1256, 138502, 'mtx90989527029', 'Daniel123', 'Daniel1231'),
(1257, 138503, 'mtx90919401805', 'Daniel123', 'Daniel1231'),
(1258, 138503, 'mtx90919401805', 'Daniel1231', 'Daniel123');

-- --------------------------------------------------------

--
-- Table structure for table `logs_credit`
--

CREATE TABLE `logs_credit` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `SL_DEPOSIT` varchar(32) NOT NULL DEFAULT '0',
  `SL_WITHDRAW` varchar(32) NOT NULL DEFAULT '0',
  `SL_BALANCE` varchar(32) NOT NULL DEFAULT '0',
  `SL_DATE` datetime DEFAULT NULL,
  `SL_STAFF` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `logs_depositlog`
--

CREATE TABLE `logs_depositlog` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `DEPOSIT_TYPE` varchar(255) NOT NULL,
  `DEPOSIT_TXID` varchar(255) NOT NULL,
  `DEPOSIT_AMOUNT` varchar(32) NOT NULL,
  `WALLET_BEFORE` varchar(32) NOT NULL,
  `WALLET_AFTER` varchar(32) NOT NULL,
  `DEPOSIT_DATETIME` datetime NOT NULL,
  `DEPOSIT_STATUS` varchar(255) NOT NULL DEFAULT '2',
  `STAFF` varchar(255) DEFAULT NULL,
  `NOTIFIED` varchar(255) DEFAULT NULL,
  `DATE_NOT` datetime DEFAULT NULL,
  `REFID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `logs_depositlog`
--

INSERT INTO `logs_depositlog` (`ID`, `CustomerID`, `DEPOSIT_TYPE`, `DEPOSIT_TXID`, `DEPOSIT_AMOUNT`, `WALLET_BEFORE`, `WALLET_AFTER`, `DEPOSIT_DATETIME`, `DEPOSIT_STATUS`, `STAFF`, `NOTIFIED`, `DATE_NOT`, `REFID`) VALUES
(213527, 138505, 'wallet', 'eijkQrddgjj0d5wbbp', '10.00', '10', '20', '2021-02-19 06:54:54', '2', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `logs_panel`
--

CREATE TABLE `logs_panel` (
  `ID` int(11) NOT NULL,
  `LOG` varchar(255) DEFAULT NULL,
  `ADMIN` varchar(255) DEFAULT NULL,
  `USERAGENT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `logs_transferlog`
--

CREATE TABLE `logs_transferlog` (
  `CustomerID` int(11) NOT NULL,
  `WITHDRAW_TYPE` varchar(255) NOT NULL,
  `WITHDRAW_TXID` int(11) NOT NULL,
  `WITHDRAW_AMOUNT` varchar(255) NOT NULL,
  `WITHDRAW_BEFORE` varchar(255) NOT NULL,
  `WITHDRAW_AFTER` varchar(255) NOT NULL,
  `WITHDRAW_DATETIME` datetime NOT NULL,
  `WITHDRAW_STATUS` int(1) NOT NULL DEFAULT 0,
  `TURNOVER_ID` int(11) DEFAULT NULL,
  `WITHDRAW_REF` varchar(255) DEFAULT NULL,
  `BONUS_ID` int(11) DEFAULT 0,
  `REFID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `logs_transferlog`
--

INSERT INTO `logs_transferlog` (`CustomerID`, `WITHDRAW_TYPE`, `WITHDRAW_TXID`, `WITHDRAW_AMOUNT`, `WITHDRAW_BEFORE`, `WITHDRAW_AFTER`, `WITHDRAW_DATETIME`, `WITHDRAW_STATUS`, `TURNOVER_ID`, `WITHDRAW_REF`, `BONUS_ID`, `REFID`) VALUES
(138503, 'mafiatx909', 237371, '300', '600', '300', '2021-02-17 06:06:12', 0, NULL, NULL, 0, NULL),
(138503, 'mafiatx909', 237372, '300', '600', '300', '2021-02-19 06:14:45', 0, 30288, NULL, 0, NULL),
(138503, 'mafiatx909', 237373, '300', '600', '300', '2021-02-17 06:18:08', 0, 30289, NULL, 0, NULL),
(138503, 'mafiatx909', 237374, '300', '600', '300', '2021-02-17 06:22:16', 0, 30290, NULL, 0, NULL),
(138503, 'mafiatx909', 237375, '300', '600', '300', '2021-02-17 06:29:06', 3, 30291, NULL, 0, NULL),
(138503, 'mafiatx909', 237376, '300', '600', '300', '2021-02-17 06:32:44', 3, 30292, NULL, 0, NULL),
(138503, 'mafiatx909', 237377, '300', '600', '300', '2021-02-17 06:48:04', 3, 30293, NULL, 0, NULL),
(138503, 'mafiatx909', 237378, '300', '600', '300', '2021-02-17 06:52:31', 0, 30294, NULL, 0, NULL),
(138503, 'mafiatx909', 237379, '300', '600', '300', '2021-02-17 06:54:01', 0, 30295, NULL, 0, NULL),
(138503, 'mafiatx909', 237380, '300', '600', '300', '2021-02-17 06:58:09', 0, 30296, NULL, 0, NULL),
(138503, 'mafiatx909', 237381, '300', '600', '300', '2021-02-17 06:59:24', 0, 30297, NULL, 0, NULL),
(138510, 'mafiatx909', 237388, '5', '600', '595', '2021-02-19 09:44:45', 0, 30299, NULL, 0, NULL),
(138510, 'mafiatx909', 237389, '5', '600', '595', '2021-02-19 09:47:13', 0, 30300, NULL, 0, NULL),
(138510, 'mafiatx909', 237390, '5', '600', '595', '2021-02-19 09:50:01', 0, 30301, NULL, 0, NULL),
(138510, 'mafiatx909', 237391, '5', '600', '595', '2021-02-19 09:56:38', 0, 30302, NULL, 0, NULL),
(138510, 'mafiatx909', 237392, '5', '600', '595', '2021-02-19 09:57:13', 0, 30303, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2019_08_19_000000_create_failed_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `table_agent`
--

CREATE TABLE `table_agent` (
  `ID` int(11) NOT NULL,
  `AGENT` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `PERCENT` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0',
  `CONTENT` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0',
  `IMAGE` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '1',
  `DISABLED` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `table_coupon`
--

CREATE TABLE `table_coupon` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `CODE` varchar(255) DEFAULT NULL,
  `AMOUNT` varchar(255) DEFAULT '50',
  `MIN` varchar(255) DEFAULT '1',
  `MAX` varchar(255) DEFAULT '1',
  `STATUS` varchar(255) DEFAULT '0',
  `DATE_TIME` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `table_expenditure`
--

CREATE TABLE `table_expenditure` (
  `ID` int(11) NOT NULL,
  `DATE_TIME` datetime DEFAULT NULL,
  `LIST` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `AMOUNT` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `table_summary`
--

CREATE TABLE `table_summary` (
  `ID` int(11) NOT NULL,
  `USER_REGISTER` varchar(255) DEFAULT '0',
  `CREDITFREE` varchar(255) DEFAULT '0',
  `FIRST_DEPOSIT` varchar(255) DEFAULT '0',
  `BONUS_PRO` varchar(255) DEFAULT '0',
  `EVENT_CREDITFREE` varchar(255) DEFAULT '0',
  `DEPOSIT_COUNT` varchar(255) DEFAULT '0',
  `WITHDRAW_COUNT` varchar(255) DEFAULT '0',
  `TOTAL_DEPOSIT` varchar(255) DEFAULT '0',
  `TOTAL_WITHDRAW` varchar(255) DEFAULT '0',
  `TOTAL_WINLOSS` varchar(255) DEFAULT '0',
  `TOTAL_INCOME` varchar(255) DEFAULT NULL,
  `LOGIN_DAY` varchar(255) DEFAULT '0',
  `DATE_TIME` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `table_winloss`
--

CREATE TABLE `table_winloss` (
  `ID` int(11) NOT NULL,
  `AGENT` varchar(255) DEFAULT NULL,
  `DATE_TIME` datetime DEFAULT NULL,
  `WINLOSS` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0',
  `AMOUNT` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_affiliate`
--
ALTER TABLE `account_affiliate`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD UNIQUE KEY `ACC_ID` (`CustomerID`) USING BTREE;

--
-- Indexes for table `account_session`
--
ALTER TABLE `account_session`
  ADD PRIMARY KEY (`CustomerID`) USING BTREE;

--
-- Indexes for table `account_statuslog`
--
ALTER TABLE `account_statuslog`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `account_users`
--
ALTER TABLE `account_users`
  ADD PRIMARY KEY (`CustomerID`) USING BTREE,
  ADD UNIQUE KEY `SL_USERNAME` (`SLOT_USER`,`SL_USERNAME`,`SL_BANKID`) USING BTREE,
  ADD KEY `CustomerID` (`CustomerID`,`SLOT_USER`(191),`SL_USERNAME`(191)) USING BTREE;

--
-- Indexes for table `bank_information`
--
ALTER TABLE `bank_information`
  ADD PRIMARY KEY (`BANK_ID`) USING BTREE;

--
-- Indexes for table `bank_setting`
--
ALTER TABLE `bank_setting`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `bank_transaction`
--
ALTER TABLE `bank_transaction`
  ADD PRIMARY KEY (`DEPOSIT_ID`) USING BTREE,
  ADD UNIQUE KEY `DEPOSIT_WALLET_ID` (`DEPOSIT_WALLET_ID`) USING BTREE;

--
-- Indexes for table `bonus_settings`
--
ALTER TABLE `bonus_settings`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `codesms_setting`
--
ALTER TABLE `codesms_setting`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `credit_freelog`
--
ALTER TABLE `credit_freelog`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD UNIQUE KEY `FREE_CODE` (`FREE_CODE`) USING BTREE;

--
-- Indexes for table `credit_turnover`
--
ALTER TABLE `credit_turnover`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `ACC_ID` (`WITHDRAW_TXID`,`TURN_STATUS`,`CustomerID`,`ID`) USING BTREE;

--
-- Indexes for table `credit_withdrawlog`
--
ALTER TABLE `credit_withdrawlog`
  ADD PRIMARY KEY (`WITHDRAW_TXID`) USING BTREE,
  ADD UNIQUE KEY `REFID` (`REFID`) USING BTREE,
  ADD KEY `ACC_ID` (`CustomerID`,`WITHDRAW_TXID`,`WITHDRAW_DATETIME`) USING BTREE;

--
-- Indexes for table `event_wheel`
--
ALTER TABLE `event_wheel`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs_backend`
--
ALTER TABLE `logs_backend`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `logs_balance`
--
ALTER TABLE `logs_balance`
  ADD PRIMARY KEY (`CustomerID`) USING BTREE;

--
-- Indexes for table `logs_chgpassword`
--
ALTER TABLE `logs_chgpassword`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `logs_credit`
--
ALTER TABLE `logs_credit`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `logs_depositlog`
--
ALTER TABLE `logs_depositlog`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD UNIQUE KEY `DEPOSIT_TXID` (`DEPOSIT_TXID`) USING BTREE,
  ADD KEY `CustomerID` (`CustomerID`,`DEPOSIT_TYPE`(191),`DEPOSIT_DATETIME`,`DEPOSIT_TXID`(191),`DEPOSIT_AMOUNT`) USING BTREE;

--
-- Indexes for table `logs_panel`
--
ALTER TABLE `logs_panel`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `logs_transferlog`
--
ALTER TABLE `logs_transferlog`
  ADD PRIMARY KEY (`WITHDRAW_TXID`) USING BTREE,
  ADD UNIQUE KEY `REFID` (`REFID`) USING BTREE,
  ADD KEY `WITHDRAW_TXID` (`CustomerID`,`WITHDRAW_TXID`,`TURNOVER_ID`) USING BTREE;

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `table_agent`
--
ALTER TABLE `table_agent`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `table_coupon`
--
ALTER TABLE `table_coupon`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD UNIQUE KEY `CODE` (`CODE`) USING BTREE;

--
-- Indexes for table `table_expenditure`
--
ALTER TABLE `table_expenditure`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `table_summary`
--
ALTER TABLE `table_summary`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `table_winloss`
--
ALTER TABLE `table_winloss`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_affiliate`
--
ALTER TABLE `account_affiliate`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `account_statuslog`
--
ALTER TABLE `account_statuslog`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120661;

--
-- AUTO_INCREMENT for table `account_users`
--
ALTER TABLE `account_users`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138511;

--
-- AUTO_INCREMENT for table `bank_information`
--
ALTER TABLE `bank_information`
  MODIFY `BANK_ID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `bank_setting`
--
ALTER TABLE `bank_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `bank_transaction`
--
ALTER TABLE `bank_transaction`
  MODIFY `DEPOSIT_ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `bonus_settings`
--
ALTER TABLE `bonus_settings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `codesms_setting`
--
ALTER TABLE `codesms_setting`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `credit_freelog`
--
ALTER TABLE `credit_freelog`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `credit_turnover`
--
ALTER TABLE `credit_turnover`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30304;

--
-- AUTO_INCREMENT for table `credit_withdrawlog`
--
ALTER TABLE `credit_withdrawlog`
  MODIFY `WITHDRAW_TXID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_wheel`
--
ALTER TABLE `event_wheel`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1985;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs_backend`
--
ALTER TABLE `logs_backend`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25783;

--
-- AUTO_INCREMENT for table `logs_chgpassword`
--
ALTER TABLE `logs_chgpassword`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1259;

--
-- AUTO_INCREMENT for table `logs_credit`
--
ALTER TABLE `logs_credit`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `logs_depositlog`
--
ALTER TABLE `logs_depositlog`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213528;

--
-- AUTO_INCREMENT for table `logs_transferlog`
--
ALTER TABLE `logs_transferlog`
  MODIFY `WITHDRAW_TXID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237393;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `table_agent`
--
ALTER TABLE `table_agent`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `table_coupon`
--
ALTER TABLE `table_coupon`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `table_expenditure`
--
ALTER TABLE `table_expenditure`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `table_summary`
--
ALTER TABLE `table_summary`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `table_winloss`
--
ALTER TABLE `table_winloss`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
