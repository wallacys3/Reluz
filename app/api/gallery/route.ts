import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { gallery } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin') === 'true';

    const query = db.select().from(gallery);
    
    if (!admin) {
      // @ts-ignore
      query.where(eq(gallery.isActive, true));
    }

    // @ts-ignore
    const data = await query.orderBy(desc(gallery.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem = await db.insert(gallery).values({
      title: body.title,
      imageUrl: body.imageUrl,
      category: body.category || 'Geral',
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updatedItem = await db.update(gallery)
      .set(updateData)
      .where(eq(gallery.id, id))
      .returning();
    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(gallery).where(eq(gallery.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}

