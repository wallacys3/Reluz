import { db } from '@/src/db';
import { bookings, clients, sales, products } from '@/src/db/schema';
import { count, sum, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic counts
    const [bookingsCount] = await db.select({ value: count() }).from(bookings);
    const [pendingBookings] = await db.select({ value: count() }).from(bookings).where(sql`status = 'pending'`);
    const [clientsCount] = await db.select({ value: count() }).from(clients);
    
    // Revenue from sales (last 30 days vs previous 30 days would be nice, but let's keep it simple first)
    const [totalRevenue] = await db.select({ value: sum(sales.totalAmount) }).from(sales);
    
    // Recent bookings
    const recentBookingsList = await db.select().from(bookings).orderBy(sql`created_at DESC`).limit(5);

    // Products low stock
    const [lowStockCount] = await db.select({ value: count() }).from(products).where(sql`stock < 5`);

    return NextResponse.json({
      stats: [
        { name: 'Total Clientes', value: clientsCount.value.toString(), change: '+10%', positive: true },
        { name: 'Agendamentos Pendentes', value: pendingBookings.value.toString(), change: 'Atual', positive: true },
        { name: 'Faturamento Total', value: `R$ ${parseFloat(totalRevenue.value || '0').toLocaleString('pt-BR')}`, change: '+15%', positive: true },
        { name: 'Produtos Baixo Estoque', value: lowStockCount.value.toString(), change: 'Alerta', positive: lowStockCount.value === 0 },
      ],
      recentBookings: recentBookingsList
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
