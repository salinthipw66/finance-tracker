# 📊 Finance & Budget Tracker

ระบบบันทึกรายรับ-รายจ่ายส่วนตัว พัฒนาด้วย Next.js และ TiDB Cloud (MySQL)

---

## 📁 โครงสร้างโปรเจกต์

```
Finance-Tracker/
├── app/                    ← Pages และ API Routes (Next.js App Router)
│   ├── api/
│   │   ├── categories/     ← API จัดการหมวดหมู่
│   │   └── transactions/   ← API จัดการรายการรายรับ-รายจ่าย
│   ├── page.js             ← หน้าหลักของแอป
│   ├── layout.js           ← Layout ของแอป
│   └── globals.css         ← Global Styles
├── components/             ← React Components
│   ├── DashboardView.jsx   ← หน้าสรุปยอด + กราฟ
│   ├── RecordView.jsx      ← หน้าเพิ่มรายการ
│   ├── TransactionsView.jsx ← หน้าประวัติรายการ
│   ├── EditModal.jsx       ← Modal แก้ไข / ลบ
│   ├── ManageCategoriesModal.jsx ← Modal จัดการหมวดหมู่
│   ├── CategoryGrid.jsx    ← แสดงปุ่มหมวดหมู่
│   ├── DateInput.jsx       ← Input วันที่ (พร้อม calendar picker)
│   └── Toast.jsx           ← แจ้งเตือน
├── lib/
│   └── db.js               ← เชื่อมต่อฐานข้อมูล TiDB Cloud
├── schema.sql              ← โครงสร้างฐานข้อมูล
├── .env.local              ← ค่าเชื่อมต่อฐานข้อมูล (พร้อมใช้งาน)
└── package.json            ← Dependencies
```

---

## 🛠️ เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Next.js 16 (App Router), React 19 |
| Backend | Next.js API Routes (Node.js) |
| Database | TiDB Cloud (MySQL-compatible) |
| Styling | CSS Modules + Vanilla CSS |
| Charts | Chart.js |

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### สิ่งที่ต้องมี
- **Node.js** เวอร์ชัน 18 ขึ้นไป → [ดาวน์โหลด Node.js](https://nodejs.org)

### ขั้นตอน

**1. เปิด Terminal แล้ว cd เข้าโฟลเดอร์ Finance-Tracker**
```bash
cd Finance-Tracker
```

**2. ติดตั้ง Dependencies**
```bash
npm install
```

**3. รันเซิร์ฟเวอร์**
```bash
npm run dev
```

**4. เปิดเบราว์เซอร์ไปที่**
```
http://localhost:3000
```

> ไม่ต้องแก้ไขอะไรเพิ่ม — ไฟล์ `.env.local` มีค่าเชื่อมต่อฐานข้อมูลครบแล้ว

---

## ✨ ฟีเจอร์หลัก

- **บันทึกรายรับ-รายจ่าย** พร้อมหมวดหมู่และวันที่
- **Dashboard สรุปยอด** รายเดือนและรายวัน พร้อมกราฟ Chart.js
- **จัดการหมวดหมู่** เพิ่ม ลบ ปรับแต่งสีและไอคอน
- **แก้ไข / ลบ** รายการย้อนหลัง
- **รองรับมือถือ** (Responsive Design)
