// /app/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import {
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
} from '../lib/env'; // adjust path if needed

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY
);
