# Hafazan — Surau Seri Dahlia

A responsive Quran memorization tracker foundation for teachers and families. The initial release uses fictional, centralized demo data; student records and checklist edits are not saved.

## Run locally

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Visit the local URL printed by Vite.

Run `npm run typecheck` and `npm run build` to validate the application and create a production build.

## Supabase authentication

The app starts in **Demo mode** when Supabase credentials are absent. Sign-in and sign-up are not simulated in this mode; the demo workspace remains available, and progress edits are local to the open page.

To enable Supabase email/password authentication, create a `.env` file from `.env.example` and set:

- `VITE_SUPABASE_URL` — your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — your project's public anon key.

Restart Vite after changing environment variables. When configured, the application restores the Supabase session and requires sign-in to open the workspace. Configure these same variables in the Vercel project settings for a deployed application. Never put a service-role key in frontend environment variables.

## Initial scope

Included are the dashboard, searchable and filterable student list, per-student surah checklist, teacher overview, responsive navigation, and a Supabase Auth foundation. The demo student names and progress are fictional. Database tables, role enforcement, parent acknowledgment, persistent progress, and report exports are intentionally deferred.
