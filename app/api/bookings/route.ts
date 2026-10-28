import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { bookings } from '@/src/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, whatsapp, veiculo, ano, servico, data, horario, observacoes } = body;

    const result = await db.insert(bookings).values({
      customerName: nome,
      customerWhatsapp: whatsapp,
      vehicleModel: veiculo,
      vehicleYear: ano,
      serviceType: servico,
      preferredDate: data,
      preferredTime: horario,
      observations: observacoes,
    }).returning();

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}
