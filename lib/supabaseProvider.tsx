/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { createContext, useContext, useState } from "react";
// import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// const SupabaseContext = createContext<SupabaseClient | null>(null);

// export function SupabaseProvider({ children }: { children: React.ReactNode }) {
//     const [supabase] = useState(() =>
//         createClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//         )
//     );

//     return (
//         <SupabaseContext.Provider value={supabase}>
//             {children}
//         </SupabaseContext.Provider>
//     );
// }

// export function useSupabase() {
//     const ctx = useContext(SupabaseContext);
//     if (!ctx) throw new Error("useSupabase must be used inside SupabaseProvider");
//     return ctx;
// }

'use client'

import { createContext, useContext, useState } from 'react'
import { createClient } from './supabaseClient'
import { Session, SupabaseClient } from '@supabase/supabase-js'

type SupabaseContextType = {
    supabase: SupabaseClient
    session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [supabase] = useState(() => createClient())
    const [session, setSession] = useState<Session | null>(null)

    return (
        <SupabaseContext.Provider value={{ supabase, session }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (!context) throw new Error('useSupabase must be used inside SupabaseProvider')
    return context
}
