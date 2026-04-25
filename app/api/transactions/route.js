import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/transactions — ดึง transactions ทั้งหมด (แทน doGet() ใน Code.gs)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, DATE_FORMAT(date, "%Y-%m-%d") as date, type, category, amount, details FROM transactions ORDER BY date DESC, id DESC'
    );

    // ดึง categories ด้วยในครั้งเดียว
    const [catRows] = await pool.query(
      'SELECT type, name, color FROM categories ORDER BY type, sort_order ASC, id ASC'
    );

    const categories = { รายรับ: [], รายจ่าย: [] };
    catRows.forEach((row) => {
      if (categories[row.type]) categories[row.type].push({ name: row.name, color: row.color });
    });

    return NextResponse.json({
      status: 'success',
      data: rows,
      categories,
    });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/transactions — เพิ่ม transaction ใหม่ (แทน doPost() action=add ใน Code.gs)
export async function POST(request) {
  try {
    const data = await request.json();
    const { date, type, category, amount, details } = data;

    if (!date || !type || !category || amount === undefined) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO transactions (date, type, category, amount, details) VALUES (?, ?, ?, ?, ?)',
      [date, type, category, parseFloat(amount), details || '']
    );

    return NextResponse.json({
      status: 'success',
      message: 'Transaction added successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
