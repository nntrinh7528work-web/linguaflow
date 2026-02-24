import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser-side (client components).
 * This client uses the anon key and handles auth automatically.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
