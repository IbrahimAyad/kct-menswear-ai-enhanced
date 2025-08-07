import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // In production, this would:
    // 1. Get the user's stored secret key
    // 2. Verify the TOTP code using a library like 'speakeasy'
    // 3. Check for rate limiting
    // 4. Log the security event
    
    // For now, simulate verification (accept any 6-digit code for demo)
    const isValidCode = code === '123456' || /^\d{6}$/.test(code);
    
    if (!isValidCode) {
      // Log failed attempt
      await logSecurityEvent('2fa_failed', { email, code });
      
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Log successful 2FA verification
    await logSecurityEvent('2fa_success', { email });
    
    // In production, you would also:
    // 1. Update the user's session to mark 2FA as verified
    // 2. Set appropriate session cookies/tokens
    // 3. Update last login timestamp
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logSecurityEvent(eventType: string, metadata: any) {
  try {
    // In production, this would log to your security events table
    console.log('Security Event:', {
      type: eventType,
      timestamp: new Date().toISOString(),
      metadata
    });
    
    // Could also send to external security monitoring service
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}