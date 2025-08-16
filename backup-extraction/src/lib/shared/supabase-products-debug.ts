/**
 * Debug version of Supabase products service to troubleshoot connection issues
 */

import { createClient } from '@supabase/supabase-js';

// Direct environment variable access for debugging
const supabaseUrl = 'https://gvcswimqaxvylgxbklbz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3N3aW1xYXh2eWxneGJrbGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjA1MzAsImV4cCI6MjA2OTMzNjUzMH0.UZdiGcJXUV5VYetjWXV26inmbj2yXdiT03Z6t_5Lg24';

// console.log('Creating Supabase client with hardcoded values...');

// Create client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

export async function testDirectConnection() {
  try {
    // console.log('Making direct test query...');
    
    // Try the simplest possible query
    const { data, error, status, statusText } = await supabase
      .from('products')
      .select('id')
      .limit(1)
      .single();

    // console.log('Response:', {
    //   data,
    //   error,
    //   status,
    //   statusText
    // });

    if (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Caught error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}