import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { sales, products } from '@/src/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let conditions = [];
    if (startDate) {
      conditions.push(gte(sales.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(sales.createdAt, end));
    }

    const data = await db.select()
      .from(sales)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${sales.createdAt} DESC`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, itemId, itemName, quantity, totalAmount, paymentMethod } = body;

    // Start a transaction to ensure atomic updates if it's a product
    const result = await db.transaction(async (tx) => {
      const newSale = await tx.insert(sales).values({
        type,
        itemId: itemId ? parseInt(itemId) : null,
        itemName,
        quantity: parseInt(quantity) || 1,
        totalAmount: String(totalAmount),
        paymentMethod,
      }).returning();

      // If it's a product sale, update the product stock and sold count
      if (type === 'product' && itemId) {
        await tx.update(products)
          .set({
            stock: sql`${products.stock} - ${parseInt(quantity) || 1}`,
            sold: sql`${products.sold} + ${parseInt(quantity) || 1}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, parseInt(itemId)));
      }

      return newSale[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to register sale:', error);
    return NextResponse.json({ error: 'Failed to register sale' }, { status: 500 });
  }
}
