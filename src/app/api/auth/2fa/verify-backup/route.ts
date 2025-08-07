import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, backupCode } = await request.json();
    
    if (!email || !backupCode) {
      return NextResponse.json(
        { error: 'Email and backup code are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // In production, this would:
    // 1. Get the user's stored backup codes
    // 2. Verify the provided code exists and hasn't been used
    // 3. Mark the code as used (one-time use only)
    // 4. Check for rate limiting
    // 5. Log the security event
    
    // For demo purposes, accept any 8-character alphanumeric code
    const isValidFormat = /^[a-z0-9]{8}$/.test(backupCode.toLowerCase());
    
    if (!isValidFormat) {
      await logSecurityEvent('backup_code_failed', { email, reason: 'Invalid format' });
      
      return NextResponse.json(
        { error: 'Invalid backup code format' },
        { status: 400 }
      );
    }
    
    // Simulate checking if code exists and is unused
    const isValidCode = backupCode.toLowerCase() !== 'used1234'; // Demo: reject this specific code
    
    if (!isValidCode) {
      await logSecurityEvent('backup_code_failed', { email, backupCode });
      
      return NextResponse.json(
        { error: 'Invalid or already used backup code' },
        { status: 400 }
      );
    }

    // Log successful backup code usage
    await logSecurityEvent('backup_code_success', { email });
    
    // In production, you would also:
    // 1. Mark the backup code as used
    // 2. Update the user's session
    // 3. Consider generating new backup codes if running low
    // 4. Send security notification about backup code usage
    
    return NextResponse.json({ 
      success: true,
      warning: 'Backup code used. Consider generating new backup codes.' 
    });
    
  } catch (error) {
    console.error('Backup code verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logSecurityEvent(eventType: string, metadata: any) {
  try {
    console.log('Security Event:', {
      type: eventType,
      timestamp: new Date().toISOString(),
      metadata
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}