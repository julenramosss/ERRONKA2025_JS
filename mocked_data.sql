-- ================================================================
-- pakAG - Development seed data
-- ================================================================
--
-- Run only in development.
-- All users share this password: Test1234!
-- All package recipient emails are set to: julenramostolosa@gmail.com
--
-- The seed uses CURRENT_DATE and NOW(), so every run creates:
--   - packages and routes for today
--   - completed/failed history across previous days
--   - planned routes for tomorrow
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

SET @password_hash = '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC';
SET @customer_email = 'julenramostolosa@gmail.com';
SET @admin_id = 1;
SET @alejandro_id = 2;
SET @julen_arruti_id = 3;
SET @sergio_id = 4;

-- ================================================================
-- 1. USERS
-- ================================================================
INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES
  (@admin_id,        'Julen Ramos Tolosa',       'julenramostolosa@gmail.com',       @password_hash, 'admin',       TRUE,  NOW() - INTERVAL 6 MONTH),
  (@alejandro_id,    'Alejandro Ariza Aguilar',  'alejandroarizaaguilar@gmail.com',  @password_hash, 'distributor', TRUE,  NOW() - INTERVAL 4 MONTH),
  (@julen_arruti_id, 'Julen Ramos Arruti',       'jramosarruti@gmail.com',           @password_hash, 'distributor', TRUE,  NOW() - INTERVAL 3 MONTH),
  (@sergio_id,       'Sergio Rocha Tolosaldea',  'sergiotolosaldea@gmail.com',       @password_hash, 'distributor', TRUE,  NOW() - INTERVAL 2 MONTH),
  (5,                'Penelope Garcia',          'penelopeg@gmail.com',              @password_hash, 'distributor', FALSE, NOW() - INTERVAL 5 MONTH);

