'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './supabaseClient';
import { Session, SupabaseClient } from '@supabase/supabase-js';

type SupabaseContextType = {
    supabase: SupabaseClient;
    session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [supabase] = useState(() => createClient());
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // ✅ 1. Fetch current session on mount
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // ✅ 2. Listen for session changes (sign in/out)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // ✅ 3. Clean up
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <SupabaseContext.Provider value={{ supabase, session }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) throw new Error('useSupabase must be used inside SupabaseProvider');
    return context;
};
