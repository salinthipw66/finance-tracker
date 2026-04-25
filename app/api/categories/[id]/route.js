import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const id = (await params).id;
    const { name, type, color } = await request.json();

    if (!name || !type) {
      return NextResponse.json({ status: 'error', message: 'Name and type are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get old name
      const [oldRows] = await connection.query('SELECT name FROM categories WHERE id = ?', [id]);
      if (oldRows.length === 0) throw new Error('Category not found');
      const oldName = oldRows[0].name;

      // 2. Update category name and color
      const newColor = color || '#94a3b8';
      await connection.query('UPDATE categories SET name = ?, color = ? WHERE id = ?', [name.trim(), newColor, id]);

      // 3. Cascade update transactions
      await connection.query(
        'UPDATE transactions SET category = ? WHERE category = ? AND type = ?',
        [name.trim(), oldName, type]
      );

      await connection.commit();
      return NextResponse.json({ status: 'success', message: 'Category renamed successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = (await params).id;
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ status: 'success', message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
