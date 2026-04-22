-- ================================================================
-- pakAG - Development seed data
-- FOCO: Escenarios de myRoute para jramosarruti@gmail.com
-- ================================================================
--
-- INSTRUCCIONES:
--   Cambia @test_scenario al número que quieras probar y ejecuta
--   este fichero completo en MySQL Workbench o tu cliente SQL.
--
--   1  Ruta cruzó medianoche — in_progress de AYER, aún activa   ← DEFAULT
--   2  Ruta de HOY en planned — botón "Ibilbidea hasi" activo
--   3  Ruta de MAÑANA en planned — botón desactivado + aviso
--   4  Sin ruta + 6 paquetes undelivered — botón "Ruta hau gaur egin"
--   5  Sin ruta ni paquetes — EmptyRouteState limpio
--
-- Login de todos los usuarios: contraseña Test1234!
-- ================================================================

USE erronka;

SET @test_scenario = 2;   -- ← CAMBIA ESTO (1..5)

SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM route_stops;
DELETE FROM routes;
DELETE FROM package_status_logs;
DELETE FROM tokens;
DELETE FROM packages;
DELETE FROM addresses;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

START TRANSACTION;

SET @password_hash   = '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC';
SET @rcpt_email      = 'jramosarruti@gmail.com';
SET @admin_id        = 1;
SET @alejandro_id    = 2;
SET @julen_arruti_id = 3;
SET @sergio_id       = 4;

-- ================================================================
-- 1. USUARIOS
-- ================================================================
INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES
  (@admin_id,        'Julen Ramos Tolosa',       'julenramostolosa@gmail.com',       @password_hash, 'admin',       TRUE, NOW() - INTERVAL 6 MONTH),
  (@alejandro_id,    'Alejandro Ariza Aguilar',  'alejandroarizaaguilar@gmail.com',  @password_hash, 'distributor', TRUE, NOW() - INTERVAL 4 MONTH),
  (@julen_arruti_id, 'Julen Ramos Arruti',       'jramosarruti@gmail.com',           @password_hash, 'distributor', TRUE, NOW() - INTERVAL 3 MONTH),
  (@sergio_id,       'Sergio Rocha Tolosaldea',  'sergiotolosaldea@gmail.com',       @password_hash, 'admin',       TRUE, NOW() - INTERVAL 2 MONTH);

-- ================================================================
-- 2. DIRECCIONES (base geográfica de la app)
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
  (30, 'Bidebarrieta 22',          'Bergara',                '20570', 'Espana', 43.1189000, -2.4134000);

-- ================================================================
-- 3. PAQUETES — tabla temporal para generar tokens y logs
-- ================================================================
DROP TEMPORARY TABLE IF EXISTS seed_packages;

CREATE TEMPORARY TABLE seed_packages (
  id               INT UNSIGNED  NOT NULL PRIMARY KEY,
  tracking_code    VARCHAR(50)   NOT NULL,
  recipient_name   VARCHAR(150)  NOT NULL,
  weight_kg        DECIMAL(6,3)  NOT NULL,
  description      TEXT          NULL,
  status           VARCHAR(20)   NOT NULL,
  estimated_delivery DATE        NULL,
  address_id       INT UNSIGNED  NOT NULL,
  assigned_to      INT UNSIGNED  NULL,
  pending_at       DATETIME      NOT NULL,
  assigned_at      DATETIME      NULL,
  transit_at       DATETIME      NULL,
  final_at         DATETIME      NULL
);

