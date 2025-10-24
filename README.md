# Todo App

A simple todo application with Google authentication.

## Features

- Google Sign-In authentication
- Create todos with title, description, date, and time
- View all your todos in a list
- Click on a todo to view full details
- Delete todos
- Personal todos (each user sees only their own)

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Database & Authentication)
- Tailwind CSS
- TypeScript
- Geist Font

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Add environment variables (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

3. Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

```sql
todos table:
- id (uuid)
- user_id (uuid)
- title (text)
- description (text)
- date (date)
- time (time)
- created_at (timestamp)
```
