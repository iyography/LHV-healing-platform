import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Admin credentials - in production, use environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lightheartvision.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LHVadmin123!';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate session ID
    const sessionId = Math.random().toString(36) + Date.now().toString(36);

    const supabase = createServerClient();

    // Store session in database
    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        id: sessionId,
        email,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Session creation error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
