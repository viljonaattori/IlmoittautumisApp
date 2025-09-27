-- --------------------------------------------------------
-- Verkkotietokone:              127.0.0.1
-- Palvelinversio:               11.2.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versio:              12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for taulu ilmoittautumisapp.invite
CREATE TABLE IF NOT EXISTS `invite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_id` int(11) NOT NULL,
  `token` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `fk_invite_team` (`team_id`),
  CONSTRAINT `fk_invite_team` FOREIGN KEY (`team_id`) REFERENCES `joukkueet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.invite: ~19 rows (suunnilleen)
INSERT INTO `invite` (`id`, `team_id`, `token`, `created_at`, `expires_at`, `used`) VALUES
	(1, 4, 'aa690e9a-3b79-4a44-9803-fdb218ece346', '2025-09-12 05:21:27', '2025-09-19 05:21:27', 0),
	(2, 4, 'e1e82092-2bd0-40b1-83fe-33070323fa3b', '2025-09-12 05:23:25', '2025-09-19 05:23:25', 0),
	(3, 4, '2b827af5-9126-41e7-901b-22e417505dd3', '2025-09-12 05:23:57', '2025-09-19 05:23:57', 0),
	(5, 4, 'dd4c1434-3d89-469a-804c-41b517d443b4', '2025-09-12 09:31:59', '2025-09-19 09:31:59', 0),
	(6, 4, '41e575d9-f5cf-4ba6-8488-898671aa9a42', '2025-09-12 09:32:07', '2025-09-19 09:32:07', 0),
	(7, 4, '831bc267-a2d7-45d3-82f2-ba82cc477eff', '2025-09-12 09:32:24', '2025-09-19 09:32:24', 0),
	(8, 4, '0012cb80-b47d-4af2-9cfd-2d765b7fdfff', '2025-09-12 09:33:09', '2025-09-19 09:33:09', 0),
	(9, 4, 'e815d361-84a6-4b9f-8733-178a4336ec5b', '2025-09-12 11:19:11', '2025-09-19 11:19:11', 0),
	(10, 4, '3e61e670-1eec-40cb-81a9-56bc0bf79a53', '2025-09-12 11:22:17', '2025-09-19 11:22:17', 0),
	(11, 4, '55bbbbe6-cf5a-4d86-9162-f7d77b504962', '2025-09-12 11:28:29', '2025-09-19 11:28:29', 0),
	(12, 4, '8f850e85-ae7d-4ae7-8916-687de102cedb', '2025-09-12 11:30:33', '2025-09-19 11:30:33', 0),
	(13, 4, 'a53b4f20-3149-4ec4-95c8-73c97a5deba1', '2025-09-12 11:31:06', '2025-09-19 11:31:06', 0),
	(14, 4, '90e931aa-c080-44ac-991d-6ed2d116a5fe', '2025-09-14 04:53:43', '2025-09-21 04:53:43', 0),
	(15, 4, 'b1c98458-568d-494a-8dda-15cc640dc86d', '2025-09-14 05:24:28', '2025-09-21 05:24:28', 1),
	(16, 11, 'aa003735-a7c6-4ae1-a5ee-3540a564d56d', '2025-09-15 12:34:05', '2025-09-22 12:34:05', 0),
	(17, 11, 'e91c2e93-222a-4258-95b4-4a0f20babc11', '2025-09-15 12:36:34', '2025-09-22 12:36:34', 0),
	(18, 11, 'c83042be-4687-4834-a398-7f7f80df3afb', '2025-09-15 12:44:20', '2025-09-22 12:44:20', 1),
	(20, 4, '96412fa0-ee52-447f-8dfa-af5b6ffb01fb', '2025-09-16 10:37:39', '2025-09-23 10:37:39', 0),
	(21, 4, '13dc242a-052c-473f-b545-a80ba5a53cb2', '2025-09-16 10:37:43', '2025-09-23 10:37:43', 0);

-- Dumping structure for taulu ilmoittautumisapp.joukkueet
CREATE TABLE IF NOT EXISTS `joukkueet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(200) NOT NULL,
  `ylläpitäjä_id` int(11) DEFAULT NULL,
  `luotu` timestamp NULL DEFAULT current_timestamp(),
  `kuvaus` text DEFAULT NULL,
  `kuva` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ylläpitäjä_id` (`ylläpitäjä_id`),
  CONSTRAINT `joukkueet_ibfk_1` FOREIGN KEY (`ylläpitäjä_id`) REFERENCES `käyttäjät` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.joukkueet: ~10 rows (suunnilleen)
INSERT INTO `joukkueet` (`id`, `nimi`, `ylläpitäjä_id`, `luotu`, `kuvaus`, `kuva`) VALUES
	(1, 'Jokipojat U20', 9, '2025-08-31 17:45:17', NULL, NULL),
	(2, 'Karelia U15', 9, '2025-08-31 17:45:17', NULL, NULL),
	(3, 'Salibandy Naiset', 9, '2025-08-31 17:45:17', NULL, NULL),
	(4, 'PoU edustus', 15, '2025-08-31 17:46:32', 'Polvijärven jääkiekko edustusjoukkue', '/uploads/teams/1758707569643.png'),
	(5, 'Viu', 9, '2025-08-31 17:46:32', NULL, NULL),
	(6, 'Kataja U12', 9, '2025-08-31 17:46:32', NULL, NULL),
	(11, 'Vaivion Tarmo', 23, '2025-09-15 12:33:41', NULL, NULL),
	(14, 'Leki-75', 28, '2025-09-16 10:40:01', NULL, '/uploads/teams/1758711250114.png'),
	(16, 'tuukan joukkue', 32, '2025-09-23 05:55:22', NULL, NULL),
	(17, 'nokia551@', 33, '2025-09-23 05:57:55', 'tuukka', NULL);

-- Dumping structure for taulu ilmoittautumisapp.käyttäjät
CREATE TABLE IF NOT EXISTS `käyttäjät` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `salasana_hash` varchar(255) NOT NULL,
  `nimi` varchar(120) NOT NULL,
  `joukkue_id` int(11) DEFAULT NULL,
  `luotu` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `joukkue_id` (`joukkue_id`),
  CONSTRAINT `käyttäjät_ibfk_1` FOREIGN KEY (`joukkue_id`) REFERENCES `joukkueet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.käyttäjät: ~18 rows (suunnilleen)
