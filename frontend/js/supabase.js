// ══════════════════════════════════════
// HAULIT — supabase.js
// Cliente de Supabase
// ══════════════════════════════════════

const { createClient } = supabase

const db = createClient(SUPABASE_URL, SUPABASE_KEY)