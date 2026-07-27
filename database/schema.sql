-- ============================================
-- Flexa Cendekia x UNIPDU — Database Schema
-- MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS flexa_cendekia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flexa_cendekia;

-- 1. Users
CREATE TABLE IF NOT EXISTS Users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  peran ENUM('siswa','guru','ortu') NOT NULL DEFAULT 'siswa',
  jenjang VARCHAR(10) DEFAULT 'SMA',
  kelas VARCHAR(10) DEFAULT '10',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- 2. Siswa_Profil
CREATE TABLE IF NOT EXISTS Siswa_Profil (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  gayaBelajar VARCHAR(100) DEFAULT NULL,
  minatBakat VARCHAR(255) DEFAULT NULL,
  kompetensiDasar VARCHAR(255) DEFAULT NULL,
  roadmapAktifId CHAR(36) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Hasil_Diagnosis
CREATE TABLE IF NOT EXISTS Hasil_Diagnosis (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  skorMinat INT DEFAULT 0,
  skorBakat INT DEFAULT 0,
  gayaBelajar VARCHAR(100) DEFAULT NULL,
  kompetensi VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Cita_Cita
CREATE TABLE IF NOT EXISTS Cita_Cita (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  profesiTarget VARCHAR(255) NOT NULL,
  status ENUM('Aktif','Non-Aktif','Menunggu Persetujuan') NOT NULL DEFAULT 'Aktif',
  tanggalPengajuan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tanggalDisetujui DATETIME DEFAULT NULL,
  disetujuiOlehId CHAR(36) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (disetujuiOlehId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Roadmap
CREATE TABLE IF NOT EXISTS Roadmap (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  citaCitaId CHAR(36) NOT NULL,
  tahunMulai INT NOT NULL,
  tahunSelesai INT NOT NULL,
  status ENUM('Aktif','Selesai','Non-Aktif') NOT NULL DEFAULT 'Aktif',
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (citaCitaId) REFERENCES Cita_Cita(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Semester_KRS
CREATE TABLE IF NOT EXISTS Semester_KRS (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  roadmapId CHAR(36) NOT NULL,
  semesterKe INT NOT NULL,
  status ENUM('Menunggu Persetujuan','Disetujui','Ditolak','Selesai') NOT NULL DEFAULT 'Menunggu Persetujuan',
  disetujuiOlehId CHAR(36) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roadmapId) REFERENCES Roadmap(id) ON DELETE CASCADE,
  FOREIGN KEY (disetujuiOlehId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Target_Mingguan
CREATE TABLE IF NOT EXISTS Target_Mingguan (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  semesterId CHAR(36) NOT NULL,
  mingguKe INT NOT NULL,
  deskripsi TEXT DEFAULT NULL,
  status ENUM('Belum Mulai','Berjalan','Selesai') NOT NULL DEFAULT 'Belum Mulai',
  tanggalCheckpoint DATE DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (semesterId) REFERENCES Semester_KRS(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Target_Harian
CREATE TABLE IF NOT EXISTS Target_Harian (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  mingguId CHAR(36) NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT DEFAULT NULL,
  tautanMateri VARCHAR(500) DEFAULT NULL,
  status ENUM('Belum Mulai','Selesai','Dilewati') NOT NULL DEFAULT 'Belum Mulai',
  PRIMARY KEY (id),
  FOREIGN KEY (mingguId) REFERENCES Target_Mingguan(id) ON DELETE CASCADE
) ENGINE=InnoDB;
