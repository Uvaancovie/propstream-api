import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for backend

let supabase;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  
  // Return a mock client for development
  supabase = {
    from: () => ({
      insert: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export { supabase };
export default supabase;
