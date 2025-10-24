// 'use client';
// import { useRouter, useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function TodoDetailPage() {
//     const router = useRouter();
//     const params = useParams();
//     const id = Number(params.id);
//     const [user, setUser] = useState(null);
//     const [todo, setTodo] = useState(null);

//     useEffect(() => {
//         const savedUser = localStorage.getItem('demoUser');
//         if (!savedUser) return router.push('/auth');
//         const u = JSON.parse(savedUser);
//         setUser(u);
//         const todos = JSON.parse(localStorage.getItem(`todos_${u.id}`)) || [];
//         const found = todos.find((t) => t.id === id);
//         if (!found) router.push('/todos');
//         else setTodo(found);
//     }, [id, router]);

//     if (!todo) return null;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//             <div className="bg-white border-b p-4 flex items-center gap-2">
//                 <button
//                     onClick={() => router.back()}
//                     className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                 >
//                     ← Back
//                 </button>
//             </div>

//             <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded-lg shadow">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">{todo.title}</h1>
//                 <p className="text-gray-600 mb-4">
//                     Created: {new Date(todo.createdAt).toLocaleString()}
//                 </p>
//                 <div
//                     className={`inline-block px-3 py-1 rounded-full text-sm ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
//                         }`}
//                 >
//                     {todo.completed ? 'Completed' : 'Active'}
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Todo = {
    id: string;
    title: string;
    description: string | null;
    date: string | null;
    time: string | null;
    user_id: string;
};

export default function TodoDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodo = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth");
                return;
            }

            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("id", params.id)
                .eq("user_id", user.id)
                .single();

            if (error) {
                console.error("Error fetching todo:", error);
                router.push("/");
            } else {
                setTodo(data);
            }

            setLoading(false);
        };

        if (params.id) {
            fetchTodo();
        }
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!todo) return;

        const { error } = await supabase.from("todos").delete().eq("id", todo.id);

        if (error) {
            console.error("Error deleting todo:", error);
        } else {
            router.push("/");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Todo not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <button
                    onClick={() => router.push("/todos")}
                    className="mb-6 text-gray-600 hover:text-blue-700 font-medium"
                >
                    ← Back to todos
                </button>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{todo.title}</h1>

                    {todo.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{todo.description}</p>
                        </div>
                    )}

                    {(todo.date || todo.time) && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Schedule</h3>
                            <div className="flex flex-wrap gap-2">
                                {todo.date && (
                                    <span className="bg-gray-100 px-3 py-2 rounded-lg border text-gray-600 border-gray-200 text-sm">
                                        📅 {new Date(todo.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                                {todo.time && (
                                    <span className="bg-gray-100 px-3 py-2 rounded-lg border text-gray-600 border-gray-200 text-sm">
                                        🕐 {todo.time}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Delete Task
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}