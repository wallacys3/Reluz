import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { services } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select()
      .from(services)
      .orderBy(asc(services.order));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, category, imageUrl } = body;
    
    // Simple slug generator
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await db.insert(services).values({
      title,
      slug,
      description,
      price,
      category,
      imageUrl,
      isActive: true,
      order: 0,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, price, category, imageUrl, isActive } = body;

    const result = await db.update(services)
      .set({
        title,
        description,
        price,
        category,
        imageUrl,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.delete(services).where(eq(services.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
