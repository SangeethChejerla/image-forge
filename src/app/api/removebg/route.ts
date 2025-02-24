import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
    },
    body: formData,
  });
  if (response.ok) {
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { 'Content-Type': 'image/png' },
    });
  }
  return NextResponse.json({ error: 'Failed to remove background' }, { status: 500 });
}