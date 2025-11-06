// import { redirect } from "next/navigation";
// import { createServerSupabaseClient } from "../../lib/supabaseServer";

// export default async function HomePage() {
//   const supabase = await createServerSupabaseClient();
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     redirect("/auth");
//   } else {
//     redirect("/todos");
//   }
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../../lib/supabaseProvider';

export default function HomePage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    if (session === null) {
      router.push('/auth');
    } else if (session) {
      router.push('/todos');
    }
  }, [session, router]);

  return null; // or a loading spinner
}
