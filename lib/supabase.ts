import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gzvzoknxomzgiigbirvy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    'sb_publishable_-0qePLB9fSYg0x6m7NGN8g_vUACaZLB';

export const supabase = createClient(supabaseUrl, supabaseKey);
