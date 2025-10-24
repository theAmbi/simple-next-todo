"use client";

import { createContext, useContext, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() =>
        createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    const ctx = useContext(SupabaseContext);
    if (!ctx) throw new Error("useSupabase must be used inside SupabaseProvider");
    return ctx;
}