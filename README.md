# Academia Tracker

Tracker del progreso de grabación de la academia de cubos de Rubik.
React + Vite + Tailwind v4 + Supabase, instalable como PWA.

## Desarrollo local

```bash
cp .env.example .env.local   # y rellena las claves de Supabase
npm install
npm run dev
```

## Supabase

1. Ejecuta `supabase/schema.sql` en el SQL Editor.
2. Authentication → Sign In / Providers → desactiva "Allow new users to sign up".
3. Authentication → Users → Add user → Create new user, con email `usuario@academia.app`
   (o el dominio de `VITE_USERNAME_DOMAIN`) y marca "Auto Confirm User".
   En la app se entra escribiendo solo `usuario`.

## Vercel

Importa el repo (framework: Vite) y añade las variables `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` y opcionalmente `VITE_USERNAME_DOMAIN`.
