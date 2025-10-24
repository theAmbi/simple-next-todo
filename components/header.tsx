'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user ?? null)
        }

        fetchUser()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener?.subscription?.unsubscribe?.()
    }, [])

    // close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'User'
    const avatar = user.user_metadata?.avatar_url

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.replace('/auth')
    }

    return (
        <header className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg shadow-sm mb-4 ">
            <div className='w-full flex items-center justify-between lg:max-w-5xl lg:mx-auto'>
                <h1 className="text-base font-medium text-gray-700">
                    Welcome back, <span className="text-blue-600 font-semibold">{firstName}</span> 👋
                </h1>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center gap-2 cursor-pointer select-none"
                    >
                        {avatar ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                                <Image src={avatar} alt={firstName} fill sizes="32px" className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50">
                            <div className="flex flex-col items-center text-center px-4 pb-3 border-b border-gray-100">
                                {avatar ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 mb-2">
                                        <Image src={avatar} alt={firstName} fill sizes="48px" className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-600 mb-2">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <p className="text-sm font-medium">{user.user_metadata?.full_name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