-- ================================================================
-- 2. ADDRESSES
-- ================================================================
INSERT INTO addresses (id, street, city, postal_code, country, latitude, longitude) VALUES
  (1,  'Kale Nagusia 12',          'Donostia-San Sebastian', '20001', 'Espana', 43.3183000, -1.9812000),
  (2,  'Avenida Libertad 45',      'Donostia-San Sebastian', '20004', 'Espana', 43.3225000, -1.9793000),
  (3,  'Paseo de la Concha 8',     'Donostia-San Sebastian', '20007', 'Espana', 43.3178000, -1.9956000),
  (4,  'Calle Urbieta 23',         'Donostia-San Sebastian', '20006', 'Espana', 43.3199000, -1.9843000),
  (5,  'San Martin Kalea 11',      'Donostia-San Sebastian', '20005', 'Espana', 43.3171000, -1.9819000),
  (6,  'Zurriola Hiribidea 17',    'Donostia-San Sebastian', '20002', 'Espana', 43.3248000, -1.9733000),
  (7,  'Portuetxe Bidea 15',       'Donostia-San Sebastian', '20018', 'Espana', 43.2934000, -1.9658000),
  (8,  'Miraconcha Kalea 4',       'Donostia-San Sebastian', '20007', 'Espana', 43.3156000, -2.0012000),
  (9,  'San Juan Plaza 3',         'Errenteria',             '20100', 'Espana', 43.3126000, -1.8988000),
  (10, 'Biteri Kalea 22',          'Errenteria',             '20100', 'Espana', 43.3139000, -1.9025000),
  (11, 'Euskadi Hiribidea 6',      'Pasaia',                 '20110', 'Espana', 43.3241000, -1.9204000),
  (12, 'Doneztebe Plaza 2',        'Lezo',                   '20100', 'Espana', 43.3212000, -1.8999000),
  (13, 'Mendelu Kalea 9',          'Hondarribia',            '20280', 'Espana', 43.3567000, -1.7937000),
  (14, 'Colon Ibilbidea 31',       'Irun',                   '20302', 'Espana', 43.3382000, -1.7899000),
  (15, 'Elizalde Auzoa 4',         'Oiartzun',               '20180', 'Espana', 43.2996000, -1.8587000),
  (16, 'Etxe Zuri Kalea 7',        'Hernani',                '20120', 'Espana', 43.2698000, -1.9759000),
  (17, 'Urbieta Kalea 40',         'Hernani',                '20120', 'Espana', 43.2669000, -1.9781000),
  (18, 'Nagusia Kalea 18',         'Lasarte-Oria',           '20160', 'Espana', 43.2671000, -2.0201000),
  (19, 'Kale Berria 6',            'Usurbil',                '20170', 'Espana', 43.2718000, -2.0245000),
  (20, 'Txara Kalea 33',           'Andoain',                '20140', 'Espana', 43.2261000, -2.0034000),
  (21, 'San Martin Kalea 11',      'Tolosa',                 '20400', 'Espana', 43.1342000, -2.0765000),
  (22, 'Larramendi Kalea 5',       'Tolosa',                 '20400', 'Espana', 43.1371000, -2.0742000),
  (23, 'Kale Nagusia 3',           'Beasain',                '20200', 'Espana', 43.0495000, -2.2002000),
  (24, 'Gudarien Etorbidea 28',    'Zarautz',                '20800', 'Espana', 43.2846000, -2.1699000),
  (25, 'Elkano Kalea 14',          'Getaria',                '20808', 'Espana', 43.3049000, -2.2043000),
  (26, 'San Roke Kalea 21',        'Azpeitia',               '20730', 'Espana', 43.1829000, -2.2667000),
  (27, 'Erdikale 12',              'Azkoitia',               '20720', 'Espana', 43.1777000, -2.3111000),
  (28, 'Zubiaurre Kalea 7',        'Eibar',                  '20600', 'Espana', 43.1844000, -2.4716000),
  (29, 'San Andres Pasealekua 10', 'Arrasate',               '20500', 'Espana', 43.0640000, -2.4891000),
  (30, 'Bidebarrieta 22',          'Bergara',                '20570', 'Espana', 43.1189000, -2.4134000),
  (31, 'Lersundi Kalea 2',         'Bilbao',                 '48009', 'Espana', 43.2668000, -2.9334000),
  (32, 'Gran Via 30',              'Bilbao',                 '48009', 'Espana', 43.2630000, -2.9349000),
  (33, 'Florida Kalea 18',         'Vitoria-Gasteiz',        '01005', 'Espana', 42.8422000, -2.6749000),
  (34, 'Sancho el Sabio 9',        'Vitoria-Gasteiz',        '01008', 'Espana', 42.8443000, -2.6835000),
  (35, 'Estafeta Kalea 41',        'Pamplona',               '31001', 'Espana', 42.8169000, -1.6423000),
  (36, 'Iturrama Kalea 15',        'Pamplona',               '31007', 'Espana', 42.8089000, -1.6585000),
  (37, 'Atotxaerreka Bidea 3',     'Donostia-San Sebastian', '20018', 'Espana', 43.3002000, -1.9822000),
  (38, 'Boulevard Zumardia 25',    'Donostia-San Sebastian', '20003', 'Espana', 43.3215000, -1.9869000),
  (39, 'Paseo Francia 2',          'Donostia-San Sebastian', '20012', 'Espana', 43.3193000, -1.9769000),
  (40, 'Aiete Pasealekua 34',      'Donostia-San Sebastian', '20009', 'Espana', 43.3017000, -1.9945000),
  (41, 'Matia Kalea 55',           'Donostia-San Sebastian', '20008', 'Espana', 43.3122000, -2.0101000),
  (42, 'Aldakonea Kalea 14',       'Donostia-San Sebastian', '20012', 'Espana', 43.3179000, -1.9710000),
  (43, 'Zabaleta Kalea 11',        'Donostia-San Sebastian', '20002', 'Espana', 43.3242000, -1.9722000),
  (44, 'Nafarroa Hiribidea 52',    'Donostia-San Sebastian', '20013', 'Espana', 43.3151000, -1.9585000),
  (45, 'Txominenea Pasealekua 6',  'Donostia-San Sebastian', '20014', 'Espana', 43.3063000, -1.9612000);

-- ================================================================
-- 3. PACKAGES SOURCE DATA
-- ================================================================
DROP TEMPORARY TABLE IF EXISTS seed_packages;