-- ----------------------------------------------------------------
-- Historial de Alejandro (siempre presente, rutas completadas)
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
VALUES
  (1, 'PAK-DEV-0001', 'Miren Irazusta',   2.100, 'Caja de documentacion',   'delivered',
      CURRENT_DATE - INTERVAL 7 DAY,  1, @alejandro_id,
      TIMESTAMP(CURRENT_DATE - INTERVAL 8  DAY, '08:00:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 8  DAY, '08:30:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 7  DAY, '09:00:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 7  DAY, '10:30:00')),
  (2, 'PAK-DEV-0002', 'Jon Arrizabalaga', 1.400, 'Sobre acolchado',         'failed',
      CURRENT_DATE - INTERVAL 7 DAY,  2, @alejandro_id,
      TIMESTAMP(CURRENT_DATE - INTERVAL 8  DAY, '08:10:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 8  DAY, '08:35:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 7  DAY, '09:10:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 7  DAY, '12:00:00'));

-- ----------------------------------------------------------------
-- Historial de Sergio (siempre presente, rutas completadas)
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
VALUES
  (3, 'PAK-DEV-0003', 'Itziar Goikoetxea', 3.200, 'Reposicion de tienda', 'delivered',
      CURRENT_DATE - INTERVAL 5 DAY,  3, @sergio_id,
      TIMESTAMP(CURRENT_DATE - INTERVAL 6  DAY, '09:00:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 6  DAY, '09:30:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 5  DAY, '08:30:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 5  DAY, '11:00:00')),
  (4, 'PAK-DEV-0004', 'Xabier Beloki',     0.900, 'Pedido de farmacia',   'failed',
      CURRENT_DATE - INTERVAL 5 DAY,  4, @sergio_id,
      TIMESTAMP(CURRENT_DATE - INTERVAL 6  DAY, '09:05:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 6  DAY, '09:35:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 5  DAY, '08:35:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 5  DAY, '13:20:00'));

-- ================================================================
-- PAQUETES DE jramosarruti — CONDICIONALES POR ESCENARIO
-- ================================================================

-- ----------------------------------------------------------------
-- ESCENARIO 1: Ruta cruzó medianoche
--   Parada 1 → entregada ayer mañana
--   Paradas 2 y 3 → siguen en in_transit (nadie las ha entregado todavía)
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 10, 'PAK-S1-001', 'Amaia Olano',      1.800, 'Entregada antes del cambio de dia', 'delivered',
  CURRENT_DATE - INTERVAL 1 DAY,  5, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:00:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:30:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:30:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '09:45:00')
FROM dual WHERE @test_scenario = 1;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 11, 'PAK-S1-002', 'Josu Zabala',      2.500, 'Pendiente tras cambio de dia',      'in_transit',
  CURRENT_DATE - INTERVAL 1 DAY,  6, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:05:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:35:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:35:00'),
  NULL
FROM dual WHERE @test_scenario = 1;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 12, 'PAK-S1-003', 'Nerea Eizaguirre', 1.100, 'Pendiente tras cambio de dia',      'in_transit',
  CURRENT_DATE - INTERVAL 1 DAY,  7, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:10:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 2 DAY, '10:40:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:40:00'),
  NULL
FROM dual WHERE @test_scenario = 1;

-- ----------------------------------------------------------------
-- ESCENARIO 2: Ruta de HOY en planned
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 13, 'PAK-S2-001', 'Peru Txurruka',    3.000, 'Paquete asignado para hoy', 'assigned',
  CURRENT_DATE,  8, @julen_arruti_id,
  NOW() - INTERVAL 180 MINUTE,  NOW() - INTERVAL 60 MINUTE,  NULL, NULL
FROM dual WHERE @test_scenario = 2;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 14, 'PAK-S2-002', 'Ane Murua',        0.750, 'Paquete asignado para hoy', 'assigned',
  CURRENT_DATE,  9, @julen_arruti_id,
  NOW() - INTERVAL 175 MINUTE,  NOW() - INTERVAL 55 MINUTE,  NULL, NULL
FROM dual WHERE @test_scenario = 2;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 15, 'PAK-S2-003', 'Ibai Lekuona',     2.200, 'Paquete asignado para hoy', 'assigned',
  CURRENT_DATE, 10, @julen_arruti_id,
  NOW() - INTERVAL 170 MINUTE,  NOW() - INTERVAL 50 MINUTE,  NULL, NULL
FROM dual WHERE @test_scenario = 2;

-- ----------------------------------------------------------------
-- ESCENARIO 3: Ruta de MAÑANA en planned
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 16, 'PAK-S3-001', 'Saioa Aranburu',   4.500, 'Paquete para manana', 'assigned',
  CURRENT_DATE + INTERVAL 1 DAY, 11, @julen_arruti_id,
  NOW() - INTERVAL 120 MINUTE,  NOW() - INTERVAL 30 MINUTE,  NULL, NULL
FROM dual WHERE @test_scenario = 3;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 17, 'PAK-S3-002', 'Unai Galdos',      1.600, 'Paquete para manana', 'assigned',
  CURRENT_DATE + INTERVAL 1 DAY, 12, @julen_arruti_id,
  NOW() - INTERVAL 115 MINUTE,  NOW() - INTERVAL 25 MINUTE,  NULL, NULL
FROM dual WHERE @test_scenario = 3;

-- ----------------------------------------------------------------
-- ESCENARIO 4: Sin ruta + 6 paquetes undelivered
--   La ruta de hace 3 días fue completada antes de entregar todos
--   los paquetes → checkPackageStatus los marcó como undelivered
-- ----------------------------------------------------------------
INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 18, 'PAK-S4-001', 'Maialen Irizar',   1.200, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 13, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:00:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:30:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:30:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 19, 'PAK-S4-002', 'Eneko Lasa',       2.800, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 14, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:05:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:35:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:35:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 20, 'PAK-S4-003', 'Lide Otegi',       0.650, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 15, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:10:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:40:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:40:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 21, 'PAK-S4-004', 'Iker Alberdi',     3.100, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 16, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:15:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:45:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:45:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 22, 'PAK-S4-005', 'June Etxeberria',  1.900, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 17, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:20:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:50:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:50:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

INSERT INTO seed_packages
  (id, tracking_code, recipient_name, weight_kg, description, status, estimated_delivery, address_id, assigned_to, pending_at, assigned_at, transit_at, final_at)
SELECT 23, 'PAK-S4-006', 'Markel Arrieta',   5.700, 'Sin entregar al cerrar ruta', 'undelivered',
  CURRENT_DATE - INTERVAL 3 DAY, 18, @julen_arruti_id,
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:25:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 4 DAY, '09:55:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:55:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

-- ESCENARIO 5: Sin paquetes para jramosarruti (nada que insertar)

-- ================================================================
-- 4. PACKAGES (desde tabla temporal)
-- ================================================================
INSERT INTO packages (
  id, tracking_code, recipient_name, recipient_email,
  weight_kg, description, status, estimated_delivery,
  address_id, assigned_to, created_by, created_at, updated_at
)
SELECT
  id, tracking_code, recipient_name, @rcpt_email,
  weight_kg, description, status, estimated_delivery,
  address_id, assigned_to, @admin_id, pending_at,
  COALESCE(final_at, transit_at, assigned_at, pending_at)
FROM seed_packages;

-- ================================================================
-- 5. TOKENS DE SEGUIMIENTO
-- ================================================================
INSERT INTO tokens (id, token, type, user_id, package_id, expires_at, revoked, created_at)
SELECT
  id,
  CONCAT('trk-dev-', LPAD(id, 4, '0'), '-', LEFT(SHA2(CONCAT('pakag-dev-token-', id), 256), 24)),
  'tracking_token', NULL, id,
  COALESCE(final_at, transit_at, assigned_at, pending_at) + INTERVAL 30 DAY,
  FALSE, pending_at
FROM seed_packages;

-- ================================================================
-- 6. LOGS DE ESTADO DE PAQUETES
-- ================================================================
INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT id, NULL, 'pending', @admin_id, 'Paquete creado en entorno de desarrollo', pending_at
FROM seed_packages;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT sp.id, 'pending', 'assigned', @admin_id,
  CONCAT('Asignado a ', u.name),
  sp.assigned_at
FROM seed_packages sp
JOIN users u ON u.id = sp.assigned_to
WHERE sp.assigned_at IS NOT NULL;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT id, 'assigned', 'in_transit', assigned_to, 'Cargado en ruta', transit_at
FROM seed_packages
WHERE transit_at IS NOT NULL;

INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at)
SELECT id, 'in_transit', status, assigned_to,
  CASE
    WHEN status = 'delivered'   THEN 'Entregado correctamente.'
    WHEN status = 'failed'      THEN 'Entrega fallida.'
    WHEN status = 'undelivered' THEN 'No entregado al cerrar la ruta.'
  END,
  final_at
FROM seed_packages
WHERE final_at IS NOT NULL;

-- ================================================================
-- 7. RUTAS
-- ================================================================

-- Rutas históricas de otros repartidores (siempre presentes)
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at) VALUES
  (1, @alejandro_id, CURRENT_DATE - INTERVAL 7 DAY, 'completed',
      TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '07:30:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '12:00:00')),
  (2, @sergio_id,    CURRENT_DATE - INTERVAL 5 DAY, 'completed',
      TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '07:45:00'),
      TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '13:30:00'));

-- ESCENARIO 1: Ruta iniciada ayer, sigue in_progress (cruzó medianoche)
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at)
SELECT 10, @julen_arruti_id,
  CURRENT_DATE - INTERVAL 1 DAY, 'in_progress',
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '23:50:00')
FROM dual WHERE @test_scenario = 1;

-- ESCENARIO 2: Ruta para HOY, planned
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at)
SELECT 11, @julen_arruti_id,
  CURRENT_DATE + 1, 'planned',
  NOW() - INTERVAL 60 MINUTE, NOW() - INTERVAL 60 MINUTE
