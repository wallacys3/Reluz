import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { services } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.order));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
