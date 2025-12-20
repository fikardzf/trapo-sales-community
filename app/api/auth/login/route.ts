// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authAPI } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { emailOrPhone, password } = await request.json();
    
    // Validate input
    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const user = await authAPI.login({ emailOrPhone, password });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { usersAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const users = await usersAPI.getAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}