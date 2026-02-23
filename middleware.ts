// Middleware disabled temporarily for public access on Vercel
import { NextResponse } from 'next/server';

export default function middleware() {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
