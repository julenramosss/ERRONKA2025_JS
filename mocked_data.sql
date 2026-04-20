-- ================================================================
-- pakAG — Proba Datuak (Seed Script)
-- ================================================================
--
-- ⚠️  GARAPEN INGURUNEAN BAKARRIK — ez erabili produkzioan
--
-- PASAHITZAK
-- Erabiltzaile guztiek pasahitz berdina dute: Test1234!
-- Exekutatu hau Node.js-en hash-a sortzeko:
--
--   node -e "require('bcrypt').hash('Test1234!', 10).then(console.log)"
--
-- Emaitza kopiatu eta REPLACE_WITH_BCRYPT_HASH ordeztu behean.
-- ================================================================

BEGIN;


-- ================================================================
-- 1. USERS
-- ================================================================
INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES
  (1, 'Julen Ramos Tolosa', 'julenramostolosa@gmail.com',  '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'admin',       true,  NOW() - INTERVAL 6 MONTH),
  (2, 'Alejandro Ariza Aguilar','alejandroarizaaguilar@gmail.com',  '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', true,  NOW() - INTERVAL 4 MONTH),
  (3, 'Sergio Rocha Tolosaldea', 'sergiorochatolosaldea@gmail.com', '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', true,  NOW() - INTERVAL 3 MONTH),
  (4, 'Julen Ramos Arruti', 'jramosarruti@gmail.com',  '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', true,  NOW() - INTERVAL 2 MONTH),
  (5, 'Penelope Garcia',     'penelopeg@gmail.com',  '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC', 'distributor', false, NOW() - INTERVAL 5 MONTH);


-- ================================================================
-- 2. ADDRESSES
-- ================================================================
INSERT INTO addresses (id, street, city, postal_code, country, latitude, longitude) VALUES
  (1,  'Kale Nagusia 12',          'Donostia-San Sebastián', '20001', 'España', 43.3183, -1.9812),
  (2,  'Avenida de la Libertad 45','Donostia-San Sebastián', '20004', 'España', 43.3225, -1.9793),
  (3,  'Paseo de la Concha 8',     'Donostia-San Sebastián', '20007', 'España', 43.3178, -1.9956),
  (4,  'Calle Urbieta 23',         'Donostia-San Sebastián', '20006', 'España', 43.3199, -1.9843),
  (5,  'Etxe Zuri Kalea 7',        'Hernani',                '20120', 'España', 43.2698, -1.9759),
  (6,  'San Juan Plaza 3',         'Errenteria',             '20100', 'España', 43.3126, -1.8988),
  (7,  'Portuetxe Bidea 15',       'Donostia-San Sebastián', '20018', 'España', 43.2934, -1.9658),
  (8,  'Miraconcha Kalea 4',       'Donostia-San Sebastián', '20007', 'España', 43.3156, -2.0012),
  (9,  'Alkiza Bidea 22',          'Usurbil',                '20170', 'España', 43.2718, -2.0245),
  (10, 'San Martin Kalea 11',      'Tolosa',                 '20400', 'España', 43.1342, -2.0765),
  (11, 'Txara Kalea 33',           'Andoain',                '20140', 'España', 43.2261, -2.0034),
  (12, 'Irun Kalea 56',            'Irun',                   '20301', 'España', 43.3390, -1.7890);


-- ================================================================
-- 3. PACKAGES
-- ================================================================
INSERT INTO packages (id, tracking_code, recipient_name, recipient_email, weight_kg, status, address_id, assigned_to, created_by, created_at) VALUES
  (1,  'PAK-20260001', 'Jon Arrizabalaga',  'jon.arrizabalaga@gmail.com',  1.2, 'delivered',  1,  2,    1, NOW() - INTERVAL 10 DAY),
  (2,  'PAK-20260002', 'Miren Irazusta',    'miren.irazusta@gmail.com',    3.5, 'delivered',  2,  2,    1, NOW() - INTERVAL 8 DAY),
  (3,  'PAK-20260003', 'Itziar Goikoetxea', 'itziar.g@hotmail.com',        0.8, 'delivered',  3,  3,    1, NOW() - INTERVAL 5 DAY),
  (4,  'PAK-20260004', 'Xabier Beloki',     'xabier.beloki@outlook.com',   2.1, 'delivered',  4,  3,    1, NOW() - INTERVAL 3 DAY),
  (5,  'PAK-20260005', 'Amaia Olano',       'amaia.olano@gmail.com',       5.0, 'failed',     5,  2,    1, NOW() - INTERVAL 4 DAY),
  (6,  'PAK-20260006', 'Josu Zabala',       'josu.zabala@gmail.com',       1.8, 'in_transit', 6,  2,    1, NOW() - INTERVAL 1 DAY),
  (7,  'PAK-20260007', 'Nerea Eizaguirre',  'nerea.eizaguirre@gmail.com',  0.6, 'in_transit', 7,  2,    1, NOW() - INTERVAL 1 DAY),
  (8,  'PAK-20260008', 'Peru Txurruka',     'peru.txurruka@gmail.com',     4.2, 'in_transit', 8,  3,    1, NOW() - INTERVAL 1 DAY),
  (9,  'PAK-20260009', 'Ane Murua',         'ane.murua@gmail.com',         2.7, 'assigned',   9,  4,    1, NOW()),
  (10, 'PAK-20260010', 'Ibai Lekuona',      'ibai.lekuona@outlook.com',    1.1, 'assigned',   10, 4,    1, NOW()),
  (11, 'PAK-20260011', 'Saioa Aranburu',    'saioa.aranburu@gmail.com',    3.3, 'pending',    11, NULL, 1, NOW()),
  (12, 'PAK-20260012', 'Unai Galdos',       'unai.galdos@gmail.com',       0.9, 'pending',    12, NULL, 1, NOW());


-- ================================================================
-- 4. TOKENS (tracking)
-- ================================================================
INSERT INTO tokens (id, type, token, user_id, package_id, expires_at, revoked, created_at) VALUES
  (1,  'tracking_token', 'trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c', NULL, 1,  NOW() + INTERVAL 20 DAY, false, NOW() - INTERVAL 10 DAY),
  (2,  'tracking_token', 'trk-2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a', NULL, 2,  NOW() + INTERVAL 22 DAY, false, NOW() - INTERVAL 8 DAY),
  (3,  'tracking_token', 'trk-9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d', NULL, 3,  NOW() + INTERVAL 25 DAY, false, NOW() - INTERVAL 5 DAY),
  (4,  'tracking_token', 'trk-4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e', NULL, 4,  NOW() + INTERVAL 27 DAY, false, NOW() - INTERVAL 3 DAY),
  (5,  'tracking_token', 'trk-1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f', NULL, 5,  NOW() + INTERVAL 26 DAY, false, NOW() - INTERVAL 4 DAY),
  (6,  'tracking_token', 'trk-8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b', NULL, 6,  NOW() + INTERVAL 29 DAY, false, NOW() - INTERVAL 1 DAY),
  (7,  'tracking_token', 'trk-5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c', NULL, 7,  NOW() + INTERVAL 29 DAY, false, NOW() - INTERVAL 1 DAY),
  (8,  'tracking_token', 'trk-2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d', NULL, 8,  NOW() + INTERVAL 29 DAY, false, NOW() - INTERVAL 1 DAY),
  (9,  'tracking_token', 'trk-9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e', NULL, 9,  NOW() + INTERVAL 30 DAY, false, NOW()),
  (10, 'tracking_token', 'trk-6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f', NULL, 10, NOW() + INTERVAL 30 DAY, false, NOW()),
  (11, 'tracking_token', 'trk-3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a', NULL, 11, NOW() + INTERVAL 30 DAY, false, NOW()),
  (12, 'tracking_token', 'trk-0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b', NULL, 12, NOW() + INTERVAL 30 DAY, false, NOW());


-- ================================================================
-- 5. PACKAGE STATUS LOGS
-- ================================================================
INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by, notes, changed_at) VALUES
  -- pkg 1 → delivered (Ander)
  (1, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 10 DAY),
  (1, 'pending',    'assigned',   1, 'Anderri esleitu',                 NOW() - INTERVAL 10 DAY + INTERVAL 2 HOUR),
  (1, 'assigned',   'in_transit', 2, 'Bilketa eginda, bidean',          NOW() - INTERVAL 9 DAY),
  (1, 'in_transit', 'delivered',  2, 'Entregatu da. Sinadurak jasota.', NOW() - INTERVAL 9 DAY + INTERVAL 5 HOUR),

  -- pkg 2 → delivered (Ander)
  (2, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 8 DAY),
  (2, 'pending',    'assigned',   1, 'Anderri esleitu',                 NOW() - INTERVAL 8 DAY + INTERVAL 1 HOUR),
  (2, 'assigned',   'in_transit', 2, 'Bilketa eginda',                  NOW() - INTERVAL 7 DAY),
  (2, 'in_transit', 'delivered',  2, 'Entregatu da.',                   NOW() - INTERVAL 7 DAY + INTERVAL 3 HOUR),

  -- pkg 3 → delivered (Ainhoa)
  (3, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 5 DAY),
  (3, 'pending',    'assigned',   1, 'Ainhoari esleitu',                NOW() - INTERVAL 5 DAY + INTERVAL 1 HOUR),
  (3, 'assigned',   'in_transit', 3, 'Bidean',                         NOW() - INTERVAL 4 DAY),
  (3, 'in_transit', 'delivered',  3, 'Entregatu da.',                   NOW() - INTERVAL 4 DAY + INTERVAL 4 HOUR),

  -- pkg 4 → delivered (Ainhoa)
  (4, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 3 DAY),
  (4, 'pending',    'assigned',   1, 'Ainhoari esleitu',                NOW() - INTERVAL 3 DAY + INTERVAL 2 HOUR),
  (4, 'assigned',   'in_transit', 3, 'Bidean',                         NOW() - INTERVAL 2 DAY),
  (4, 'in_transit', 'delivered',  3, 'Entregatu da. Atean utzi.',       NOW() - INTERVAL 2 DAY + INTERVAL 6 HOUR),

  -- pkg 5 → failed (Ander)
  (5, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 4 DAY),
  (5, 'pending',    'assigned',   1, 'Anderri esleitu',                 NOW() - INTERVAL 4 DAY + INTERVAL 1 HOUR),
  (5, 'assigned',   'in_transit', 2, 'Bidean',                         NOW() - INTERVAL 3 DAY),
  (5, 'in_transit', 'failed',     2, 'Ez dago inor etxean.',           NOW() - INTERVAL 3 DAY + INTERVAL 2 HOUR),

  -- pkg 6 → in_transit (Ander)
  (6, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 1 DAY),
  (6, 'pending',    'assigned',   1, 'Anderri esleitu',                 NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR),
  (6, 'assigned',   'in_transit', 2, 'Gaur goizean abiatu da',         NOW() - INTERVAL 2 HOUR),

  -- pkg 7 → in_transit (Ander)
  (7, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 1 DAY),
  (7, 'pending',    'assigned',   1, 'Anderri esleitu',                 NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR),
  (7, 'assigned',   'in_transit', 2, 'Bidean',                         NOW() - INTERVAL 2 HOUR),

  -- pkg 8 → in_transit (Ainhoa)
  (8, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 1 DAY),
  (8, 'pending',    'assigned',   1, 'Ainhoari esleitu',                NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR),
  (8, 'assigned',   'in_transit', 3, 'Bidean',                         NOW() - INTERVAL 1 HOUR),

  -- pkg 9 → assigned (Gorka)
  (9, NULL,         'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 30 MINUTE),
  (9, 'pending',    'assigned',   1, 'Gorkari esleitu',                 NOW() - INTERVAL 10 MINUTE),

  -- pkg 10 → assigned (Gorka)
  (10, NULL,        'pending',    1, 'Pakete berria sortuta',           NOW() - INTERVAL 25 MINUTE),
  (10, 'pending',   'assigned',   1, 'Gorkari esleitu',                 NOW() - INTERVAL 10 MINUTE),

  -- pkg 11, 12 → pending
  (11, NULL,        'pending',    1, 'Pakete berria sortuta',           NOW()),
  (12, NULL,        'pending',    1, 'Pakete berria sortuta',           NOW());


-- ================================================================
-- 6. ROUTES
-- ================================================================
INSERT INTO routes (id, user_id, route_date, status, created_at) VALUES
  (1, 2, CURRENT_DATE, 'in_progress', NOW() - INTERVAL 3 HOUR),
  (2, 3, CURRENT_DATE, 'in_progress', NOW() - INTERVAL 2 HOUR);


-- ================================================================
-- 7. ROUTE STOPS
-- ================================================================
INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival, actual_arrival, created_at) VALUES
  (1, 6, 1, '09:30:00', '09:35:00', NOW() - INTERVAL 3 HOUR),
  (1, 7, 2, '10:30:00', NULL,       NOW() - INTERVAL 3 HOUR),
  (2, 8, 1, '10:45:00', NULL,       NOW() - INTERVAL 2 HOUR);


