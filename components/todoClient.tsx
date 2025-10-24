/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import type { Database } from "@/types/supabase"; // optional typing

export default function TodoClient() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [todos, setTodos] = useState<any[]>([]);
    const [newTodo, setNewTodo] = useState("");

    // Fetch todos for the logged-in user
    useEffect(() => {
        const fetchTodos = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user.id);

            if (!error && data) setTodos(data);
        };

        fetchTodos();
    }, []);

    // Add a new todo
    const handleAddTodo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !newTodo.trim()) return;

        const { data, error } = await supabase
            .from("todos")
            .insert([{ task: newTodo, user_id: user.id }])
            .select();

        if (!error && data) {
            setTodos([...todos, ...data]);
            setNewTodo("");
        }
    };

    // Delete a todo
    const handleDeleteTodo = async (id: number) => {
        await supabase.from("todos").delete().eq("id", id);
        setTodos(todos.filter((t) => t.id !== id));
    };

    return (
        <div className="max-w-md mx-auto mt-8 space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddTodo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex justify-between p-2 border rounded"
                    >
                        <span>{todo.task}</span>
                        <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}