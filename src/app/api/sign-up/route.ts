import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/util/connect-mongo';
import User from '@/models/user.schema';

export async function POST(req: NextRequest) {
    const body = req.json();
    await connectMongo();
    const user = await User.create(body);

    return NextResponse.json({ message: 'Created user!', user });
}