COMMIT;

-- ================================================================
-- LABURPENA / RESUMEN
-- ================================================================
--
-- ERABILTZAILEAK  | EMAIL                | PASAHITZA  | ROLA
-- ----------------+----------------------+------------+-------------------
-- Mikel           | mikel@pakag.eus      | Test1234!  | admin
-- Ander           | ander@pakag.eus      | Test1234!  | distributor
-- Ainhoa          | ainhoa@pakag.eus     | Test1234!  | distributor
-- Gorka           | gorka@pakag.eus      | Test1234!  | distributor
-- Leire           | leire@pakag.eus      | Test1234!  | distributor (DESGAITUA)
--
-- TRACKING URL adibidea:
-- GET /api/tracking/getByToken?token=trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c
-- ================================================================

--
-- ⚠️  GARAPEN INGURUNEAN BAKARRIK — ez erabili produkzioan
--
-- PASAHITZAK
-- Erabiltzaile guztiek pasahitz berdina dute: Test1234!
-- Exekutatu hau Node.js-en hash-a sortzeko:
--
--   node -e "require('bcrypt').hash('Test1234!', 10).then(console.log)"
--
-- Emaitza kopiatu eta $2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC ordeztu behean.
-- ================================================================

BEGIN;

-- ================================================================
-- GARBIKETA (CASCADE-k FK guztiak kudeatzen ditu)
-- ================================================================
TRUNCATE TABLE
  route_stops,
  routes,
  package_status_logs,
  tokens,
  packages,
  addresses,
  users
