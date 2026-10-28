import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { clients } from '@/src/db/schema';
import { eq, desc, ilike, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = db.select().from(clients).orderBy(desc(clients.createdAt));

    if (search) {
      // @ts-ignore
      query = query.where(
        or(
          ilike(clients.name, `%${search}%`),
          ilike(clients.carModel, `%${search}%`),
          ilike(clients.licensePlate, `%${search}%`)
        )
      );
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, carModel, licensePlate } = body;

    const result = await db.insert(clients).values({
      name,
      phone,
      address,
      carModel,
      licensePlate,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to create client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, phone, address, carModel, licensePlate } = body;

    const result = await db.update(clients)
      .set({
        name,
        phone,
        address,
        carModel,
        licensePlate,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.delete(clients).where(eq(clients.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete client:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
