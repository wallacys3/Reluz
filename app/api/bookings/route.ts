import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { bookings } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, whatsapp, veiculo, ano, servico, data, horario, observacoes } = body;

    const result = await db.insert(bookings).values({
      customerName: nome || body.customerName,
      customerWhatsapp: whatsapp || body.customerWhatsapp,
      vehicleModel: veiculo || body.vehicleModel,
      vehicleYear: ano || body.vehicleYear,
      serviceType: servico || body.serviceType,
      preferredDate: data || body.preferredDate,
      preferredTime: horario || body.preferredTime,
      observations: observacoes || body.observations,
      status: body.status || 'pending',
    }).returning();

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const result = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(bookings).where(eq(bookings.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