RESTART IDENTITY CASCADE;


-- ================================================================
-- 1. USERS
-- ================================================================
-- role: 'admin' | 'distributor'
-- is_active: false → desgaituta (Leire)

INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES

  -- Admin
  (
    'a0000000-0000-0000-0000-000000000001',
    'Julen Ramos Tolosa',
    'julenramostolosa@gmail.com',
    '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC',
    'admin',
    true,
    NOW() - INTERVAL '6 months'
  ),

  -- Banatzaileak (aktiboak)
  (
    'a0000000-0000-0000-0000-000000000002',
    'Alejandro Ariza Aguilar',
    'alejandroarizaaguilar@gmail.com',
    '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC',
    'distributor',
    true,
    NOW() - INTERVAL '4 months'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Julen Ramos Arruti',
    'jramosarruti@gmail.com',
    '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC',
    'distributor',
    true,
    NOW() - INTERVAL '3 months'
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Sergio Rocha Tolosaldea',
    'sergiotolosaldea@gmail.com',
    '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC',
    'distributor',
    true,
    NOW() - INTERVAL '2 months'
  ),

  -- Banatzaile desgaitua (disable/enable testetzeko)
  (
    'a0000000-0000-0000-0000-000000000005',
    'Penelope Garcia',
    'penelopeg@gmail.com',
    '$2b$10$5KOuOakmK3bUreVh7tSAKuwnwz1RZdTVx.8Dl73Kc9e9PzU8XfVUC',
    'distributor',
    false,
    NOW() - INTERVAL '5 months'
  );


