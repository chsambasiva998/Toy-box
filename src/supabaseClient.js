import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function makeNoopQuery() {
  const q = {
    order() { return q; },
    eq() { return q; },
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    select: async () => ({ data: [], error: null }),
    delete: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
  };
  return q;
}

let supabase;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Fallback no-op client so the UI can boot without Supabase keys.
  // It implements the smallest surface used by this app (from, rpc, channel, removeChannel, auth).
  // Methods return shapes similar to real Supabase responses (e.g. { data, error }).
  // This prevents runtime crashes when env vars aren't provided (useful for demo or static deployments).
  // NOTE: functionality will be limited — use real keys for full features.
  // eslint-disable-next-line no-console
  console.warn('[supabaseClient] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not provided — using no-op client.');

  supabase = {
    from: () => makeNoopQuery(),
    rpc: async () => ({ data: null, error: null }),
    channel: () => {
      const ch = {
        on() { return ch; },
        subscribe: async () => ch,
      };
      return ch;
    },
    removeChannel: () => {},
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
    },
  };
}

export { supabase };