INSERT INTO `käyttäjät` (`id`, `email`, `salasana_hash`, `nimi`, `joukkue_id`, `luotu`) VALUES
	(9, 'vili.auvinen@gmail.com', '$2b$10$S/iSAgpb5YpcGE.GHj7E5OlPSkE.Sn/P6FMhpK1frcXlXcqi80E8K', 'Viljonaattori', 5, '2025-08-31 12:04:09'),
	(11, 'Pinja.Luotolampi@gmail.com', '$2b$10$JSoP6J2idp40ImTpGxfBqefKL5InjHg8UbpWt4lxLzgHyP86C2tF2', 'Pinja Luotolampi', 5, '2025-08-31 15:03:18'),
	(12, 'Mikko.kurvinen@are.fi', '$2b$10$FTm.vrqpbmw9XKqPV08isu1ago.JcWVglCPFNa9bdSA5Li76Z40Ja', 'Mikko Kurvinen', 1, '2025-08-31 15:06:45'),
	(13, 'Testi2@testi.outlook.com', '$2b$10$0viq5MtWCBl4MTmuIQzVzOnm0dMqapEUp/TpJVU4wglt76YK8hqD.', 'testi käyttäjä', 2, '2025-08-31 15:13:05'),
	(14, 'testi3.testi3@gmail.com', '$2b$10$sfoh7brnnD0ExVVYbhH3c.KojBTJxhiO.VOdOo0b9f5L1uYQ44Jki', 'Matti Meikäläinen', 4, '2025-09-01 09:55:53'),
	(15, 'wili.auvinen@gmail.com', '$2b$10$/RmnHUYi9g5cTKT2Qk7uLeAoWusXAcQo.A1cUxODxLUuMKhhnVRf.', 'Vili Auvinen', 4, '2025-09-01 10:45:46'),
	(16, 'ville.matti@gmail.com', '$2b$10$hFzKOl3v31ywp/oJeaUQju6v8moL/OyI/MFTVEfky915DtgNdFo/C', 'Ville-matti', 5, '2025-09-02 11:43:18'),
	(18, 'viljami.perttula@email.com', '$2b$10$4oKC5a7P9vLup.7bnM94OerW9aaX2mMsro2UCpygoC4datFnp/bUq', 'Perttu Laurila', 4, '2025-09-09 12:25:00'),
	(19, 'Santtu.XÅÅÅL@hotmail.com', '$2b$10$cAZJulGtzRzugv0CYBFtAOSJT5M24o8BOsNFnuh1kjvJ90uJ2xB0u', 'Santtu Nykänen', 4, '2025-09-12 08:49:29'),
	(20, 'Jare.villegalle@gmail.com', '$2b$10$njIxj4oqg06xwfbrEVXdDuTVGEIYUgMmEDmeNkUW.HR9cUbHvHgZi', 'JVG', 4, '2025-09-14 01:55:07'),
	(21, 'rene.kuikka@hotmail.com', '$2b$10$iwHcNCYLfgZW7TqUE52TReUIhOZu56ETIEl1K4zAe8S6i4nlCzsAC', 'Rene Kuikka', 4, '2025-09-14 02:25:06'),
	(22, 'joonasmustimustonen@gmail.com', '$2b$10$nWqx3wSsrTwlHujZPNqMbOjeLtDjjhsKxtK.61eqTxP9cnrKrXUOW', 'Jones mustonen', 2, '2025-09-15 09:23:17'),
	(23, 'joonas.mustonen@gmail.com', '$2b$10$ooGTIS.c9jGsB9OIa7fnQeXkG5vqPO25hVQF5EjVGbRG4RqXsl6My', 'Joonas Mustonen', 11, '2025-09-15 09:33:41'),
	(24, 'Jouni.auvinen@gmail.com', '$2b$10$CPfjqrHdPYscry5/kcjjkul6KPrMplYT8z/e3YElseguC3PSkJqzS', 'Jouni Auvinen', 11, '2025-09-15 09:44:44'),
	(28, 'perttu.pelkonen@gmail.com', '$2b$10$fZkJAS5w/.LMmRvJA5pqC.3yCJHlEgVmEiNlpICBEnfv03J8oH3Ki', 'perttu pelkonen', 14, '2025-09-16 10:40:01'),
	(29, 'testi@example.com', '$2b$10$nRjryqE/ZbAmVdg4V7BjRedxi1jT3jltViZ5KT26FGok9LsFltOim', 'TestimiesMakkonen', 4, '2025-09-17 08:32:30'),
	(32, 'tuukka.tiainen@gmail.com', '$2b$10$ftGLT1kZRuSxzQwFz.TsDuudENnOg73LWVo/dyobNGLSi7coU41o6', 'tuukka tiainen', 16, '2025-09-23 05:55:22'),
	(33, 'testi.tuukka@gmail.com', '$2b$10$Mt/SVdBJDAoKrF6WxWT2L.lSRNxJW77wl6wk.NOuCMlrAjbrTp9Eu', 'tuukka vaan', 17, '2025-09-23 05:57:55');

