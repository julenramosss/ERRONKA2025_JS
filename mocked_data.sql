-- ================================================================
-- pakAG - Proba Datuak (Seed Script)
-- ================================================================
--
-- GARAPEN INGURUNEAN BAKARRIK - ez erabili produkzioan.
--
-- Pasahitza erabiltzaile guztientzat: Test1234!
-- Hash-a:
--   $2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC
--
-- Datak CURRENT_DATE / NOW() erabilita kalkulatzen dira, seed-a
-- edozein egunetan exekutatuta ere atzo, gaur, bihar eta etziko
-- datuak edukitzeko.
-- ================================================================

USE erronka;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE route_stops;
TRUNCATE TABLE routes;
TRUNCATE TABLE package_status_logs;
TRUNCATE TABLE tokens;
TRUNCATE TABLE packages;
TRUNCATE TABLE addresses;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;


-- ================================================================
-- 1. USERS
-- Ez aldatu: erabiltzaileak bere horretan mantentzen dira.
-- User 5 inaktibo dago eta ez dauka paketerik ez ibilbiderik.
-- ================================================================
INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES
  (1, 'Julen Ramos Tolosa',        'julenramostolosa@gmail.com',        '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'admin',       TRUE,  NOW() - INTERVAL 6 MONTH),
  (2, 'Alejandro Ariza Aguilar',   'alejandroarizaaguilar@gmail.com',   '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', TRUE,  NOW() - INTERVAL 4 MONTH),
  (3, 'Sergio Rocha Tolosaldea',   'sergiotolosaldea@gmail.com',        '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', TRUE,  NOW() - INTERVAL 3 MONTH),
  (4, 'Julen Ramos Arruti',        'jramosarruti@gmail.com',            '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', TRUE,  NOW() - INTERVAL 2 MONTH),
  (5, 'Penelope Garcia',           'penelopeg@gmail.com',               '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', FALSE, NOW() - INTERVAL 5 MONTH);


-- ================================================================
-- 2. ADDRESSES
-- Gipuzkoa inguruko helbide errealistak eta koordenatu koherenteak.
-- ================================================================
INSERT INTO addresses (id, street, city, postal_code, country, latitude, longitude, created_at) VALUES
  (1,  'Kale Nagusia 12',           'Donostia-San Sebastian', '20001', 'Espana', 43.3183000, -1.9812000, CURRENT_DATE - INTERVAL 12 DAY + INTERVAL 8 HOUR),
  (2,  'Avenida de la Libertad 45', 'Donostia-San Sebastian', '20004', 'Espana', 43.3225000, -1.9793000, CURRENT_DATE - INTERVAL 12 DAY + INTERVAL 8 HOUR),
  (3,  'Paseo de la Concha 8',      'Donostia-San Sebastian', '20007', 'Espana', 43.3178000, -1.9956000, CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 8 HOUR),
  (4,  'Calle Urbieta 23',          'Donostia-San Sebastian', '20006', 'Espana', 43.3199000, -1.9843000, CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 8 HOUR),
  (5,  'Etxe Zuri Kalea 7',         'Hernani',                '20120', 'Espana', 43.2698000, -1.9759000, CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 8 HOUR),
  (6,  'San Juan Plaza 3',          'Errenteria',             '20100', 'Espana', 43.3126000, -1.8988000, CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 8 HOUR),
  (7,  'Portuetxe Bidea 15',        'Donostia-San Sebastian', '20018', 'Espana', 43.2934000, -1.9658000, CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 8 HOUR),
  (8,  'Miraconcha Kalea 4',        'Donostia-San Sebastian', '20007', 'Espana', 43.3156000, -2.0012000, CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 8 HOUR),
  (9,  'Alkiza Bidea 22',           'Usurbil',                '20170', 'Espana', 43.2718000, -2.0245000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (10, 'San Martin Kalea 11',       'Tolosa',                 '20400', 'Espana', 43.1342000, -2.0765000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (11, 'Txara Kalea 33',            'Andoain',                '20140', 'Espana', 43.2261000, -2.0034000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (12, 'Irun Kalea 56',             'Irun',                   '20301', 'Espana', 43.3390000, -1.7890000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (13, 'Secundino Esnaola Kalea 14','Donostia-San Sebastian', '20001', 'Espana', 43.3230000, -1.9755000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (14, 'Zarautz Kalea 27',          'Donostia-San Sebastian', '20018', 'Espana', 43.3045000, -2.0151000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (15, 'Nafarroa Hiribidea 64',     'Beasain',                '20200', 'Espana', 43.0505000, -2.2001000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (16, 'Kale Nagusia 41',           'Ordizia',                '20240', 'Espana', 43.0542000, -2.1780000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (17, 'San Frantzisko Kalea 18',   'Tolosa',                 '20400', 'Espana', 43.1369000, -2.0739000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (18, 'Elkano Kalea 9',            'Zarautz',                '20800', 'Espana', 43.2840000, -2.1705000, CURRENT_DATE + INTERVAL 6 HOUR),
  (19, 'Hondarribia Kalea 2',       'Irun',                   '20301', 'Espana', 43.3402000, -1.7904000, CURRENT_DATE + INTERVAL 6 HOUR),
  (20, 'Biteri Kalea 31',           'Errenteria',             '20100', 'Espana', 43.3138000, -1.9026000, CURRENT_DATE + INTERVAL 6 HOUR),
  (21, 'Zubieta Kalea 19',          'Lasarte-Oria',           '20160', 'Espana', 43.2677000, -2.0214000, CURRENT_DATE + INTERVAL 6 HOUR),
  (22, 'Kale Nagusia 5',            'Oiartzun',               '20180', 'Espana', 43.2991000, -1.8605000, CURRENT_DATE + INTERVAL 6 HOUR),
  (23, 'San Pedro Kalea 6',         'Pasaia',                 '20110', 'Espana', 43.3253000, -1.9237000, CURRENT_DATE + INTERVAL 6 HOUR),
  (24, 'Legazpi Kalea 12',          'Azpeitia',               '20730', 'Espana', 43.1824000, -2.2664000, CURRENT_DATE + INTERVAL 6 HOUR),
  (25, 'Urdaneta Kalea 18',         'Azkoitia',               '20720', 'Espana', 43.1779000, -2.3117000, CURRENT_DATE + INTERVAL 6 HOUR),
  (26, 'Bidebarrieta Kalea 21',     'Eibar',                  '20600', 'Espana', 43.1846000, -2.4734000, CURRENT_DATE + INTERVAL 6 HOUR),
  (27, 'San Andres Kalea 7',        'Arrasate',               '20500', 'Espana', 43.0644000, -2.4898000, CURRENT_DATE + INTERVAL 6 HOUR),
  (28, 'Zumalakarregi Kalea 4',     'Bergara',                '20570', 'Espana', 43.1176000, -2.4138000, CURRENT_DATE + INTERVAL 6 HOUR),
  (29, 'Aita Larramendi Kalea 8',   'Andoain',                '20140', 'Espana', 43.2197000, -2.0195000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (30, 'Geltoki Kalea 10',          'Urnieta',                '20130', 'Espana', 43.2474000, -1.9916000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (31, 'Lugaritz Pasealekua 24',    'Donostia-San Sebastian', '20018', 'Espana', 43.3068000, -2.0056000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (32, 'Garibai Kalea 3',           'Donostia-San Sebastian', '20004', 'Espana', 43.3214000, -1.9810000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (33, 'San Inazio Kalea 22',       'Hernani',                '20120', 'Espana', 43.2671000, -1.9782000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (34, 'Poligono Belartza 2',       'Donostia-San Sebastian', '20018', 'Espana', 43.2870000, -2.0104000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (35, 'Araba Etorbidea 36',        'Zarautz',                '20800', 'Espana', 43.2818000, -2.1688000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (36, 'San Roke Kalea 15',         'Deba',                   '20820', 'Espana', 43.2959000, -2.3542000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (37, 'Erdiko Kalea 28',           'Elgoibar',               '20870', 'Espana', 43.2166000, -2.4133000, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (38, 'Arragueta Kalea 11',        'Eibar',                  '20600', 'Espana', 43.1840000, -2.4708000, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (39, 'San Migel Kalea 19',        'Onati',                  '20560', 'Espana', 43.0327000, -2.4110000, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (40, 'Barrenkale 4',              'Bergara',                '20570', 'Espana', 43.1168000, -2.4149000, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (41, 'Gipuzkoa Plaza 1',          'Donostia-San Sebastian', '20004', 'Espana', 43.3211000, -1.9817000, CURRENT_DATE + INTERVAL 10 HOUR),
  (42, 'Martutene Pasealekua 89',   'Donostia-San Sebastian', '20014', 'Espana', 43.2929000, -1.9542000, CURRENT_DATE + INTERVAL 10 HOUR),
  (43, 'Kale Berria 17',            'Hernani',                '20120', 'Espana', 43.2665000, -1.9747000, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 9 HOUR),
  (44, 'Kale Zaharra 6',            'Tolosa',                 '20400', 'Espana', 43.1377000, -2.0781000, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 16 HOUR + INTERVAL 30 MINUTE);


-- ================================================================
-- 3. PACKAGES
-- Statusak: pending, assigned, in_transit, delivered, failed.
-- Erabiltzaile aktiboak soilik: 2, 3 eta 4.
-- ================================================================
INSERT INTO packages (
  id, tracking_code, recipient_name, recipient_email, weight_kg, description,
  status, estimated_delivery, address_id, assigned_to, created_by, created_at, updated_at
) VALUES
  (1,  'PAK-20260001', 'Jon Arrizabalaga',  'julenramostolosa@gmail.com',  1.200, 'Liburu sorta txikia',               'delivered',  CURRENT_DATE - INTERVAL 10 DAY, 1,  2,    1, CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR,                        CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 10 HOUR + INTERVAL 25 MINUTE),
  (2,  'PAK-20260002', 'Miren Irazusta',    'julenramostolosa@gmail.com',    3.500, 'Etxeko tresna elektronikoa',        'delivered',  CURRENT_DATE - INTERVAL 10 DAY, 2,  2,    1, CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR + INTERVAL 15 MINUTE,   CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 11 HOUR + INTERVAL 5 MINUTE),
  (3,  'PAK-20260003', 'Itziar Goikoetxea', 'julenramostolosa@gmail.com',        0.800, 'Dokumentazio konfidentziala',        'delivered',  CURRENT_DATE - INTERVAL 8 DAY,  3,  3,    1, CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR,                         CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 9 HOUR + INTERVAL 45 MINUTE),
  (4,  'PAK-20260004', 'Xabier Beloki',     'julenramostolosa@gmail.com',   2.100, 'Kirol materiala',                    'delivered',  CURRENT_DATE - INTERVAL 8 DAY,  4,  3,    1, CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE,    CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 30 MINUTE),
  (5,  'PAK-20260005', 'Amaia Olano',       'julenramostolosa@gmail.com',       5.000, 'Sukaldeko pieza hauskorra',          'failed',     CURRENT_DATE - INTERVAL 6 DAY,  5,  2,    1, CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR,                         CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 11 HOUR + INTERVAL 40 MINUTE),
  (6,  'PAK-20260006', 'Josu Zabala',       'julenramostolosa@gmail.com',       1.800, 'Arropa paketea',                     'delivered',  CURRENT_DATE - INTERVAL 6 DAY,  6,  2,    1, CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE,     CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 12 HOUR + INTERVAL 15 MINUTE),
  (7,  'PAK-20260007', 'Nerea Eizaguirre',  'julenramostolosa@gmail.com',  0.600, 'Telefono osagarriak',                'delivered',  CURRENT_DATE - INTERVAL 4 DAY,  7,  4,    1, CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE,    CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 10 HOUR),
  (8,  'PAK-20260008', 'Peru Txurruka',     'julenramostolosa@gmail.com',     4.200, 'Bulegoko materiala',                 'delivered',  CURRENT_DATE - INTERVAL 4 DAY,  8,  4,    1, CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR + INTERVAL 20 MINUTE,    CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 45 MINUTE),
  (9,  'PAK-20260009', 'Ane Murua',         'julenramostolosa@gmail.com',         2.700, 'Oinetako kutxa',                     'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  9,  2,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 35 MINUTE),
  (10, 'PAK-20260010', 'Ibai Lekuona',      'julenramostolosa@gmail.com',    1.100, 'Mediku dokumentazioa',               'failed',     CURRENT_DATE - INTERVAL 1 DAY,  10, 2,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 20 MINUTE),
  (11, 'PAK-20260011', 'Saioa Aranburu',    'julenramostolosa@gmail.com',    3.300, 'Erosketa online handia',             'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  11, 2,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 11 HOUR + INTERVAL 45 MINUTE),
  (12, 'PAK-20260012', 'Unai Galdos',       'julenramostolosa@gmail.com',       0.900, 'Sinadura behar duen gutuna',         'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  12, 3,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE,     CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 25 MINUTE),
  (13, 'PAK-20260013', 'Lur Etxaniz',       'julenramostolosa@gmail.com',       2.450, 'Elektronika ordezkoak',              'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  13, 3,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE),
  (14, 'PAK-20260014', 'Markel Agirre',     'julenramostolosa@gmail.com',     6.400, 'Inprimagailu tonerra',               'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  14, 3,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 11 HOUR + INTERVAL 15 MINUTE),
  (15, 'PAK-20260015', 'June Alberdi',      'julenramostolosa@gmail.com',      1.750, 'Lagin komertzialak',                 'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  15, 4,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR,                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 20 MINUTE),
  (16, 'PAK-20260016', 'Oier Aranberri',    'julenramostolosa@gmail.com',    2.300, 'Tresna mekaniko txikiak',            'failed',     CURRENT_DATE - INTERVAL 1 DAY,  16, 4,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 40 MINUTE),
  (17, 'PAK-20260017', 'Leire Soroa',       'julenramostolosa@gmail.com',       0.950, 'Farmazia produktuak',                'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  17, 4,    1, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 40 MINUTE,    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 12 HOUR),
  (18, 'PAK-20260018', 'Maddi Egana',       'julenramostolosa@gmail.com',       1.600, 'Dokumentuak eta fakturak',           'delivered',  CURRENT_DATE,                   18, 2,    1, CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 35 MINUTE,                   CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 8 MINUTE),
  (19, 'PAK-20260019', 'Iker Olazabal',     'julenramostolosa@gmail.com',     4.850, 'Ordenagailu eramangarriaren kargagailua', 'in_transit', CURRENT_DATE,              19, 2,    1, CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 40 MINUTE,                   CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 25 MINUTE),
  (20, 'PAK-20260020', 'Ainhoa Sarasketa',  'julenramostolosa@gmail.com',  2.050, 'Arropa eta osagarriak',              'assigned',   CURRENT_DATE,                   20, 2,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 5 MINUTE,                    CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (21, 'PAK-20260021', 'Gaizka Iraola',     'julenramostolosa@gmail.com',     7.100, 'Biltegiko ordezko pieza',            'assigned',   CURRENT_DATE,                   21, 2,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE,                   CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (22, 'PAK-20260022', 'Nahia Etxeberria',  'julenramostolosa@gmail.com',  1.250, 'Lore dendarako hornidura',           'delivered',  CURRENT_DATE,                   22, 3,    1, CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 50 MINUTE,                   CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 38 MINUTE),
  (23, 'PAK-20260023', 'Asier Lizarralde',  'julenramostolosa@gmail.com',  3.750, 'Kristalezko osagarria',              'failed',     CURRENT_DATE,                   23, 3,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 10 MINUTE,                   CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 15 MINUTE),
  (24, 'PAK-20260024', 'Maialen Urkia',     'julenramostolosa@gmail.com',     0.700, 'Dokumentazio arina',                 'in_transit', CURRENT_DATE,                   24, 3,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 35 MINUTE,                   CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 50 MINUTE),
  (25, 'PAK-20260025', 'Eneko Aldalur',     'julenramostolosa@gmail.com',     5.250, 'Kirol ekipamendua',                  'assigned',   CURRENT_DATE,                   25, 3,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 55 MINUTE,                   CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (26, 'PAK-20260026', 'Garazi Otegi',      'julenramostolosa@gmail.com',      2.900, 'Tailerreko materiala',               'in_transit', CURRENT_DATE,                   26, 4,    1, CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 45 MINUTE,                   CURRENT_DATE + INTERVAL 9 HOUR),
  (27, 'PAK-20260027', 'Benat Azkarate',    'julenramostolosa@gmail.com',    1.050, 'Gutun ziurtatua',                    'assigned',   CURRENT_DATE,                   27, 4,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 5 MINUTE,                    CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (28, 'PAK-20260028', 'Irati Mendia',      'julenramostolosa@gmail.com',      6.800, 'Altzari pieza txikia',               'assigned',   CURRENT_DATE,                   28, 4,    1, CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE,                   CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (29, 'PAK-20260029', 'Olatz Arrieta',     'julenramostolosa@gmail.com',     1.900, 'Bihar entregatzeko dokumentuak',     'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   29, 2,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR,                        CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (30, 'PAK-20260030', 'Aitor Lasa',        'julenramostolosa@gmail.com',        3.400, 'Biltegiko eskaera',                  'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   30, 2,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
  (31, 'PAK-20260031', 'Maitane Rueda',     'julenramostolosa@gmail.com',     0.650, 'Gutun premiazkoa',                   'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   31, 2,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (32, 'PAK-20260032', 'Inigo Arregi',      'julenramostolosa@gmail.com',      2.200, 'Denda eskaera txikia',               'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   32, 3,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE,    CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (33, 'PAK-20260033', 'Uxue Plazaola',     'julenramostolosa@gmail.com',     8.000, 'Produktu industrial arina',          'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   33, 3,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (34, 'PAK-20260034', 'Koldo Araneta',     'julenramostolosa@gmail.com',     1.350, 'Dokumentu fiskalak',                 'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   34, 3,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (35, 'PAK-20260035', 'Alaia Urrutia',     'julenramostolosa@gmail.com',     4.100, 'Jatetxerako hornidura',              'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   35, 4,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
  (36, 'PAK-20260036', 'Ekain Pagola',      'julenramostolosa@gmail.com',      2.750, 'Tresna elektriko txikia',            'assigned',   CURRENT_DATE + INTERVAL 1 DAY,   36, 4,    1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE,   CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (37, 'PAK-20260037', 'Naroa Garmendia',   'julenramostolosa@gmail.com',   1.450, 'Etziko lehen bidalketa',             'assigned',   CURRENT_DATE + INTERVAL 2 DAY,   37, 2,    1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR,                        CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (38, 'PAK-20260038', 'Benat Zumeta',      'julenramostolosa@gmail.com',      3.950, 'Etziko bigarren bidalketa',          'assigned',   CURRENT_DATE + INTERVAL 2 DAY,   38, 2,    1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE,   CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (39, 'PAK-20260039', 'Haizea Otamendi',   'julenramostolosa@gmail.com',   2.600, 'Tailerreko ordezkoak',               'assigned',   CURRENT_DATE + INTERVAL 2 DAY,   39, 3,    1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE,    CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (40, 'PAK-20260040', 'Ander Bikuna',      'julenramostolosa@gmail.com',      5.500, 'Merkataritza eskaera',               'assigned',   CURRENT_DATE + INTERVAL 2 DAY,   40, 3,    1, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE,   CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (41, 'PAK-20260041', 'Nora Berasategi',   'julenramostolosa@gmail.com',   0.500, 'Esleitu gabeko dokumentua',          'pending',    CURRENT_DATE + INTERVAL 2 DAY,   41, NULL, 1, CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 10 MINUTE,                  CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 10 MINUTE),
  (42, 'PAK-20260042', 'Aritz Segurola',    'julenramostolosa@gmail.com',    9.200, 'Bolumen handiko paketea',            'pending',    CURRENT_DATE + INTERVAL 3 DAY,   42, NULL, 1, CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 20 MINUTE,                  CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 20 MINUTE),
  (43, 'PAK-20260043', 'Irune Azpiazu',     'julenramostolosa@gmail.com',     1.150, 'Biharko esleitu gabekoa',            'pending',    CURRENT_DATE + INTERVAL 3 DAY,   43, NULL, 1, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 45 MINUTE,    CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 45 MINUTE),
  (44, 'PAK-20260044', 'Mikel Lizaso',      'julenramostolosa@gmail.com',      2.850, 'Atzeratutako paketea',               'pending',    CURRENT_DATE + INTERVAL 1 DAY,   44, NULL, 1, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 16 HOUR + INTERVAL 30 MINUTE,  CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 16 HOUR + INTERVAL 30 MINUTE);


-- ================================================================
-- 4. TOKENS (tracking)
-- ================================================================
INSERT INTO tokens (id, type, token, user_id, package_id, expires_at, revoked, created_at) VALUES
  (1,  'tracking_token', 'trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c', NULL, 1,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR),
  (2,  'tracking_token', 'trk-pak-20260002-2d4e6f8a0b2c4d6e8f0a', NULL, 2,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR),
  (3,  'tracking_token', 'trk-pak-20260003-9a1b3c5d7e9f1a3b5c7d', NULL, 3,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR),
  (4,  'tracking_token', 'trk-pak-20260004-4b6c8d0e2f4a6b8c0d2e', NULL, 4,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR),
  (5,  'tracking_token', 'trk-pak-20260005-1c3d5e7f9a1b3c5d7e9f', NULL, 5,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR),
  (6,  'tracking_token', 'trk-pak-20260006-8e0f2a4b6c8d0e2f4a6b', NULL, 6,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR),
  (7,  'tracking_token', 'trk-pak-20260007-5f7a9b1c3d5e7f9a1b3c', NULL, 7,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR),
  (8,  'tracking_token', 'trk-pak-20260008-2a4b6c8d0e2f4a6b8c0d', NULL, 8,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR),
  (9,  'tracking_token', 'trk-pak-20260009-9b1c3d5e7f9a1b3c5d7e', NULL, 9,  CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (10, 'tracking_token', 'trk-pak-20260010-6c8d0e2f4a6b8c0d2e4f', NULL, 10, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (11, 'tracking_token', 'trk-pak-20260011-3d5e7f9a1b3c5d7e9f1a', NULL, 11, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (12, 'tracking_token', 'trk-pak-20260012-0e2f4a6b8c0d2e4f6a8b', NULL, 12, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (13, 'tracking_token', 'trk-pak-20260013-a13b13c13d13e13f13',   NULL, 13, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (14, 'tracking_token', 'trk-pak-20260014-a14b14c14d14e14f14',   NULL, 14, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (15, 'tracking_token', 'trk-pak-20260015-a15b15c15d15e15f15',   NULL, 15, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (16, 'tracking_token', 'trk-pak-20260016-a16b16c16d16e16f16',   NULL, 16, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (17, 'tracking_token', 'trk-pak-20260017-a17b17c17d17e17f17',   NULL, 17, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (18, 'tracking_token', 'trk-pak-20260018-a18b18c18d18e18f18',   NULL, 18, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 6 HOUR),
  (19, 'tracking_token', 'trk-pak-20260019-a19b19c19d19e19f19',   NULL, 19, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 6 HOUR),
  (20, 'tracking_token', 'trk-pak-20260020-a20b20c20d20e20f20',   NULL, 20, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (21, 'tracking_token', 'trk-pak-20260021-a21b21c21d21e21f21',   NULL, 21, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (22, 'tracking_token', 'trk-pak-20260022-a22b22c22d22e22f22',   NULL, 22, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 6 HOUR),
  (23, 'tracking_token', 'trk-pak-20260023-a23b23c23d23e23f23',   NULL, 23, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (24, 'tracking_token', 'trk-pak-20260024-a24b24c24d24e24f24',   NULL, 24, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (25, 'tracking_token', 'trk-pak-20260025-a25b25c25d25e25f25',   NULL, 25, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (26, 'tracking_token', 'trk-pak-20260026-a26b26c26d26e26f26',   NULL, 26, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 6 HOUR),
  (27, 'tracking_token', 'trk-pak-20260027-a27b27c27d27e27f27',   NULL, 27, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (28, 'tracking_token', 'trk-pak-20260028-a28b28c28d28e28f28',   NULL, 28, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 7 HOUR),
  (29, 'tracking_token', 'trk-pak-20260029-a29b29c29d29e29f29',   NULL, 29, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (30, 'tracking_token', 'trk-pak-20260030-a30b30c30d30e30f30',   NULL, 30, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (31, 'tracking_token', 'trk-pak-20260031-a31b31c31d31e31f31',   NULL, 31, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (32, 'tracking_token', 'trk-pak-20260032-a32b32c32d32e32f32',   NULL, 32, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (33, 'tracking_token', 'trk-pak-20260033-a33b33c33d33e33f33',   NULL, 33, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (34, 'tracking_token', 'trk-pak-20260034-a34b34c34d34e34f34',   NULL, 34, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (35, 'tracking_token', 'trk-pak-20260035-a35b35c35d35e35f35',   NULL, 35, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (36, 'tracking_token', 'trk-pak-20260036-a36b36c36d36e36f36',   NULL, 36, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (37, 'tracking_token', 'trk-pak-20260037-a37b37c37d37e37f37',   NULL, 37, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (38, 'tracking_token', 'trk-pak-20260038-a38b38c38d38e38f38',   NULL, 38, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (39, 'tracking_token', 'trk-pak-20260039-a39b39c39d39e39f39',   NULL, 39, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (40, 'tracking_token', 'trk-pak-20260040-a40b40c40d40e40f40',   NULL, 40, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (41, 'tracking_token', 'trk-pak-20260041-a41b41c41d41e41f41',   NULL, 41, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 10 HOUR),
  (42, 'tracking_token', 'trk-pak-20260042-a42b42c42d42e42f42',   NULL, 42, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 10 HOUR),
  (43, 'tracking_token', 'trk-pak-20260043-a43b43c43d43e43f43',   NULL, 43, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 9 HOUR),
  (44, 'tracking_token', 'trk-pak-20260044-a44b44c44d44e44f44',   NULL, 44, CURRENT_DATE + INTERVAL 45 DAY + INTERVAL 23 HOUR, FALSE, CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 16 HOUR);


-- ================================================================
-- 5. PACKAGE STATUS LOGS
-- Historial osoa edo gutxienez azken egoera logikoa pakete bakoitzeko.
-- ================================================================
INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at) VALUES
  (1,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR),
  (1,  'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (1,  'assigned',   'in_transit', 2, 'Recogido en almacen',                    CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 8 HOUR + INTERVAL 40 MINUTE),
  (1,  'in_transit', 'delivered',  2, 'Entregado con firma',                    CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 10 HOUR + INTERVAL 25 MINUTE),
  (2,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR + INTERVAL 15 MINUTE),
  (2,  'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 11 DAY + INTERVAL 8 HOUR + INTERVAL 35 MINUTE),
  (2,  'assigned',   'in_transit', 2, 'Recogido en almacen',                    CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
  (2,  'in_transit', 'delivered',  2, 'Entregado en recepcion',                 CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 11 HOUR + INTERVAL 5 MINUTE),
  (3,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR),
  (3,  'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (3,  'assigned',   'in_transit', 3, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 8 HOUR + INTERVAL 35 MINUTE),
  (3,  'in_transit', 'delivered',  3, 'Entregado correctamente',                CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 9 HOUR + INTERVAL 45 MINUTE),
  (4,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE),
  (4,  'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE - INTERVAL 9 DAY + INTERVAL 8 HOUR + INTERVAL 30 MINUTE),
  (4,  'assigned',   'in_transit', 3, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 8 HOUR + INTERVAL 40 MINUTE),
  (4,  'in_transit', 'delivered',  3, 'Entregado en tienda',                    CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 30 MINUTE),
  (5,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR),
  (5,  'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (5,  'assigned',   'in_transit', 2, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 9 HOUR),
  (5,  'in_transit', 'failed',     2, 'Ausente en domicilio',                   CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 11 HOUR + INTERVAL 40 MINUTE),
  (6,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (6,  'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 7 DAY + INTERVAL 8 HOUR + INTERVAL 25 MINUTE),
  (6,  'assigned',   'in_transit', 2, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 9 HOUR + INTERVAL 5 MINUTE),
  (6,  'in_transit', 'delivered',  2, 'Entregado al titular',                   CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 12 HOUR + INTERVAL 15 MINUTE),
  (7,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (7,  'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE),
  (7,  'assigned',   'in_transit', 4, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 8 HOUR + INTERVAL 50 MINUTE),
  (7,  'in_transit', 'delivered',  4, 'Entregado con codigo de entrega',        CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 10 HOUR),
  (8,  NULL,         'pending',    1, 'Paquete creado',                         CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (8,  'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE - INTERVAL 5 DAY + INTERVAL 8 HOUR + INTERVAL 40 MINUTE),
  (8,  'assigned',   'in_transit', 4, 'Ruta iniciada',                          CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 8 HOUR + INTERVAL 55 MINUTE),
  (8,  'in_transit', 'delivered',  4, 'Entregado en porteria',                  CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 45 MINUTE),
  (9,  NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE),
  (9,  'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (9,  'assigned',   'in_transit', 2, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
  (9,  'in_transit', 'delivered',  2, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 35 MINUTE),
  (10, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (10, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (10, 'assigned',   'in_transit', 2, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 50 MINUTE),
  (10, 'in_transit', 'failed',     2, 'Direccion cerrada por horario',          CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 20 MINUTE),
  (11, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (11, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (11, 'assigned',   'in_transit', 2, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 55 MINUTE),
  (11, 'in_transit', 'delivered',  2, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 11 HOUR + INTERVAL 45 MINUTE),
  (12, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (12, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (12, 'assigned',   'in_transit', 3, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 40 MINUTE),
  (12, 'in_transit', 'delivered',  3, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 25 MINUTE),
  (13, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (13, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
  (13, 'assigned',   'in_transit', 3, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
  (13, 'in_transit', 'delivered',  3, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE),
  (14, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (14, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR),
  (14, 'assigned',   'in_transit', 3, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 50 MINUTE),
  (14, 'in_transit', 'delivered',  3, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 11 HOUR + INTERVAL 15 MINUTE),
  (15, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (15, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (15, 'assigned',   'in_transit', 4, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 35 MINUTE),
  (15, 'in_transit', 'delivered',  4, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 20 MINUTE),
  (16, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (16, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (16, 'assigned',   'in_transit', 4, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 40 MINUTE),
  (16, 'in_transit', 'failed',     4, 'No habia acceso al portal',              CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 40 MINUTE),
  (17, NULL,         'pending',    1, 'Paquete creado ayer',                    CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (17, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (17, 'assigned',   'in_transit', 4, 'Ruta de ayer iniciada',                  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
  (17, 'in_transit', 'delivered',  4, 'Entregado ayer',                         CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 12 HOUR),
  (18, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 35 MINUTE),
  (18, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 50 MINUTE),
  (18, 'assigned',   'in_transit', 2, 'Ruta de hoy iniciada',                   CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 35 MINUTE),
  (18, 'in_transit', 'delivered',  2, 'Primera parada entregada',               CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 8 MINUTE),
  (19, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 40 MINUTE),
  (19, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 55 MINUTE),
  (19, 'assigned',   'in_transit', 2, 'En reparto ahora',                       CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 25 MINUTE),
  (20, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (20, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (21, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (21, 'pending',    'assigned',   1, 'Asignado a Alejandro',                   CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (22, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 50 MINUTE),
  (22, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (22, 'assigned',   'in_transit', 3, 'Ruta de hoy iniciada',                   CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 45 MINUTE),
  (22, 'in_transit', 'delivered',  3, 'Entregado hoy',                          CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 38 MINUTE),
  (23, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 10 MINUTE),
  (23, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (23, 'assigned',   'in_transit', 3, 'Ruta de hoy iniciada',                   CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 50 MINUTE),
  (23, 'in_transit', 'failed',     3, 'Cliente solicita reprogramar',           CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 15 MINUTE),
  (24, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (24, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (24, 'assigned',   'in_transit', 3, 'En reparto ahora',                       CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 50 MINUTE),
  (25, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (25, 'pending',    'assigned',   1, 'Asignado a Sergio',                      CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (26, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 6 HOUR + INTERVAL 45 MINUTE),
  (26, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE + INTERVAL 7 HOUR),
  (26, 'assigned',   'in_transit', 4, 'Ruta de hoy iniciada',                   CURRENT_DATE + INTERVAL 9 HOUR),
  (27, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (27, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (28, NULL,         'pending',    1, 'Paquete creado hoy',                     CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (28, 'pending',    'assigned',   1, 'Asignado a Julen Arruti',                CURRENT_DATE + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (29, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR),
  (29, 'pending',    'assigned',   1, 'Asignado a Alejandro para manana',       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (30, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE),
  (30, 'pending',    'assigned',   1, 'Asignado a Alejandro para manana',       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
  (31, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (31, 'pending',    'assigned',   1, 'Asignado a Alejandro para manana',       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 40 MINUTE),
  (32, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (32, 'pending',    'assigned',   1, 'Asignado a Sergio para manana',          CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (33, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (33, 'pending',    'assigned',   1, 'Asignado a Sergio para manana',          CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (34, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (34, 'pending',    'assigned',   1, 'Asignado a Sergio para manana',          CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (35, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 10 MINUTE),
  (35, 'pending',    'assigned',   1, 'Asignado a Julen Arruti para manana',    CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 30 MINUTE),
  (36, NULL,         'pending',    1, 'Paquete creado para manana',             CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (36, 'pending',    'assigned',   1, 'Asignado a Julen Arruti para manana',    CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (37, NULL,         'pending',    1, 'Paquete creado para pasado manana',      CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR),
  (37, 'pending',    'assigned',   1, 'Asignado a Alejandro para pasado manana',CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 20 MINUTE),
  (38, NULL,         'pending',    1, 'Paquete creado para pasado manana',      CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 15 MINUTE),
  (38, 'pending',    'assigned',   1, 'Asignado a Alejandro para pasado manana',CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 35 MINUTE),
  (39, NULL,         'pending',    1, 'Paquete creado para pasado manana',      CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 5 MINUTE),
  (39, 'pending',    'assigned',   1, 'Asignado a Sergio para pasado manana',   CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (40, NULL,         'pending',    1, 'Paquete creado para pasado manana',      CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 25 MINUTE),
  (40, 'pending',    'assigned',   1, 'Asignado a Sergio para pasado manana',   CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (41, NULL,         'pending',    1, 'Pendiente de asignacion',                CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 10 MINUTE),
  (42, NULL,         'pending',    1, 'Pendiente de asignacion',                CURRENT_DATE + INTERVAL 10 HOUR + INTERVAL 20 MINUTE),
  (43, NULL,         'pending',    1, 'Pendiente de asignacion futura',         CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 45 MINUTE),
  (44, NULL,         'pending',    1, 'Pendiente atrasado para reasignar',      CURRENT_DATE - INTERVAL 2 DAY + INTERVAL 16 HOUR + INTERVAL 30 MINUTE);


-- ================================================================
-- 6. ROUTES
-- Ibilbideak atzo, gaur, bihar eta etzi. User 5 ez da erabiltzen.
-- ================================================================
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at) VALUES
  (1,  2, CURRENT_DATE - INTERVAL 10 DAY, 'completed',   CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE, CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 11 HOUR + INTERVAL 15 MINUTE),
  (2,  3, CURRENT_DATE - INTERVAL 8 DAY,  'completed',   CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE,  CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 45 MINUTE),
  (3,  2, CURRENT_DATE - INTERVAL 6 DAY,  'completed',   CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE,  CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 12 HOUR + INTERVAL 20 MINUTE),
  (4,  4, CURRENT_DATE - INTERVAL 4 DAY,  'completed',   CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE,  CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 50 MINUTE),
  (5,  2, CURRENT_DATE - INTERVAL 1 DAY,  'completed',   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE,  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 12 HOUR),
  (6,  3, CURRENT_DATE - INTERVAL 1 DAY,  'completed',   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE,  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 11 HOUR + INTERVAL 30 MINUTE),
  (7,  4, CURRENT_DATE - INTERVAL 1 DAY,  'completed',   CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE,  CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 12 HOUR + INTERVAL 10 MINUTE),
  (8,  2, CURRENT_DATE,                   'in_progress', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 15 MINUTE,                 CURRENT_DATE + INTERVAL 9 HOUR + INTERVAL 30 MINUTE),
  (9,  3, CURRENT_DATE,                   'in_progress', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 20 MINUTE,                 CURRENT_DATE + INTERVAL 10 HOUR),
  (10, 4, CURRENT_DATE,                   'in_progress', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 25 MINUTE,                 CURRENT_DATE + INTERVAL 9 HOUR),
  (11, 2, CURRENT_DATE + INTERVAL 1 DAY,  'planned',     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR,                      CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR),
  (12, 3, CURRENT_DATE + INTERVAL 1 DAY,  'planned',     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE,  CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (13, 4, CURRENT_DATE + INTERVAL 1 DAY,  'planned',     CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE, CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE),
  (14, 2, CURRENT_DATE + INTERVAL 2 DAY,  'planned',     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR,                      CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (15, 3, CURRENT_DATE + INTERVAL 2 DAY,  'planned',     CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE,  CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE);


-- ================================================================
-- 7. ROUTE STOPS
-- TIME formatua: HH:MM:SS soilik.
-- ================================================================
INSERT INTO route_stops (id, route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at) VALUES
  (1,  1,  1,  1, '09:30:00', '09:28:00', CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (2,  1,  2,  2, '10:15:00', '10:12:00', CURRENT_DATE - INTERVAL 10 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (3,  2,  3,  1, '09:10:00', '09:07:00', CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (4,  2,  4,  2, '10:05:00', '10:01:00', CURRENT_DATE - INTERVAL 8 DAY + INTERVAL 7 HOUR + INTERVAL 45 MINUTE),
  (5,  3,  5,  1, '09:45:00', '09:50:00', CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (6,  3,  6,  2, '11:30:00', '11:22:00', CURRENT_DATE - INTERVAL 6 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (7,  4,  7,  1, '09:20:00', '09:18:00', CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (8,  4,  8,  2, '10:35:00', '10:38:00', CURRENT_DATE - INTERVAL 4 DAY + INTERVAL 7 HOUR + INTERVAL 50 MINUTE),
  (9,  5,  9,  1, '09:30:00', '09:35:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (10, 5,  10, 2, '10:10:00', '10:20:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (11, 5,  11, 3, '11:35:00', '11:45:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (12, 6,  12, 1, '09:20:00', '09:25:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (13, 6,  13, 2, '10:00:00', '10:05:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (14, 6,  14, 3, '11:10:00', '11:15:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (15, 7,  15, 1, '09:15:00', '09:20:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (16, 7,  16, 2, '10:30:00', '10:40:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (17, 7,  17, 3, '11:50:00', '12:00:00', CURRENT_DATE - INTERVAL 1 DAY + INTERVAL 7 HOUR + INTERVAL 55 MINUTE),
  (18, 8,  18, 1, '09:05:00', '09:08:00', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 15 MINUTE),
  (19, 8,  19, 2, '10:10:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 15 MINUTE),
  (20, 8,  20, 3, '11:15:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 15 MINUTE),
  (21, 8,  21, 4, '12:05:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 15 MINUTE),
  (22, 9,  22, 1, '09:35:00', '09:38:00', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (23, 9,  23, 2, '10:05:00', '10:15:00', CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (24, 9,  24, 3, '11:20:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (25, 9,  25, 4, '12:00:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 20 MINUTE),
  (26, 10, 26, 1, '09:50:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 25 MINUTE),
  (27, 10, 27, 2, '10:45:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 25 MINUTE),
  (28, 10, 28, 3, '11:40:00', NULL,       CURRENT_DATE + INTERVAL 8 HOUR + INTERVAL 25 MINUTE),
  (29, 11, 29, 1, '09:10:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR),
  (30, 11, 30, 2, '10:05:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR),
  (31, 11, 31, 3, '11:20:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR),
  (32, 12, 32, 1, '09:25:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (33, 12, 33, 2, '10:30:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (34, 12, 34, 3, '11:15:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (35, 13, 35, 1, '09:45:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE),
  (36, 13, 36, 2, '10:50:00', NULL,       CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 10 MINUTE),
  (37, 14, 37, 1, '09:20:00', NULL,       CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (38, 14, 38, 2, '10:40:00', NULL,       CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR),
  (39, 15, 39, 1, '09:35:00', NULL,       CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
  (40, 15, 40, 2, '10:55:00', NULL,       CURRENT_DATE + INTERVAL 2 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE);


COMMIT;

-- ================================================================
-- RESUMEN
-- ================================================================
--
-- Usuarios:
--   1 admin        Julen Ramos Tolosa
--   2 distributor  Alejandro Ariza Aguilar
--   3 distributor  Sergio Rocha Tolosaldea
--   4 distributor  Julen Ramos Arruti
--   5 distributor  Penelope Garcia (inactivo, sin paquetes ni rutas)
--
-- Datos cargados:
--   44 direcciones
--   44 paquetes
--   44 tracking tokens
--   15 rutas
--   40 paradas de ruta
--
-- Distribucion de rutas:
--   Historico: rutas completadas de hace 10, 8, 6 y 4 dias
--   Ayer: rutas completadas para usuarios 2, 3 y 4
--   Hoy: rutas en progreso para usuarios 2, 3 y 4
--   Manana: rutas planificadas para usuarios 2, 3 y 4
--   Pasado manana: rutas planificadas para usuarios 2 y 3
--
-- Tracking URL de ejemplo:
-- GET /api/tracking/trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c
-- ================================================================
