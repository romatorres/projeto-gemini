import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface JwtPayload {
  userId: string;
  role: string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Exemplo de proteção de rota por role
    if (request.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url)); // Redireciona para dashboard se não for admin
    }

    return NextResponse.next();
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};