-- Dumping structure for taulu ilmoittautumisapp.osallistumiset
CREATE TABLE IF NOT EXISTS `osallistumiset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tapahtuma_id` int(11) NOT NULL,
  `kayttaja_id` int(11) NOT NULL,
  `status` enum('osallistun','en_osallistu') NOT NULL,
  `paivitetty` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_rsvp` (`tapahtuma_id`,`kayttaja_id`),
  KEY `kayttaja_id` (`kayttaja_id`),
  CONSTRAINT `osallistumiset_ibfk_1` FOREIGN KEY (`tapahtuma_id`) REFERENCES `tapahtumat` (`id`) ON DELETE CASCADE,
  CONSTRAINT `osallistumiset_ibfk_2` FOREIGN KEY (`kayttaja_id`) REFERENCES `käyttäjät` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.osallistumiset: ~10 rows (suunnilleen)
INSERT INTO `osallistumiset` (`id`, `tapahtuma_id`, `kayttaja_id`, `status`, `paivitetty`) VALUES
	(1, 7, 15, 'en_osallistu', '2025-09-07 10:34:34'),
	(3, 6, 15, 'osallistun', '2025-09-07 10:28:57'),
	(42, 10, 15, 'osallistun', '2025-09-09 14:34:50'),
	(51, 12, 20, 'osallistun', '2025-09-14 04:55:39'),
	(52, 6, 20, 'osallistun', '2025-09-14 04:55:40'),
	(53, 16, 20, 'en_osallistu', '2025-09-14 04:55:40'),
	(54, 12, 21, 'en_osallistu', '2025-09-14 05:25:24'),
	(55, 6, 21, 'en_osallistu', '2025-09-14 05:25:25'),
	(56, 16, 21, 'en_osallistu', '2025-09-14 05:25:26'),
	(154, 49, 15, 'osallistun', '2025-09-27 04:14:57');

-- Dumping structure for taulu ilmoittautumisapp.password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `käyttäjät` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.password_resets: ~5 rows (suunnilleen)
INSERT INTO `password_resets` (`id`, `user_id`, `token`, `expires_at`) VALUES
	(1, 15, 'c1d3e5832b71f079e776798c1c7bee07a95c09e52f3966e89ffc2e0360d847ca', '2025-09-25 12:51:06'),
	(2, 15, '40f435b9143f68e6c0521bf313ad318ba57b175efea2c506a420cf9dceedb49f', '2025-09-25 13:00:46'),
	(3, 15, 'c46e92eb79aaf69c003c8ded3d3021ece127f401ceb808d3bdac29ce5e6a1458', '2025-09-25 13:01:22'),
	(4, 15, 'b2e5ed83864d4f60312d6eebdc508f5c49fbd56d2a8a8b4dd456402e37df6ac4', '2025-09-25 13:05:07'),
	(6, 15, 'c8f3078973c28ffc90d45f3859fbba74e2ee2da17134fcc7424b8219ce425d70', '2025-09-25 14:30:10');

-- Dumping structure for taulu ilmoittautumisapp.tapahtumat
CREATE TABLE IF NOT EXISTS `tapahtumat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joukkue_id` int(11) NOT NULL,
  `tyyppi` enum('harjoitus','peli','palaveri','kokous') NOT NULL,
  `paikka` varchar(255) NOT NULL,
  `aika` datetime NOT NULL,
  `kuvaus` text DEFAULT NULL,
  `luotu` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `joukkue_id` (`joukkue_id`),
  CONSTRAINT `tapahtumat_ibfk_1` FOREIGN KEY (`joukkue_id`) REFERENCES `joukkueet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ilmoittautumisapp.tapahtumat: ~29 rows (suunnilleen)
