import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const status = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    adminClientInitialized: !!supabaseAdmin,
    timestamp: new Date().toISOString()
  }

  // Try to test the connection if client exists
  if (supabaseAdmin) {
    try {
      const { count, error } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
      
      status.connectionTest = {
        success: !error,
        productCount: count || 0,
        error: error?.message || null
      }
    } catch (error) {
      status.connectionTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  } else {
    status.connectionTest = {
      success: false,
      error: 'Admin client not initialized'
    }
  }

  return NextResponse.json(status)
}