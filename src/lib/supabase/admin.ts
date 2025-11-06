import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Klien ini HANYA untuk digunakan di Server Components untuk tugas-tugas admin
// yang memerlukan service_role key.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};