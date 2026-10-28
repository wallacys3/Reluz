import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { settings } from '@/src/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(settings);
    // Convert array to object for easier use
    const settingsObj = data.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
