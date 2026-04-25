# Finance Tracker

ระบบบันทึกรายรับ-รายจ่ายส่วนตัว พัฒนาด้วย Next.js และ TiDB Cloud (MySQL)

---

## โครงสร้างโปรเจกต์

```
Finance-Tracker/
├── app/                        ← Pages และ API Routes (Next.js App Router)
│   ├── api/
│   │   ├── categories/         ← GET/POST หมวดหมู่, PUT/DELETE หมวดหมู่ตาม id, จัดลำดับ
│   │   └── transactions/      ← GET/POST รายการ, PUT/DELETE รายการตาม id
│   ├── dashboard/page.js       ← หน้าสรุปยอด + กราฟ
│   ├── record/page.js          ← หน้าเพิ่มรายการ
│   ├── transactions/
│   │   ├── page.js             ← หน้าประวัติรายการทั้งหมด
│   │   └── [id]/edit/page.js   ← หน้าแก้ไขรายการ (Dynamic Route)
│   ├── page.js                 ← Redirect → /dashboard
│   ├── layout.js               ← Root Layout + Font
│   └── globals.css             ← Global Styles
├── components/
│   ├── ClientLayout.jsx        ← Client wrapper (Navbar + DbStatus)
│   ├── DbStatusProvider.jsx    ← Context สถานะ DB
│   ├── Navbar.jsx              ← Navigation bar (<Link>)
│   ├── DashboardView.jsx       ← สรุปยอด + กราฟ Chart.js
│   ├── RecordView.jsx          ← ฟอร์มเพิ่มรายการ
│   ├── TransactionsView.jsx    ← รายการรายรับ-รายจ่าย
│   ├── EditModal.jsx           ← Modal แก้ไข/ลบ
│   ├── ManageCategoriesModal.jsx ← Modal จัดการหมวดหมู่
│   ├── CategoryGrid.jsx        ← แสดงปุ่มหมวดหมู่
│   ├── DateInput.jsx           ← Input วันที่ (DD/MM/YYYY + date picker)
│   └── Toast.jsx               ← แจ้งเตือน
├── lib/
│   ├── db.js                   ← เชื่อมต่อฐานข้อมูล TiDB Cloud (mysql2/promise)
│   └── useData.js              ← Shared hooks (useTransactions, useToast, addCategory)
├── schema.sql                  ← โครงสร้างฐานข้อมูล + ข้อมูลเริ่มต้น
└── package.json
```

---

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Next.js 16 (App Router), React 19 |
| Backend | Next.js API Routes (Node.js) |
| Database | TiDB Cloud (MySQL-compatible) |
| Styling | Vanilla CSS + CSS Variables |
| Charts | Chart.js |
| Font | Mitr (next/font/google) |

---

## วิธีติดตั้งและรันโปรเจกต์

### สิ่งที่ต้องมี
- **Node.js** เวอร์ชัน 18 ขึ้นไป → [ดาวน์โหลด Node.js](https://nodejs.org)
- **TiDB Cloud Account** → [สมัคร TiDB Cloud](https://tidbcloud.com)

### ขั้นตอน

**1. Clone โปรเจกต์**
```bash
git clone https://github.com/<username>/finance-tracker.git
cd finance-tracker
```

**2. ติดตั้ง Dependencies**
```bash
npm install
```

**3. สร้างฐานข้อมูลบน TiDB Cloud**
- สร้าง Cluster บน TiDB Cloud
- เปิด **SQL Editor** แล้วรันคำสั่งในไฟล์ `schema.sql`

**4. สร้างไฟล์ `.env.local`** ในโฟลเดอร์ `Finance-Tracker/`
```
DB_HOST=xxx.xxx.xxx.xxx
DB_PORT=4000
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=finance_tracker
DB_SSL=true
```
> ดูค่าเหล่านี้ได้จาก TiDB Cloud → Cluster → **Connect** → เลือก **Node.js**

**5. รันเซิร์ฟเวอร์**
```bash
npm run dev
```

**6. เปิดเบราว์เซอร์ไปที่**
```
http://localhost:3000
```

---

## API Endpoints

| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/api/transactions` | ดึงรายการทั้งหมด + หมวดหมู่ |
| POST | `/api/transactions` | เพิ่มรายการใหม่ |
| PUT | `/api/transactions/[id]` | แก้ไขรายการ |
| DELETE | `/api/transactions/[id]` | ลบรายการ |
| GET | `/api/categories` | ดึงหมวดหมู่ทั้งหมด |
| POST | `/api/categories` | เพิ่มหมวดหมู่ใหม่ |
| PUT | `/api/categories/[id]` | แก้ไขหมวดหมู่ (พร้อม cascade ไป transactions) |
| DELETE | `/api/categories/[id]` | ลบหมวดหมู่ |
| GET | `/api/categories/manage` | ดึงหมวดหมู่พร้อม sort_order |
| PUT | `/api/categories/manage` | อัปเดตลำดับหมวดหมู่ |

---

## Page Routes

| Path | หน้า |
|---|---|
| `/` | Redirect → `/dashboard` |
| `/dashboard` | สรุปยอดรายรับ-รายจ่าย + กราฟ |
| `/record` | เพิ่มรายการใหม่ |
| `/transactions` | ประวัติรายการทั้งหมด |
| `/transactions/[id]/edit` | แก้ไขรายการตาม id |

---

## ฟีเจอร์หลัก

- บันทึกรายรับ-รายจ่าย พร้อมหมวดหมู่และวันที่
- Dashboard สรุปยอด รายเดือน/รายวัน พร้อมกราฟ Chart.js
- จัดการหมวดหมู่ เพิ่ม ลบ แก้ไขสี จัดลำดับ (drag-and-drop)
- แก้ไข/ลบรายการย้อนหลัง
- รองรับมือถือ (Responsive Design)
- Optimistic UI + Rollback เมื่อบันทึกล้มเหลว
