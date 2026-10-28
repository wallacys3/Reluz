import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { gallery } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select()
      .from(gallery)
      .where(eq(gallery.isActive, true))
      .orderBy(desc(gallery.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
