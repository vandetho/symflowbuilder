import { NextRequest, NextResponse } from 'next/server';

export function POST(req: NextRequest) {
    const body = req.json();
    return NextResponse.json({ message: 'Hello, world!' });
}
