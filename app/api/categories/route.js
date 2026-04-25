import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/categories — ดึง categories ทั้งหมด (แทน fetchCategories() ใน Code.gs)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT type, name, color FROM categories ORDER BY type, sort_order ASC, id ASC'
    );

    const categories = { รายรับ: [], รายจ่าย: [] };
    rows.forEach((row) => {
      // return as object to include color
      if (categories[row.type]) categories[row.type].push({ name: row.name, color: row.color });
    });

    return NextResponse.json({ status: 'success', categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/categories — เพิ่ม category ใหม่ (แทน doPost() action=add_category ใน Code.gs)
export async function POST(request) {
  try {
    const { type, category, color } = await request.json();

    if (!type || !category) {
      return NextResponse.json(
        { status: 'error', message: 'Type and category are required' },
        { status: 400 }
      );
    }

    // INSERT IGNORE เพื่อไม่ให้ error ถ้าชื่อซ้ำ
    const newColor = color || '#94a3b8';
    await pool.query(
      'INSERT IGNORE INTO categories (type, name, color) VALUES (?, ?, ?)',
      [type, category.trim(), newColor]
    );

    return NextResponse.json({
      status: 'success',
      message: 'Category added',
    });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