-- ================================================================
-- 2. ADDRESSES
-- Donostia eta inguruko helbideak lat/lng errealekin
-- ================================================================

INSERT INTO addresses (id, street, city, postal_code, lat, lng) VALUES

  ('b0000000-0000-0000-0000-000000000001', 'Kale Nagusia 12',         'Donostia-San Sebastián', '20001', 43.3183, -1.9812),
  ('b0000000-0000-0000-0000-000000000002', 'Avenida de la Libertad 45','Donostia-San Sebastián', '20004', 43.3225, -1.9793),
  ('b0000000-0000-0000-0000-000000000003', 'Paseo de la Concha 8',    'Donostia-San Sebastián', '20007', 43.3178, -1.9956),
  ('b0000000-0000-0000-0000-000000000004', 'Calle Urbieta 23',        'Donostia-San Sebastián', '20006', 43.3199, -1.9843),
  ('b0000000-0000-0000-0000-000000000005', 'Etxe Zuri Kalea 7',       'Hernani',                '20120', 43.2698, -1.9759),
  ('b0000000-0000-0000-0000-000000000006', 'San Juan Plaza 3',        'Errenteria',             '20100', 43.3126, -1.8988),
  ('b0000000-0000-0000-0000-000000000007', 'Portuetxe Bidea 15',      'Donostia-San Sebastián', '20018', 43.2934, -1.9658),
  ('b0000000-0000-0000-0000-000000000008', 'Miraconcha Kalea 4',      'Donostia-San Sebastián', '20007', 43.3156, -2.0012),
  ('b0000000-0000-0000-0000-000000000009', 'Alkiza Bidea 22',         'Usurbil',                '20170', 43.2718, -2.0245),
  ('b0000000-0000-0000-0000-000000000010', 'San Martin Kalea 11',     'Tolosa',                 '20400', 43.1342, -2.0765),
  ('b0000000-0000-0000-0000-000000000011', 'Txara Kalea 33',          'Andoain',                '20140', 43.2261, -2.0034),
  ('b0000000-0000-0000-0000-000000000012', 'Irun Kalea 56',           'Irun',                   '20301', 43.3390, -1.7890);


