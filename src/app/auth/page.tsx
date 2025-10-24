// 'use client';
// import { useState } from 'react';
// import { supabase } from '../../../lib/supabaseClient';
// import { useRouter } from 'next/navigation';

// export default function AuthPage() {
//     const router = useRouter();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isSignUp, setIsSignUp] = useState(false);

//     const handleSubmit = async (e: { preventDefault: () => void; }) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         if (isSignUp) {
//             // Sign up
//             const { error } = await supabase.auth.signUp({ email, password });
//             if (error) setError(error.message);
//             else alert('Signup successful! Check your email for confirmation.');
//         } else {
//             // Sign in
//             const { error } = await supabase.auth.signInWithPassword({ email, password });
//             if (error) setError(error.message);
//             else router.replace('/todos');
//         }

//         setLoading(false);
//     };

//     const handleGoogleSignIn = async () => {
//         setLoading(true);
//         const { error } = await supabase.auth.signInWithOAuth({
//             provider: 'google',
//             options: {
//                 redirectTo: `${window.location.origin}/todos`,
//             },
//         });
//         if (error) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
//             {/* Logo */}
//             <h1 className="text-4xl tracking-tighter font-bold text-gray-900 mb-3">
//                 todo<span className="text-blue-600">.</span>
//             </h1>

//             {/* Welcome text */}
//             <div className="text-center mb-10">
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                     {isSignUp ? 'Create your account' : 'Welcome back 👋'}
//                 </h2>
//                 <p className="text-gray-500 mt-1">
//                     {isSignUp
//                         ? 'Sign up to get started with your tasks'
//                         : 'Sign in to continue where you left off'}
//                 </p>
//             </div>

//             {/* Auth form */}
//             <form
//                 onSubmit={handleSubmit}
//                 className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm space-y-5"
//             >
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address
//                     </label>
//                     <input
//                         type="email"
//                         placeholder="you@example.com"
//                         className="w-full p-3 placeholder:text-gray-500 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Password
//                     </label>
//                     <input
//                         type="password"
//                         placeholder="••••••••"
//                         className="w-full p-3 placeholder:text-gray-500 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>

//                 {error && <p className="text-red-500 text-sm">{error}</p>}

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
//                 >
//                     {loading
//                         ? isSignUp
//                             ? 'Signing up…'
//                             : 'Signing in…'
//                         : isSignUp
//                             ? 'Sign Up'
//                             : 'Sign In'}
//                 </button>

//                 {/* Google Sign In */}
//                 <button
//                     type="button"
//                     onClick={handleGoogleSignIn}
//                     disabled={loading}
//                     className="w-full border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
//                 >
//                     Continue with Google
//                 </button>

//                 {/* Toggle between Sign In and Sign Up */}
//                 <p className="text-center text-sm text-gray-600">
//                     {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
//                     <button
//                         type="button"
//                         onClick={() => setIsSignUp(!isSignUp)}
//                         className="text-blue-600 font-medium hover:underline"
//                     >
//                         {isSignUp ? 'Sign in' : 'Sign up'}
//                     </button>
//                 </p>
//             </form>
//         </div>
//     );
// }


'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../../../lib/supabaseProvider';

export default function AuthPage() {
    const router = useRouter();
    const supabase = useSupabase(); // supabase client from the provider

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError('Supabase client not ready.');
            setLoading(false);
            return;
        }

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) setError(error.message);
            else alert('Signup successful! Check your email for confirmation.');
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
            else router.replace('/todos');
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        if (!supabase) return;

        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/todos` },
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
            {/* Logo */}
            <h1 className="text-4xl tracking-tighter font-bold text-gray-900 mb-3">
                todo<span className="text-blue-600">.</span>
            </h1>

            {/* Welcome text */}
            <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {isSignUp ? 'Create your account' : 'Welcome back 👋'}
                </h2>
                <p className="text-gray-500 mt-1">
                    {isSignUp
                        ? 'Sign up to get started with your tasks'
                        : 'Sign in to continue where you left off'}
                </p>
            </div>

            {/* Auth form */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm space-y-5"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full p-3 placeholder:text-gray-500 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full p-3 placeholder:text-gray-500 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
                >
                    {loading
                        ? isSignUp
                            ? 'Signing up…'
                            : 'Signing in…'
                        : isSignUp
                            ? 'Sign Up'
                            : 'Sign In'}
                </button>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
            </form>
        </div>
    );
}
