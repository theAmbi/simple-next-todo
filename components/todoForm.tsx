"use client";

import { useState } from "react";

export default function TodoForm({ onSubmit }: { onSubmit?: (todo: any) => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const todo = { title, description, date, time };
        if (onSubmit) onSubmit(todo);
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 flex flex-col gap-4"
        >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                Create New Todo
            </h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter todo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    placeholder="Add details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="time" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time
                    </label>
                    <input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
            >
                Add Todo
            </button>
        </form>
    );
}