CREATE TEMPORARY TABLE seed_packages (
  id INT UNSIGNED NOT NULL PRIMARY KEY,
  tracking_code VARCHAR(50) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  weight_kg DECIMAL(6, 3) NOT NULL,
  description TEXT NULL,
  status VARCHAR(20) NOT NULL,
  estimated_delivery DATE NULL,
  address_id INT UNSIGNED NOT NULL,
  assigned_to INT UNSIGNED NULL,
  pending_at DATETIME NOT NULL,
  assigned_at DATETIME NULL,
  transit_at DATETIME NULL,
  final_at DATETIME NULL
);

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
VALUES
  (1,  'PAK-DEV-0001', 'Jon Arrizabalaga',    1.250, 'Libros y documentacion',                    'delivered',  CURRENT_DATE - INTERVAL 13 DAY, 1,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 14 DAY, '08:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 14 DAY, '08:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '08:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '09:10:00')),
  (2,  'PAK-DEV-0002', 'Miren Irazusta',      3.400, 'Caja pequena de hogar',                     'delivered',  CURRENT_DATE - INTERVAL 13 DAY, 2,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 14 DAY, '08:12:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 14 DAY, '08:50:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '08:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '09:42:00')),
  (3,  'PAK-DEV-0003', 'Itziar Goikoetxea',   0.850, 'Sobre acolchado con accesorios',            'delivered',  CURRENT_DATE - INTERVAL 12 DAY, 3,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '10:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '11:10:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '08:30:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '10:05:00')),
  (4,  'PAK-DEV-0004', 'Xabier Beloki',       2.100, 'Material fotografico fragil',                'failed',     CURRENT_DATE - INTERVAL 12 DAY, 4,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '10:10:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '11:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '08:35:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '11:30:00')),
  (5,  'PAK-DEV-0005', 'Amaia Olano',         5.000, 'Reposicion de tienda local',                 'delivered',  CURRENT_DATE - INTERVAL 11 DAY, 9,  @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '07:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '08:15:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '08:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '09:25:00')),
  (6,  'PAK-DEV-0006', 'Josu Zabala',         1.800, 'Documentacion bancaria',                     'delivered',  CURRENT_DATE - INTERVAL 11 DAY, 10, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '07:55:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '08:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '08:10:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '10:20:00')),
  (7,  'PAK-DEV-0007', 'Nerea Eizaguirre',    0.600, 'Recambio pequeno',                           'failed',     CURRENT_DATE - INTERVAL 10 DAY, 16, @julen_arruti_id, TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '09:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '10:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '08:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '09:45:00')),
  (8,  'PAK-DEV-0008', 'Peru Txurruka',       4.200, 'Producto electronico asegurado',             'delivered',  CURRENT_DATE - INTERVAL 10 DAY, 17, @julen_arruti_id, TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '09:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '10:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '08:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '10:35:00')),
  (9,  'PAK-DEV-0009', 'Ane Murua',           2.750, 'Muestras comerciales',                       'delivered',  CURRENT_DATE - INTERVAL 7 DAY,  5,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 8 DAY,  '08:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 8 DAY,  '08:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '08:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '09:50:00')),
  (10, 'PAK-DEV-0010', 'Ibai Lekuona',        1.100, 'Pedido de farmacia',                         'failed',     CURRENT_DATE - INTERVAL 7 DAY,  6,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 8 DAY,  '08:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 8 DAY,  '08:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '08:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '10:40:00')),
  (11, 'PAK-DEV-0011', 'Saioa Aranburu',      3.300, 'Textil y devolucion parcial',                'delivered',  CURRENT_DATE - INTERVAL 5 DAY,  11, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 6 DAY,  '09:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 6 DAY,  '09:35:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '08:15:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '11:10:00')),
  (12, 'PAK-DEV-0012', 'Unai Galdos',         0.900, 'Sobre urgente',                              'failed',     CURRENT_DATE - INTERVAL 5 DAY,  12, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 6 DAY,  '09:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 6 DAY,  '09:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '08:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '12:30:00')),

  (13, 'PAK-DEV-0013', 'Maialen Irizar',      1.450, 'Caja de repuestos',                          'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  13, @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:10:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:35:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:15:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '09:35:00')),
  (14, 'PAK-DEV-0014', 'Eneko Lasa',          2.250, 'Herramientas pequenas',                      'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  14, @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '10:18:00')),
  (15, 'PAK-DEV-0015', 'Lide Otegi',          0.720, 'Documentos firmables',                       'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  15, @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '11:05:00')),
  (16, 'PAK-DEV-0016', 'Iker Alberdi',        6.300, 'Caja grande con material deportivo',         'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  18, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:30:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '09:55:00')),
  (17, 'PAK-DEV-0017', 'June Etxeberria',     1.950, 'Cosmetica bien protegida',                   'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  19, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:35:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '11:42:00')),
  (18, 'PAK-DEV-0018', 'Markel Arrieta',      4.800, 'Piezas de impresora',                        'delivered',  CURRENT_DATE - INTERVAL 1 DAY,  20, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:10:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:50:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '14:20:00')),
  (19, 'PAK-DEV-0019', 'Naia Mendia',         2.050, 'Entrega contra firma',                       'failed',     CURRENT_DATE - INTERVAL 1 DAY,  7,  @alejandro_id,    TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:45:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:15:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:55:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '12:12:00')),
  (20, 'PAK-DEV-0020', 'Aritz Soto',          0.980, 'Producto refrigerado no critico',            'failed',     CURRENT_DATE - INTERVAL 1 DAY,  21, @sergio_id,       TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:50:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '09:00:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '15:35:00')),

  (21, 'PAK-DEV-0021', 'Leire Agirre',        1.200, 'Pedido online pequeno',                      'delivered',  CURRENT_DATE,                   38, @alejandro_id,    NOW() - INTERVAL 480 MINUTE, NOW() - INTERVAL 450 MINUTE, NOW() - INTERVAL 390 MINUTE, NOW() - INTERVAL 240 MINUTE),
  (22, 'PAK-DEV-0022', 'Gorka Zabala',        2.700, 'Caja de componentes',                        'delivered',  CURRENT_DATE,                   39, @alejandro_id,    NOW() - INTERVAL 470 MINUTE, NOW() - INTERVAL 440 MINUTE, NOW() - INTERVAL 380 MINUTE, NOW() - INTERVAL 200 MINUTE),
  (23, 'PAK-DEV-0023', 'Irati Urrutia',       0.650, 'Sobre certificado',                          'failed',     CURRENT_DATE,                   40, @sergio_id,       NOW() - INTERVAL 460 MINUTE, NOW() - INTERVAL 430 MINUTE, NOW() - INTERVAL 360 MINUTE, NOW() - INTERVAL 170 MINUTE),
  (24, 'PAK-DEV-0024', 'Oier Garmendia',      3.950, 'Regalo embalado',                            'delivered',  CURRENT_DATE,                   41, @julen_arruti_id, NOW() - INTERVAL 450 MINUTE, NOW() - INTERVAL 420 MINUTE, NOW() - INTERVAL 350 MINUTE, NOW() - INTERVAL 130 MINUTE),
  (25, 'PAK-DEV-0025', 'Uxue Sarasola',       5.500, 'Material oficina',                           'in_transit', CURRENT_DATE,                   9,  @alejandro_id,    NOW() - INTERVAL 500 MINUTE, NOW() - INTERVAL 470 MINUTE, NOW() - INTERVAL 330 MINUTE, NULL),
  (26, 'PAK-DEV-0026', 'Benat Arregi',        1.750, 'Bolsa acolchada',                            'in_transit', CURRENT_DATE,                   10, @alejandro_id,    NOW() - INTERVAL 495 MINUTE, NOW() - INTERVAL 465 MINUTE, NOW() - INTERVAL 320 MINUTE, NULL),
  (27, 'PAK-DEV-0027', 'Naroa Zabarte',       2.050, 'Pedido de libreria',                         'in_transit', CURRENT_DATE,                   5,  @sergio_id,       NOW() - INTERVAL 490 MINUTE, NOW() - INTERVAL 460 MINUTE, NOW() - INTERVAL 300 MINUTE, NULL),
  (28, 'PAK-DEV-0028', 'Eider Larrinaga',     7.200, 'Caja pesada con menaje',                     'in_transit', CURRENT_DATE,                   6,  @sergio_id,       NOW() - INTERVAL 485 MINUTE, NOW() - INTERVAL 455 MINUTE, NOW() - INTERVAL 290 MINUTE, NULL),
  (29, 'PAK-DEV-0029', 'Asier Gorostiaga',    0.540, 'Tarjeta SIM y contrato',                     'in_transit', CURRENT_DATE,                   42, @julen_arruti_id, NOW() - INTERVAL 480 MINUTE, NOW() - INTERVAL 450 MINUTE, NOW() - INTERVAL 275 MINUTE, NULL),
  (30, 'PAK-DEV-0030', 'Maddalen Egana',      2.880, 'Pack de muestras',                           'in_transit', CURRENT_DATE,                   43, @julen_arruti_id, NOW() - INTERVAL 475 MINUTE, NOW() - INTERVAL 445 MINUTE, NOW() - INTERVAL 260 MINUTE, NULL),
  (31, 'PAK-DEV-0031', 'Xuban Iriarte',       1.330, 'Ropa plegada',                               'assigned',   CURRENT_DATE,                   44, @alejandro_id,    NOW() - INTERVAL 160 MINUTE, NOW() - INTERVAL 140 MINUTE, NULL, NULL),
  (32, 'PAK-DEV-0032', 'Alaia Rezola',        4.120, 'Paquete mediano de ferreteria',              'assigned',   CURRENT_DATE,                   45, @alejandro_id,    NOW() - INTERVAL 150 MINUTE, NOW() - INTERVAL 130 MINUTE, NULL, NULL),
  (33, 'PAK-DEV-0033', 'Hodei Aizpuru',       0.790, 'Documentos de gestoria',                     'assigned',   CURRENT_DATE,                   18, @sergio_id,       NOW() - INTERVAL 145 MINUTE, NOW() - INTERVAL 120 MINUTE, NULL, NULL),
  (34, 'PAK-DEV-0034', 'Mikel Galarraga',     3.010, 'Pedido de marketplace',                      'assigned',   CURRENT_DATE,                   19, @julen_arruti_id, NOW() - INTERVAL 140 MINUTE, NOW() - INTERVAL 115 MINUTE, NULL, NULL),
  (35, 'PAK-DEV-0035', 'Garazi Elosegi',      1.670, 'Producto de electronica pequena',            'assigned',   CURRENT_DATE,                   20, @julen_arruti_id, NOW() - INTERVAL 135 MINUTE, NOW() - INTERVAL 110 MINUTE, NULL, NULL),
  (36, 'PAK-DEV-0036', 'Ander Uranga',        2.440, 'Caja de recambios',                          'assigned',   CURRENT_DATE,                   22, @sergio_id,       NOW() - INTERVAL 130 MINUTE, NOW() - INTERVAL 105 MINUTE, NULL, NULL),
  (37, 'PAK-DEV-0037', 'Laia Berasategi',     0.990, 'Alta nueva pendiente de asignar',            'pending',    CURRENT_DATE + INTERVAL 1 DAY, 23, NULL,             NOW() - INTERVAL 90 MINUTE,  NULL, NULL, NULL),
  (38, 'PAK-DEV-0038', 'Inigo Esnaola',       3.640, 'Paquete voluminoso pendiente',               'pending',    CURRENT_DATE + INTERVAL 1 DAY, 24, NULL,             NOW() - INTERVAL 80 MINUTE,  NULL, NULL, NULL),
  (39, 'PAK-DEV-0039', 'Ainhoa Zubia',        1.420, 'Reposicion pendiente',                       'pending',    CURRENT_DATE + INTERVAL 1 DAY, 25, NULL,             NOW() - INTERVAL 70 MINUTE,  NULL, NULL, NULL),
  (40, 'PAK-DEV-0040', 'Estitxu Mendizabal',  6.850, 'Equipo pesado pendiente de ruta',            'pending',    CURRENT_DATE + INTERVAL 1 DAY, 26, NULL,             NOW() - INTERVAL 60 MINUTE,  NULL, NULL, NULL),
  (41, 'PAK-DEV-0041', 'Julen Lete',          2.190, 'Caja con etiqueta revisada',                 'pending',    CURRENT_DATE + INTERVAL 1 DAY, 27, NULL,             NOW() - INTERVAL 50 MINUTE,  NULL, NULL, NULL),
  (42, 'PAK-DEV-0042', 'Naiara Odriozola',    0.480, 'Sobre ordinario pendiente',                  'pending',    CURRENT_DATE + INTERVAL 1 DAY, 28, NULL,             NOW() - INTERVAL 40 MINUTE,  NULL, NULL, NULL),
  (43, 'PAK-DEV-0043', 'Olatz Muguruza',      5.900, 'Ruta de manana: industria',                  'assigned',   CURRENT_DATE + INTERVAL 1 DAY, 29, @alejandro_id,    NOW() - INTERVAL 35 MINUTE,  NOW() - INTERVAL 30 MINUTE, NULL, NULL),
  (44, 'PAK-DEV-0044', 'Koldo Azkarate',      2.560, 'Ruta de manana: comercio',                   'assigned',   CURRENT_DATE + INTERVAL 1 DAY, 30, @sergio_id,       NOW() - INTERVAL 34 MINUTE,  NOW() - INTERVAL 29 MINUTE, NULL, NULL),
  (45, 'PAK-DEV-0045', 'Nerea Amilibia',      4.340, 'Ruta de manana: entrega urbana',             'assigned',   CURRENT_DATE + INTERVAL 1 DAY, 31, @julen_arruti_id, NOW() - INTERVAL 33 MINUTE,  NOW() - INTERVAL 28 MINUTE, NULL, NULL);

-- ================================================================
-- 4. PACKAGES
-- ================================================================
INSERT INTO packages (
  id,
  tracking_code,
  recipient_name,
  recipient_email,
  weight_kg,
  description,
  status,
  estimated_delivery,
  address_id,
  assigned_to,
  created_by,
  created_at,
  updated_at
)
SELECT
  id,
  tracking_code,
  recipient_name,
  @customer_email,
  weight_kg,
  description,
  status,
  estimated_delivery,
  address_id,
  assigned_to,
  @admin_id,
  pending_at,
  COALESCE(final_at, transit_at, assigned_at, pending_at)
FROM seed_packages;

-- ================================================================
-- 5. TOKENS
-- ================================================================
INSERT INTO tokens (id, token, type, user_id, package_id, expires_at, revoked, created_at)
SELECT
  id,
  CONCAT('trk-dev-', LPAD(id, 4, '0'), '-', LEFT(SHA2(CONCAT('pakag-dev-token-', id), 256), 24)),
  'tracking_token',
  NULL,
  id,
  COALESCE(final_at, transit_at, assigned_at, pending_at) + INTERVAL 30 DAY,
  FALSE,
  pending_at
FROM seed_packages;

-- ================================================================
-- 6. PACKAGE STATUS LOGS
-- ================================================================
INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT id, NULL, 'pending', @admin_id, 'Paquete creado en entorno de desarrollo', pending_at
FROM seed_packages;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT
  sp.id,
  'pending',
  'assigned',
  @admin_id,
  CONCAT('Asignado a ', u.name, ' para reparto de ', DATE_FORMAT(sp.estimated_delivery, '%Y-%m-%d')),
  sp.assigned_at
FROM seed_packages sp
JOIN users u ON u.id = sp.assigned_to
WHERE sp.assigned_at IS NOT NULL;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT
  id,
  'assigned',
  'in_transit',
  assigned_to,
  'Recogido en almacen y cargado en ruta',
  transit_at
FROM seed_packages
WHERE transit_at IS NOT NULL;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT
  id,
  'in_transit',
  status,
  assigned_to,
  CASE
    WHEN status = 'delivered' THEN 'Entregado correctamente. Confirmacion registrada.'
    WHEN status = 'failed' THEN 'Entrega fallida. No disponible o incidencia en direccion.'
  END,
  final_at
FROM seed_packages
WHERE final_at IS NOT NULL;

-- ================================================================
-- 7. ROUTES
-- ================================================================
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at) VALUES
  (1,  @alejandro_id,    CURRENT_DATE - INTERVAL 13 DAY, 'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '07:25:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '10:05:00')),
  (2,  @alejandro_id,    CURRENT_DATE - INTERVAL 12 DAY, 'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '07:30:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '11:45:00')),
  (3,  @sergio_id,       CURRENT_DATE - INTERVAL 11 DAY, 'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '07:20:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '10:45:00')),
  (4,  @julen_arruti_id, CURRENT_DATE - INTERVAL 10 DAY, 'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '07:50:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '11:00:00')),
  (5,  @alejandro_id,    CURRENT_DATE - INTERVAL 7 DAY,  'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '07:35:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY,  '11:15:00')),
  (6,  @sergio_id,       CURRENT_DATE - INTERVAL 5 DAY,  'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '07:40:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY,  '12:45:00')),
  (7,  @alejandro_id,    CURRENT_DATE - INTERVAL 1 DAY,  'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '07:55:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '12:30:00')),
  (8,  @sergio_id,       CURRENT_DATE - INTERVAL 1 DAY,  'completed',   TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '08:05:00'), TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY,  '15:50:00')),
  (9,  @alejandro_id,    CURRENT_DATE,                   'in_progress', NOW() - INTERVAL 420 MINUTE, NOW()),
  (10, @sergio_id,       CURRENT_DATE,                   'in_progress', NOW() - INTERVAL 410 MINUTE, NOW()),
  (11, @julen_arruti_id, CURRENT_DATE,                   'in_progress', NOW() - INTERVAL 400 MINUTE, NOW()),
  (12, @alejandro_id,    CURRENT_DATE + INTERVAL 1 DAY,  'planned',     NOW() - INTERVAL 25 MINUTE,  NOW() - INTERVAL 25 MINUTE),
  (13, @sergio_id,       CURRENT_DATE + INTERVAL 1 DAY,  'planned',     NOW() - INTERVAL 24 MINUTE,  NOW() - INTERVAL 24 MINUTE),
  (14, @julen_arruti_id, CURRENT_DATE + INTERVAL 1 DAY,  'planned',     NOW() - INTERVAL 23 MINUTE,  NOW() - INTERVAL 23 MINUTE);

-- ================================================================
-- 8. ROUTE STOPS
-- ================================================================
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at) VALUES
  (1,  1,  1, '09:05:00', '09:10:00', TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '07:30:00')),
  (1,  2,  2, '09:45:00', '09:42:00', TIMESTAMP(CURRENT_DATE - INTERVAL 13 DAY, '07:30:00')),

  (2,  3,  1, '10:00:00', '10:05:00', TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '07:35:00')),
  (2,  4,  2, '11:25:00', '11:30:00', TIMESTAMP(CURRENT_DATE - INTERVAL 12 DAY, '07:35:00')),

  (3,  5,  1, '09:20:00', '09:25:00', TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '07:25:00')),
  (3,  6,  2, '10:15:00', '10:20:00', TIMESTAMP(CURRENT_DATE - INTERVAL 11 DAY, '07:25:00')),

  (4,  7,  1, '09:40:00', '09:45:00', TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '07:55:00')),
  (4,  8,  2, '10:25:00', '10:35:00', TIMESTAMP(CURRENT_DATE - INTERVAL 10 DAY, '07:55:00')),

  (5,  9,  1, '09:45:00', '09:50:00', TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '07:40:00')),
  (5,  10, 2, '10:35:00', '10:40:00', TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '07:40:00')),

  (6,  11, 1, '11:05:00', '11:10:00', TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '07:45:00')),
  (6,  12, 2, '12:20:00', '12:30:00', TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '07:45:00')),

  (7,  13, 1, '09:30:00', '09:35:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')),
  (7,  14, 2, '10:10:00', '10:18:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')),
  (7,  15, 3, '11:00:00', '11:05:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')),
  (7,  19, 4, '12:05:00', '12:12:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')),

  (8,  16, 1, '09:50:00', '09:55:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:10:00')),
  (8,  17, 2, '11:35:00', '11:42:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:10:00')),
  (8,  18, 3, '14:10:00', '14:20:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:10:00')),
  (8,  20, 4, '15:30:00', '15:35:00', TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:10:00')),

  (9,  21, 1, TIME(NOW() - INTERVAL 245 MINUTE), TIME(NOW() - INTERVAL 240 MINUTE), NOW() - INTERVAL 420 MINUTE),
  (9,  22, 2, TIME(NOW() - INTERVAL 205 MINUTE), TIME(NOW() - INTERVAL 200 MINUTE), NOW() - INTERVAL 420 MINUTE),
  (9,  25, 3, TIME(NOW() + INTERVAL 20 MINUTE),  NULL,                            NOW() - INTERVAL 420 MINUTE),
  (9,  26, 4, TIME(NOW() + INTERVAL 75 MINUTE),  NULL,                            NOW() - INTERVAL 420 MINUTE),
  (9,  31, 5, TIME(NOW() + INTERVAL 135 MINUTE), NULL,                            NOW() - INTERVAL 420 MINUTE),
  (9,  32, 6, TIME(NOW() + INTERVAL 190 MINUTE), NULL,                            NOW() - INTERVAL 420 MINUTE),

  (10, 23, 1, TIME(NOW() - INTERVAL 175 MINUTE), TIME(NOW() - INTERVAL 170 MINUTE), NOW() - INTERVAL 410 MINUTE),
  (10, 27, 2, TIME(NOW() + INTERVAL 30 MINUTE),  NULL,                            NOW() - INTERVAL 410 MINUTE),
  (10, 28, 3, TIME(NOW() + INTERVAL 95 MINUTE),  NULL,                            NOW() - INTERVAL 410 MINUTE),
  (10, 33, 4, TIME(NOW() + INTERVAL 155 MINUTE), NULL,                            NOW() - INTERVAL 410 MINUTE),
  (10, 36, 5, TIME(NOW() + INTERVAL 215 MINUTE), NULL,                            NOW() - INTERVAL 410 MINUTE),

  (11, 24, 1, TIME(NOW() - INTERVAL 135 MINUTE), TIME(NOW() - INTERVAL 130 MINUTE), NOW() - INTERVAL 400 MINUTE),
  (11, 29, 2, TIME(NOW() + INTERVAL 25 MINUTE),  NULL,                            NOW() - INTERVAL 400 MINUTE),
  (11, 30, 3, TIME(NOW() + INTERVAL 80 MINUTE),  NULL,                            NOW() - INTERVAL 400 MINUTE),
  (11, 34, 4, TIME(NOW() + INTERVAL 145 MINUTE), NULL,                            NOW() - INTERVAL 400 MINUTE),
  (11, 35, 5, TIME(NOW() + INTERVAL 200 MINUTE), NULL,                            NOW() - INTERVAL 400 MINUTE),

  (12, 43, 1, '09:45:00', NULL, NOW() - INTERVAL 25 MINUTE),
  (13, 44, 1, '10:15:00', NULL, NOW() - INTERVAL 24 MINUTE),
  (14, 45, 1, '11:00:00', NULL, NOW() - INTERVAL 23 MINUTE);

DROP TEMPORARY TABLE seed_packages;

COMMIT;

-- ================================================================
-- QUICK CHECKS
-- ================================================================
--
-- Login:
--   julenramostolosa@gmail.com / Test1234!
--   alejandroarizaaguilar@gmail.com / Test1234!
--   jramosarruti@gmail.com / Test1234!
--   sergiotolosaldea@gmail.com / Test1234!
--
-- Useful tracking token shape:
--   trk-dev-0001-...
--
-- Dataset size:
--   users: 5
--   addresses: 45
--   packages: 45
--   tracking tokens: 45
--   status logs: 130+
--   routes: 14
--   route stops: 39
-- ================================================================
