import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { plans } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(asc(plans.id));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
