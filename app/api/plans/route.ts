import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { plans } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select()
      .from(plans)
      .orderBy(asc(plans.id));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, description, features, isPopular } = body;
    
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await db.insert(plans).values({
      name,
      slug,
      price: price.toString(),
      description,
      features,
      isPopular: !!isPopular,
      isActive: true,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to create plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, price, description, features, isPopular, isActive } = body;

    const result = await db.update(plans)
      .set({
        name,
        price: price.toString(),
        description,
        features,
        isPopular,
        isActive,
      })
      .where(eq(plans.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update plan:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.delete(plans).where(eq(plans.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete plan:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
