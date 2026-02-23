import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const report = body['csp-report'] ?? body;

    console.warn('[CSP Violation]', JSON.stringify(report, null, 2));

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
