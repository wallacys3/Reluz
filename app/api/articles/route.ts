import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { articles } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin') === 'true';

    const query = db.select().from(articles);
    
    if (!admin) {
      // @ts-ignore
      query.where(eq(articles.isPublished, true));
    }

    // @ts-ignore
    const data = await query.orderBy(desc(articles.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const newItem = await db.insert(articles).values({
      title: body.title,
      slug: body.slug || slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl,
      isPublished: body.isPublished !== undefined ? body.isPublished : false,
      publishedAt: body.isPublished ? new Date() : null,
    }).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    if (updateData.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedItem = await db.update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();
    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(articles).where(eq(articles.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
