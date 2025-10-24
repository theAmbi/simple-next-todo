/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    user_id?: string;
};

export default function TodosPage() {
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    // Check auth and fetch todos
    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth");
                return;
            }

            setUser(user);

            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: true });

            if (error) console.error("Error fetching todos:", error);
            else setTodos(data || []);

            setLoading(false);
        };

        init();
    }, [router]);

    // Handle adding a todo
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Please sign in first.");
            router.push("/auth");
            return;
        }

        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        const { data, error } = await supabase
            .from("todos")
            .insert([{
                title,
                description: description || null,
                date: date || null,
                time: time || null,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) {
            console.error("Error adding todo:", error);
        } else {
            setTodos((prev) => [...prev, data]);
            // Clear form
            setTitle("");
            setDescription("");
            setDate("");
            setTime("");
        }
    };

    // Handle deleting a todo
    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("todos").delete().eq("id", id);
        if (error) console.error(error);
        else setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    // Handle sign out
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
    };

    // Handle todo click - navigate to detail page
    const handleTodoClick = (todoId: string) => {
        router.push(`/todos/${todoId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
                        {user && (
                            <div className="flex items-center gap-2">
                                {user.user_metadata?.avatar_url ? (
                                    <Image
                                        src={user.user_metadata.avatar_url}
                                        alt="User avatar"
                                        className="w-8 h-8 rounded-full border border-gray-300"
                                        width={34}
                                        height={34}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-gray-300">
                                        <span className="text-sm font-semibold text-blue-600">
                                            {(user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <span className="text-base font-medium text-gray-700">
                                    {user.user_metadata?.first_name || user.email?.split('@')[0]}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Add Todo Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title"
                                className="w-full px-3 py-2 text-gray-600 placeholder:text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add details about your task"
                                rows={3}
                                className="w-full px-3 py-2 text-gray-600 placeholder:text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 text-gray-600 placeholder:text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-3 py-2 text-gray-600 placeholder:text-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        >
                            Add Task
                        </button>
                    </form>
                </div>

                {/* Todos List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading tasks...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No tasks yet. Add one above to get started! ✨</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    onClick={() => handleTodoClick(todo.id)}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition cursor-pointer"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{todo.title}</h3>
                                            {todo.description && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {todo.description}
                                                </p>
                                            )}
                                            {(todo.date || todo.time) && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    {todo.date && (
                                                        <span className="bg-white px-2 py-1 rounded border border-gray-200">
                                                            📅 {new Date(todo.date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {todo.time && (
                                                        <span className="bg-white px-2 py-1 rounded border border-gray-200">
                                                            🕐 {todo.time}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(todo.id);
                                            }}
                                            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}