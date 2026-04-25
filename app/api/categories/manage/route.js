import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, type, name, sort_order, color FROM categories ORDER BY type, sort_order ASC, id ASC'
    );
    return NextResponse.json({ status: 'success', data: rows });
  } catch (error) {
    console.error('GET /api/categories/manage error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { updates } = await request.json(); 
    // updates: [{ id: 1, sort_order: 0 }, { id: 2, sort_order: 1 }]
    if (!Array.isArray(updates)) {
      return NextResponse.json({ status: 'error', message: 'Invalid format' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const item of updates) {
        await connection.query(
          'UPDATE categories SET sort_order = ? WHERE id = ?',
          [item.sort_order, item.id]
        );
      }
      await connection.commit();
      return NextResponse.json({ status: 'success', message: 'Reordered successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('PUT /api/categories/manage error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
