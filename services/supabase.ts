/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

/**
 * --- SERVICE LAYER ---
 * Mengatur komunikasi dengan Database & Auth Provider (Supabase).
 * File ini menginisialisasi dan mengekspor instance client Supabase.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di .env! Database tidak akan berfungsi.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