INSERT INTO `tapahtumat` (`id`, `joukkue_id`, `tyyppi`, `paikka`, `aika`, `kuvaus`, `luotu`) VALUES
	(1, 1, 'harjoitus', 'Urheiluhalli A', '2025-09-10 18:00:00', 'Viikon perusharjoitukset', '2025-09-07 07:01:14'),
	(2, 1, 'peli', 'Keskuskenttä', '2025-09-14 15:00:00', 'Sarjapeli vastustajaa FC Testi vastaan', '2025-09-07 07:01:14'),
	(3, 1, 'palaveri', 'Seurakoti', '2025-09-08 19:00:00', 'Pelitaktiikan läpikäynti', '2025-09-07 07:01:14'),
	(4, 2, 'kokous', 'Joukkueen toimisto', '2025-09-12 17:30:00', 'Vanhempainkokous ja kauden suunnittelu', '2025-09-07 07:01:14'),
	(5, 2, 'harjoitus', 'Koulun sali', '2025-09-13 18:00:00', 'Sisäharjoitukset sateen takia', '2025-09-07 07:01:14'),
	(6, 4, 'peli', 'Stadion B', '2025-09-20 16:00:00', 'Harjoitusottelu naapurijoukkuetta vastaan', '2025-09-07 07:01:14'),
	(7, 4, 'palaveri', 'Zoom', '2025-09-09 20:00:00', 'Etäpalaveri ennen peliä', '2025-09-07 07:01:14'),
	(9, 4, 'harjoitus', 'Urheiluhalli A', '2025-09-01 18:00:00', 'Viikon perusharjoitukset', '2025-09-07 08:00:56'),
	(10, 4, 'harjoitus', 'Kuntosali energy', '2025-09-09 17:35:00', 'Kuntosali VOIMA', '2025-09-09 14:34:16'),
	(11, 4, 'harjoitus', 'Kuntosali energy', '2025-09-09 17:35:00', 'Kuntosali VOIMA', '2025-09-09 15:11:15'),
	(12, 4, 'peli', 'Keskuskenttä', '2025-09-14 15:00:00', 'Sarjapeli vastustajaa FC Testi vastaan', '2025-09-09 15:11:15'),
	(13, 4, 'palaveri', 'Seurakoti', '2025-09-08 19:00:00', 'Pelitaktiikan läpikäynti', '2025-09-09 15:11:15'),
	(14, 4, 'kokous', 'Joukkueen toimisto', '2025-09-12 17:30:00', 'Vanhempainkokous ja kauden suunnittelu', '2025-09-09 15:11:15'),
	(15, 4, 'harjoitus', 'Koulun sali', '2025-09-13 18:00:00', 'Sisäharjoitukset sateen takia', '2025-09-09 15:11:15'),
	(16, 4, 'peli', 'Stadion B', '2025-09-20 16:00:00', 'Harjoitusottelu naapurijoukkuetta vastaan', '2025-09-09 15:11:15'),
	(17, 4, 'palaveri', 'Zoom', '2025-09-09 20:00:00', 'Etäpalaveri ennen peliä', '2025-09-09 15:11:15'),
	(19, 4, 'kokous', 'Metsä', '2025-08-23 17:30:00', 'Tapaamme metsässä ja etsimme sieniä', '2025-09-09 15:19:57'),
	(20, 4, 'kokous', 'Metsä', '2025-08-23 17:30:00', 'Tapaamme metsässä ja etsimme sieniä', '2025-09-09 15:20:07'),
	(21, 4, 'harjoitus', 'Metsä', '2025-09-10 17:30:00', 'Tapaamme metsässä ja etsimme sieniä', '2025-09-09 15:21:07'),
	(22, 4, 'harjoitus', 'Metsä', '2025-09-10 17:30:00', 'Tapaamme metsässä ja etsimme sieniä', '2025-09-09 15:22:51'),
	(23, 4, 'harjoitus', 'Uimaranta', '2025-09-12 20:26:00', 'Menemme pelaamaan Biitsiä', '2025-09-09 15:23:38'),
	(25, 4, 'harjoitus', 'testi data', '2025-09-15 15:35:00', NULL, '2025-09-15 12:35:14'),
	(26, 11, 'harjoitus', 'testi data', '2025-09-15 15:44:00', NULL, '2025-09-15 12:35:55'),
	(37, 4, 'peli', 'Hurtat', '2025-09-13 08:28:00', 'Harjoitusottelu', '2025-09-16 05:28:22'),
	(42, 4, 'harjoitus', 'Outokumpu', '2025-09-20 08:58:00', NULL, '2025-09-16 05:58:29'),
	(43, 4, 'harjoitus', 'ttest', '2025-09-15 08:58:00', NULL, '2025-09-16 05:58:53'),
	(44, 14, 'harjoitus', 'testi data', '2025-09-27 13:40:00', NULL, '2025-09-16 10:40:27'),
	(45, 14, 'harjoitus', 'testi data', '2025-09-03 13:40:00', NULL, '2025-09-16 10:40:38'),
	(49, 4, 'peli', 'Polvijärvi', '2025-09-27 16:00:00', NULL, '2025-09-27 04:14:49');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