FROM dual WHERE @test_scenario = 2;

-- ESCENARIO 3: Ruta para MAÑANA, planned
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at)
SELECT 12, @julen_arruti_id,
  CURRENT_DATE + INTERVAL 1 DAY, 'planned',
  NOW() - INTERVAL 45 MINUTE, NOW() - INTERVAL 45 MINUTE
FROM dual WHERE @test_scenario = 3;

-- ESCENARIO 4: Ruta completada hace 3 días, paquetes quedaron undelivered
INSERT INTO routes (id, user_id, route_date, status, created_at, updated_at)
SELECT 13, @julen_arruti_id,
  CURRENT_DATE - INTERVAL 3 DAY, 'completed',
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00'),
  TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '17:00:00')
FROM dual WHERE @test_scenario = 4;

-- ESCENARIO 5: Sin rutas para jramosarruti (nada que insertar)

-- ================================================================
-- 8. PARADAS DE RUTA
-- ================================================================

-- Paradas históricas de otros repartidores
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at) VALUES
  (1, 1, 1, '09:30:00', '10:30:00', TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '07:35:00')),
  (1, 2, 2, '11:00:00', '12:00:00', TIMESTAMP(CURRENT_DATE - INTERVAL 7 DAY, '07:35:00')),
  (2, 3, 1, '09:30:00', '11:00:00', TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '07:50:00')),
  (2, 4, 2, '12:00:00', '13:20:00', TIMESTAMP(CURRENT_DATE - INTERVAL 5 DAY, '07:50:00'));

