import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates and returns a Supabase client for browser-side usage.
 * Uses environment variables for URL and anon key.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
