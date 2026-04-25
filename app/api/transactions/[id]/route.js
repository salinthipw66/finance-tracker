import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// PUT /api/transactions/[id] — แก้ไข transaction (แทน doPost() action=edit ใน Code.gs)
export async function PUT(request, { params }) {
  try {
    const id = parseInt((await params).id);
    const data = await request.json();
    const { date, type, category, amount, details } = data;

    if (!id || !date || !type || !category || amount === undefined) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE transactions SET date=?, type=?, category=?, amount=?, details=? WHERE id=?',
      [date, type, category, parseFloat(amount), details || '', id]
    );

    return NextResponse.json({
      status: 'success',
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/transactions/[id] error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] — ลบ transaction (แทน doPost() action=delete ใน Code.gs)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt((await params).id);

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM transactions WHERE id=?', [id]);

    return NextResponse.json({
      status: 'success',
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/transactions/[id] error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