-- ESCENARIO 1: Parada 1 entregada, paradas 2 y 3 sin actual_arrival (no visitadas aún)
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 10, 10, 1, '09:00:00', '09:45:00',
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')
FROM dual WHERE @test_scenario = 1;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 10, 11, 2, '10:30:00', NULL,
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')
FROM dual WHERE @test_scenario = 1;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 10, 12, 3, '11:15:00', NULL,
  TIMESTAMP(CURRENT_DATE - INTERVAL 1 DAY, '08:00:00')
FROM dual WHERE @test_scenario = 1;

-- ESCENARIO 2: 3 paradas pendientes (ruta no iniciada aún)
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 11, 13, 1, '09:00:00', NULL, NOW() - INTERVAL 60 MINUTE FROM dual WHERE @test_scenario = 2;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 11, 14, 2, '10:00:00', NULL, NOW() - INTERVAL 60 MINUTE FROM dual WHERE @test_scenario = 2;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 11, 15, 3, '11:00:00', NULL, NOW() - INTERVAL 60 MINUTE FROM dual WHERE @test_scenario = 2;

-- ESCENARIO 3: 2 paradas de mañana (no pueden interactuarse hoy)
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 12, 16, 1, '09:00:00', NULL, NOW() - INTERVAL 45 MINUTE FROM dual WHERE @test_scenario = 3;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 12, 17, 2, '10:30:00', NULL, NOW() - INTERVAL 45 MINUTE FROM dual WHERE @test_scenario = 3;

-- ESCENARIO 4: 6 paradas, ruta completada, paquetes quedaron sin entregar
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 18, 1, '09:00:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 19, 2, '09:30:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 20, 3, '10:00:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 21, 4, '10:30:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 22, 5, '11:00:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at)
SELECT 13, 23, 6, '11:30:00', NULL, TIMESTAMP(CURRENT_DATE - INTERVAL 3 DAY, '08:00:00') FROM dual WHERE @test_scenario = 4;

-- ESCENARIO 5: Sin paradas (nada que insertar)

