import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/src/lib/firebase-admin';

export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