-- ================================================================
-- 3. PACKAGES
-- status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed'
--
-- Egitura:
--   pkg 001-004 → entregatu dira (historikoa)
--   pkg 005     → failed (entregatu ez)
--   pkg 006-008 → gaur in_transit (Ander eta Ainhoa bidean)
--   pkg 009-010 → gaur assigned (Gorka jasoko du)
--   pkg 011-012 → pending (ez esleituta oraindik)
-- ================================================================

INSERT INTO packages (id, recipient_name, recipient_email, weight, status, address_id, assigned_to, created_by, created_at) VALUES

  -- Historikoa - entregaturikoak
  ('c0000000-0000-0000-0000-000000000001', 'Jon Arrizabalaga',  'jon.arrizabalaga@gmail.com',  1.2, 'delivered', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days'),
  ('c0000000-0000-0000-0000-000000000002', 'Miren Irazusta',    'miren.irazusta@gmail.com',    3.5, 'delivered', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days'),
  ('c0000000-0000-0000-0000-000000000003', 'Itziar Goikoetxea', 'itziar.g@hotmail.com',        0.8, 'delivered', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days'),
  ('c0000000-0000-0000-0000-000000000004', 'Xabier Beloki',     'xabier.beloki@outlook.com',   2.1, 'delivered', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days'),

  -- Historikoa - huts egindakoa
  ('c0000000-0000-0000-0000-000000000005', 'Amaia Olano',       'amaia.olano@gmail.com',       5.0, 'failed',    'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 days'),

  -- Gaur - bidean (in_transit)
  ('c0000000-0000-0000-0000-000000000006', 'Josu Zabala',       'josu.zabala@gmail.com',       1.8, 'in_transit','b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000007', 'Nerea Eizaguirre',  'nerea.eizaguirre@gmail.com',  0.6, 'in_transit','b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000008', 'Peru Txurruka',     'peru.txurruka@gmail.com',     4.2, 'in_transit','b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),

  -- Gaur - esleituta baina oraindik jaso ez (Gorka)
  ('c0000000-0000-0000-0000-000000000009', 'Ane Murua',         'ane.murua@gmail.com',         2.7, 'assigned',  'b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NOW()),
  ('c0000000-0000-0000-0000-000000000010', 'Ibai Lekuona',      'ibai.lekuona@outlook.com',    1.1, 'assigned',  'b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NOW()),

  -- Pending - ez esleituta oraindik
  ('c0000000-0000-0000-0000-000000000011', 'Saioa Aranburu',    'saioa.aranburu@gmail.com',    3.3, 'pending',   'b0000000-0000-0000-0000-000000000011', NULL, 'a0000000-0000-0000-0000-000000000001', NOW()),
  ('c0000000-0000-0000-0000-000000000012', 'Unai Galdos',       'unai.galdos@gmail.com',       0.9, 'pending',   'b0000000-0000-0000-0000-000000000012', NULL, 'a0000000-0000-0000-0000-000000000001', NOW());


-- ================================================================
-- 4. TOKENS
-- Refresh tokenak ez dira sartzen (login egitean sortzen dira).
-- Tracking tokenak bai, pakete bakoitzeko bat.
-- ================================================================

INSERT INTO tokens (id, type, token, user_id, package_id, expires_at, revoked, created_at) VALUES

  ('d0000000-0000-0000-0000-000000000001', 'tracking_token', 'trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c', NULL, 'c0000000-0000-0000-0000-000000000001', NOW() + INTERVAL '20 days', false, NOW() - INTERVAL '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'tracking_token', 'trk-2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a', NULL, 'c0000000-0000-0000-0000-000000000002', NOW() + INTERVAL '22 days', false, NOW() - INTERVAL '8 days'),
  ('d0000000-0000-0000-0000-000000000003', 'tracking_token', 'trk-9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d', NULL, 'c0000000-0000-0000-0000-000000000003', NOW() + INTERVAL '25 days', false, NOW() - INTERVAL '5 days'),
  ('d0000000-0000-0000-0000-000000000004', 'tracking_token', 'trk-4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e', NULL, 'c0000000-0000-0000-0000-000000000004', NOW() + INTERVAL '27 days', false, NOW() - INTERVAL '3 days'),
  ('d0000000-0000-0000-0000-000000000005', 'tracking_token', 'trk-1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f', NULL, 'c0000000-0000-0000-0000-000000000005', NOW() + INTERVAL '26 days', false, NOW() - INTERVAL '4 days'),
  ('d0000000-0000-0000-0000-000000000006', 'tracking_token', 'trk-8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b', NULL, 'c0000000-0000-0000-0000-000000000006', NOW() + INTERVAL '29 days', false, NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000007', 'tracking_token', 'trk-5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c', NULL, 'c0000000-0000-0000-0000-000000000007', NOW() + INTERVAL '29 days', false, NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000008', 'tracking_token', 'trk-2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d', NULL, 'c0000000-0000-0000-0000-000000000008', NOW() + INTERVAL '29 days', false, NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000009', 'tracking_token', 'trk-9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e', NULL, 'c0000000-0000-0000-0000-000000000009', NOW() + INTERVAL '30 days', false, NOW()),
  ('d0000000-0000-0000-0000-000000000010', 'tracking_token', 'trk-6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f', NULL, 'c0000000-0000-0000-0000-000000000010', NOW() + INTERVAL '30 days', false, NOW()),
  ('d0000000-0000-0000-0000-000000000011', 'tracking_token', 'trk-3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a', NULL, 'c0000000-0000-0000-0000-000000000011', NOW() + INTERVAL '30 days', false, NOW()),
  ('d0000000-0000-0000-0000-000000000012', 'tracking_token', 'trk-0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b', NULL, 'c0000000-0000-0000-0000-000000000012', NOW() + INTERVAL '30 days', false, NOW());


-- ================================================================
-- 5. PACKAGE STATUS LOGS
-- Pakete bakoitzaren egoera-aldaketen historia osoa.
-- ================================================================

INSERT INTO package_status_logs (package_id, status, changed_by, notes, created_at) VALUES

  -- pkg 001 → delivered (Ander)
  ('c0000000-0000-0000-0000-000000000001', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '10 days'),
  ('c0000000-0000-0000-0000-000000000001', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Anderri esleitu',                  NOW() - INTERVAL '10 days' + INTERVAL '2 hours'),
  ('c0000000-0000-0000-0000-000000000001', 'in_transit', 'a0000000-0000-0000-0000-000000000002', 'Bilketa eginda, bidean',           NOW() - INTERVAL '9 days'),
  ('c0000000-0000-0000-0000-000000000001', 'delivered',  'a0000000-0000-0000-0000-000000000002', 'Entregatu da. Sinadurak jasota.',  NOW() - INTERVAL '9 days' + INTERVAL '5 hours'),

  -- pkg 002 → delivered (Ander)
  ('c0000000-0000-0000-0000-000000000002', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '8 days'),
  ('c0000000-0000-0000-0000-000000000002', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Anderri esleitu',                  NOW() - INTERVAL '8 days' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000002', 'in_transit', 'a0000000-0000-0000-0000-000000000002', 'Bilketa eginda',                   NOW() - INTERVAL '7 days'),
  ('c0000000-0000-0000-0000-000000000002', 'delivered',  'a0000000-0000-0000-0000-000000000002', 'Entregatu da.',                    NOW() - INTERVAL '7 days' + INTERVAL '3 hours'),

  -- pkg 003 → delivered (Ainhoa)
  ('c0000000-0000-0000-0000-000000000003', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '5 days'),
  ('c0000000-0000-0000-0000-000000000003', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Ainhoari esleitu',                 NOW() - INTERVAL '5 days' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000003', 'in_transit', 'a0000000-0000-0000-0000-000000000003', 'Bidean',                          NOW() - INTERVAL '4 days'),
  ('c0000000-0000-0000-0000-000000000003', 'delivered',  'a0000000-0000-0000-0000-000000000003', 'Entregatu da.',                   NOW() - INTERVAL '4 days' + INTERVAL '4 hours'),

  -- pkg 004 → delivered (Ainhoa)
  ('c0000000-0000-0000-0000-000000000004', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '3 days'),
  ('c0000000-0000-0000-0000-000000000004', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Ainhoari esleitu',                 NOW() - INTERVAL '3 days' + INTERVAL '2 hours'),
  ('c0000000-0000-0000-0000-000000000004', 'in_transit', 'a0000000-0000-0000-0000-000000000003', 'Bidean',                          NOW() - INTERVAL '2 days'),
  ('c0000000-0000-0000-0000-000000000004', 'delivered',  'a0000000-0000-0000-0000-000000000003', 'Entregatu da. Atean utzi.',        NOW() - INTERVAL '2 days' + INTERVAL '6 hours'),

  -- pkg 005 → failed (Ander - inor ez etxean)
  ('c0000000-0000-0000-0000-000000000005', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '4 days'),
  ('c0000000-0000-0000-0000-000000000005', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Anderri esleitu',                  NOW() - INTERVAL '4 days' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000005', 'in_transit', 'a0000000-0000-0000-0000-000000000002', 'Bidean',                          NOW() - INTERVAL '3 days'),
  ('c0000000-0000-0000-0000-000000000005', 'failed',     'a0000000-0000-0000-0000-000000000002', 'Ez dago inor etxean. Bihar saiatu.',NOW() - INTERVAL '3 days' + INTERVAL '2 hours'),

  -- pkg 006 → in_transit (Ander, gaur)
  ('c0000000-0000-0000-0000-000000000006', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000006', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Anderri esleitu',                  NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000006', 'in_transit', 'a0000000-0000-0000-0000-000000000002', 'Gaur goizean abiatu da',           NOW() - INTERVAL '2 hours'),

  -- pkg 007 → in_transit (Ander, gaur)
  ('c0000000-0000-0000-0000-000000000007', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000007', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Anderri esleitu',                  NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000007', 'in_transit', 'a0000000-0000-0000-0000-000000000002', 'Bidean',                          NOW() - INTERVAL '2 hours'),

  -- pkg 008 → in_transit (Ainhoa, gaur)
  ('c0000000-0000-0000-0000-000000000008', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000008', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Ainhoari esleitu',                 NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000008', 'in_transit', 'a0000000-0000-0000-0000-000000000003', 'Bidean',                          NOW() - INTERVAL '1 hour'),

  -- pkg 009 → assigned (Gorka, gaur)
  ('c0000000-0000-0000-0000-000000000009', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '30 minutes'),
  ('c0000000-0000-0000-0000-000000000009', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Gorkari esleitu',                  NOW() - INTERVAL '10 minutes'),

  -- pkg 010 → assigned (Gorka, gaur)
  ('c0000000-0000-0000-0000-000000000010', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW() - INTERVAL '25 minutes'),
  ('c0000000-0000-0000-0000-000000000010', 'assigned',   'a0000000-0000-0000-0000-000000000001', 'Gorkari esleitu',                  NOW() - INTERVAL '10 minutes'),

  -- pkg 011, 012 → pending (ez esleituta)
  ('c0000000-0000-0000-0000-000000000011', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW()),
  ('c0000000-0000-0000-0000-000000000012', 'pending',    'a0000000-0000-0000-0000-000000000001', 'Pakete berria sortuta',            NOW());


-- ================================================================
-- 6. ROUTES - Eguneko ibilbideak
-- ================================================================

INSERT INTO routes (id, user_id, date, created_at) VALUES
  -- Ander - gaurko ibilbidea (pkg 006, 007)
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() - INTERVAL '3 hours'),
  -- Ainhoa - gaurko ibilbidea (pkg 008)
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', CURRENT_DATE, NOW() - INTERVAL '2 hours');


-- ================================================================
-- 7. ROUTE STOPS - Ibilbideko geldialdia bakoitza
-- ================================================================

INSERT INTO route_stops (route_id, package_id, order_index, estimated_time, arrival_time, created_at) VALUES

  -- Ander-en geldialdia 1: pkg 006 (Errenteria) - iritsi da
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 1, NOW() - INTERVAL '1 hour',   NOW() - INTERVAL '55 minutes', NOW() - INTERVAL '3 hours'),
  -- Ander-en geldialdia 2: pkg 007 (Portuetxe) - bidean doa oraindik
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 2, NOW() + INTERVAL '30 minutes', NULL,                        NOW() - INTERVAL '3 hours'),

  -- Ainhoa-ren geldialdia 1: pkg 008 (Miraconcha) - bidean
  ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008', 1, NOW() + INTERVAL '45 minutes', NULL,                        NOW() - INTERVAL '2 hours');


COMMIT;

-- ================================================================
-- LABURPENA / RESUMEN
-- ================================================================
--
-- ERABILTZAILEAK        | EMAIL                | PASAHITZA   | ROLA
-- ----------------------+----------------------+-------------+-----------
-- Mikel Etxeberria      | mikel@pakag.eus      | Test1234!   | admin
-- Ander Zubizarreta     | ander@pakag.eus      | Test1234!   | distributor
-- Ainhoa Larrañaga      | ainhoa@pakag.eus     | Test1234!   | distributor
-- Gorka Mendizabal      | gorka@pakag.eus      | Test1234!   | distributor
-- Leire Arruti          | leire@pakag.eus      | Test1234!   | distributor (DESGAITUA)
--
-- PAKETEAK              | EGOERA      | ESLEITUTA
-- ----------------------+-------------+----------
-- pkg 001-004           | delivered   | Ander / Ainhoa (historikoa)
-- pkg 005               | failed      | Ander (historikoa)
-- pkg 006-007           | in_transit  | Ander (gaur bidean)
-- pkg 008               | in_transit  | Ainhoa (gaur bidean)
-- pkg 009-010           | assigned    | Gorka (jasoko du)
-- pkg 011-012           | pending     | Inor ez (esleitu gabe)
--
-- TRACKING URL adibidea (public, ez da auth behar):
-- GET /api/tracking/getByToken?token=trk-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c
-- ================================================================