-- ================================================================
-- วิธี run: ไปที่ TiDB Cloud > Connect > SQL Editor
-- แล้ว run ทีละ STEP (ไม่ต้อง run พร้อมกันทั้งหมด)
-- ================================================================

-- STEP 1: สร้าง Database
CREATE DATABASE IF NOT EXISTS finance_tracker;

-- STEP 2: สร้างตาราง transactions
CREATE TABLE IF NOT EXISTS finance_tracker.transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL COMMENT 'รายรับ หรือ รายจ่าย',
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STEP 3: สร้างตาราง categories
CREATE TABLE IF NOT EXISTS finance_tracker.categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL COMMENT 'รายรับ หรือ รายจ่าย',
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#94a3b8',
  sort_order INT DEFAULT 0,
  UNIQUE KEY uniq_type_name (type, name)
);

-- STEP 4: ใส่ข้อมูล categories เริ่มต้น
INSERT IGNORE INTO finance_tracker.categories (type, name, color, sort_order) VALUES
  ('รายรับ', 'เงินรายสัปดาห์/รายเดือน', '#94a3b8', 0),
  ('รายรับ', 'ทุนการศึกษา', '#94a3b8', 1),
  ('รายรับ', 'งานพาร์ทไทม์', '#94a3b8', 2),
  ('รายรับ', 'รายได้เสริม', '#94a3b8', 3),
  ('รายจ่าย', 'อาหาร', '#94a3b8', 0),
  ('รายจ่าย', 'เครื่องดื่ม', '#94a3b8', 1),
  ('รายจ่าย', 'เดินทาง รถ', '#94a3b8', 2),
  ('รายจ่าย', 'ช้อปปิ้ง', '#94a3b8', 3),
  ('รายจ่าย', 'บันเทิง', '#94a3b8', 4),
  ('รายจ่าย', 'ของใช้', '#94a3b8', 5),
  ('รายจ่าย', 'เสื้อผ้า', '#94a3b8', 6),
  ('รายจ่าย', 'ท่องเที่ยว', '#94a3b8', 7),
  ('รายจ่าย', 'ค่าห้อง', '#94a3b8', 8),
  ('รายจ่าย', 'จ่ายบิล', '#94a3b8', 9),
  ('รายจ่าย', 'อื่นๆ', '#94a3b8', 10);
