-- ============================================================
-- pakAG - Sistema Informatikoa
-- Datu-Base Eskema - MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS erronka
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE erronka;

USE erronka;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS route_stops;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS package_status_logs;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 1. ADDRESSES - Entrega-helbideak lat/lng koordinatuekin
-- ------------------------------------------------------------
CREATE TABLE addresses (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  street        VARCHAR(255)    NOT NULL,
  city          VARCHAR(100)    NOT NULL,
  postal_code   VARCHAR(20)     NOT NULL,
  country       VARCHAR(100)    NOT NULL DEFAULT 'España',
  latitude      DECIMAL(10, 7)  NOT NULL,
  longitude     DECIMAL(10, 7)  NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- 2. USERS - Kudeatzaileak eta banatzaileak
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(150)    NOT NULL,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('admin', 'distributor') NOT NULL DEFAULT 'distributor',
  is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- 3. PACKAGES - Pakete guztiak
-- ------------------------------------------------------------
CREATE TABLE packages (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  tracking_code       VARCHAR(50)     NOT NULL UNIQUE,   -- kode laburra (ej. PAK-20260001)
  recipient_name      VARCHAR(150)    NOT NULL,
  recipient_email     VARCHAR(255)    NOT NULL,
  weight_kg           DECIMAL(6, 3)   NOT NULL,
  description         TEXT            NULL,
  status              ENUM(
                        'pending',       -- sortuta, esleitu gabe
                        'assigned',      -- banatzaileari esleituta
                        'in_transit',    -- bidalketan
                        'delivered',     -- entregatu
                        'failed'         -- entrega huts egin du
                      ) NOT NULL DEFAULT 'pending',
  estimated_delivery  DATE            NULL,
  address_id          INT UNSIGNED    NOT NULL,
  assigned_to         INT UNSIGNED    NULL,               -- banatzailea (users.id)
  created_by          INT UNSIGNED    NOT NULL,           -- admin (users.id)
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_packages_address   FOREIGN KEY (address_id)   REFERENCES addresses (id),
  CONSTRAINT fk_packages_assignee  FOREIGN KEY (assigned_to)  REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_packages_creator   FOREIGN KEY (created_by)   REFERENCES users (id)
);

-- ------------------------------------------------------------
-- 4. TOKENS - Refresh tokenak + Tracking tokenak taula bakarrean
-- ------------------------------------------------------------
CREATE TABLE tokens (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  token       VARCHAR(512)    NOT NULL UNIQUE,
  type        ENUM('refresh_token', 'tracking_token', 'reset_pwd_token', 'activate_account_token') NOT NULL,
  user_id     INT UNSIGNED    NULL,       -- refresh_token motarako (beteta)
  package_id  INT UNSIGNED    NULL,       -- tracking motarako (beteta)
  expires_at  TIMESTAMP       NOT NULL,
  revoked     BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id)    REFERENCES users (id)    ON DELETE CASCADE,
  CONSTRAINT fk_tokens_package FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. PACKAGE_STATUS_LOGS - Egoera-aldaketen historial osoa
-- ------------------------------------------------------------
CREATE TABLE package_status_logs (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  package_id  INT UNSIGNED    NOT NULL,
  old_status  ENUM('pending', 'assigned', 'in_transit', 'delivered', 'failed') NULL,
  new_status  ENUM('pending', 'assigned', 'in_transit', 'delivered', 'failed') NOT NULL,
  changed_by  INT UNSIGNED    NOT NULL,   -- zeinek egin zuen aldaketa (users.id)
  notes       TEXT            NULL,
  changed_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_logs_package    FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE,
  CONSTRAINT fk_logs_changed_by FOREIGN KEY (changed_by) REFERENCES users (id)
);

-- ------------------------------------------------------------
-- 6. ROUTES - Banatzaile baten eguneko ibilbidea
-- ------------------------------------------------------------
CREATE TABLE routes (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED    NOT NULL,   -- banatzailea
  route_date    DATE            NOT NULL,
  status        ENUM('planned', 'in_progress', 'completed') NOT NULL DEFAULT 'planned',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_routes_user FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE KEY uq_route_user_date (user_id, route_date)   -- banatzaileak egun bakoitzeko ibilbide bat
);

-- ------------------------------------------------------------
-- 7. ROUTE_STOPS - Ibilbide bakoitzaren geldialdiak
-- ------------------------------------------------------------
CREATE TABLE route_stops (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  route_id            INT UNSIGNED    NOT NULL,
  package_id          INT UNSIGNED    NOT NULL,
  stop_order          SMALLINT        NOT NULL,   -- geldialdi-ordena Maps-ek optimizatuta
  estimated_arrival   TIME            NULL,
  actual_arrival      TIME            NULL,
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_stops_route   FOREIGN KEY (route_id)   REFERENCES routes (id)   ON DELETE CASCADE,
  CONSTRAINT fk_stops_package FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE,
  UNIQUE KEY uq_stop_order (route_id, stop_order)
);

-- ============================================================
-- INDIZEAK - Query ohikoenak azkartzeko
-- ============================================================
CREATE INDEX idx_packages_status      ON packages (status);
CREATE INDEX idx_packages_assigned_to ON packages (assigned_to);
CREATE INDEX idx_packages_created_at  ON packages (created_at);
CREATE INDEX idx_tokens_type_expires  ON tokens (type, expires_at, revoked);
CREATE INDEX idx_logs_package_date    ON package_status_logs (package_id, changed_at);
CREATE INDEX idx_routes_date          ON routes (route_date);