DROP TEMPORARY TABLE IF EXISTS seed_packages;

COMMIT;

-- ================================================================
-- QUÉ VER EN EL FRONTEND POR ESCENARIO
-- ================================================================
--
-- LOGIN: jramosarruti@gmail.com / Test1234!
-- URL:   /myRoute
--
-- ----------------------------------------------------------------
-- ESCENARIO 1 — Ruta cruzó medianoche (in_progress de AYER activa)
-- ----------------------------------------------------------------
--   La página carga la ruta de AYER porque tiene prioridad 0
--   en la query (status = in_progress).
--
--   Qué ver:
--     Header izq: fecha de ayer · "Martxan" · "1/3 geldialdi osatuta"
--     Header der: botón "Ibilbidea bukatu" ACTIVO (azul, no disabled)
--     Aviso:      NINGUNO (el banner solo sale para planned+futuro)
--     Lista:      Parada 1 (Amaia Olano) → círculo verde con check ✓
--                 Parada 2 (Josu Zabala) → ACTIVA, badge "Garraioan",
--                   botones "Entregatuta" y "Huts" habilitados
--                 Parada 3 (Nerea Eizaguirre) → en espera, sin botones
--
--   Acciones a probar:
--     A) Entregar parada 2 → se activa parada 3 → entregar → ruta se
--        autocompleta (todos los paquetes terminales)
--     B) Pulsar "Ibilbidea bukatu" directamente → paradas 2 y 3 pasan
--        a "undelivered" → ruta se completa → página muestra EmptyRouteState
--        (nuevo comportamiento que acabamos de implementar)
--
-- ----------------------------------------------------------------
-- ESCENARIO 2 — Ruta de HOY en planned (puede iniciar)
-- ----------------------------------------------------------------
--   Qué ver:
--     Header izq: "Gaurko ruta" · fecha de hoy · "Planifikatuta"
--     Header der: botón "Ibilbidea hasi" ACTIVO
--     Aviso:      NINGUNO
--     Lista:      3 paradas con badge "Esleituta" (sin botones de entrega)
--
--   Acciones a probar:
--     Pulsar "Ibilbidea hasi" → los 3 paquetes pasan a in_transit →
--     ruta pasa a in_progress → parada 1 se activa con botones
--
-- ----------------------------------------------------------------
-- ESCENARIO 3 — Ruta de MAÑANA en planned (no puede iniciar hoy)
-- ----------------------------------------------------------------
--   Qué ver:
--     Header izq: "Hurrengo ruta" · fecha de mañana · "Planifikatuta"
--     Header der: botón "Ibilbidea hasi" DESACTIVADO (gris, disabled)
--     Aviso:      "Ruta hau beste egun batekoa da. Planifikatuta dago,
--                  baina gaur ezin da hasi."
--     Lista:      2 paradas con badge "Esleituta"
--
--   Este escenario verifica que la ruta del día siguiente ya se muestra
--   (antes no aparecía nada hasta hoy), pero no se puede iniciar.
--
-- ----------------------------------------------------------------
-- ESCENARIO 4 — Sin ruta + 6 paquetes undelivered
-- ----------------------------------------------------------------
--   Qué ver:
--     Página principal: EmptyRouteState (icono de ruta)
--     Texto:    "Ez dago gaurko ruta pendenterik"
--     Sección aviso:
--       "6 pakete geratu dira entregatu gabe [fecha -3 días]eko rutan."
--       Botón "Ruta hau gaur egin" VISIBLE Y ACTIVO
--
--   Acciones a probar:
--     Pulsar "Ruta hau gaur egin" → llama a POST /api/routes/continueFromPast
--     → crea ruta de hoy in_progress con los 6 paquetes migrados →
--     página recarga mostrando la ruta activa (igual que Escenario 2
--     pero ya in_progress)
--
-- ----------------------------------------------------------------
-- ESCENARIO 5 — Sin ruta ni paquetes pendientes
-- ----------------------------------------------------------------
--   Qué ver:
--     EmptyRouteState limpio:
--       "Ez dago gaurko ruta pendenterik"
--       "Gaur ez daukazu hasteko edo jarraitzeko rutarik."
--     Botón de recuperar: NO aparece (no hay nada que recuperar)
--
-- ================================================================
