# Franklin MVP TODO List

## Initial Setup Tasks

1. 🔧 Scaffold monorepo directory (`apps/`, `packages/`, `supabase/`, `docs/`).
2. ⚙️ Set up **Expo SDK 52** React Native app in `apps/mobile` (TypeScript).
3. 🖍️ Implement tailwind.css-style sheet (`nativewind`) with palette: rich red `#991B1B`, deep blue `#1E3A8A`, parchment white `#FDF9F3`.
4. 🗄️ Initialize Supabase project; push SQL schema & RLS policies from `supabase/`.
5. 🛠️ Configure ESLint, Prettier, Husky pre-commit in root.
6. 🚥 Create GitHub Actions workflow: `ci.yml` (lint + test) and `build.yml` (EAS build).
7. 🧪 Install Jest + React Native Testing Library; add sample test.
8. 📲 Enable Expo Notifications; stub Plan/Reflect push schedulers.
9. 🔐 Add .env.example with SUPABASE_URL & ANON_KEY placeholders.
10. 📚 Commit Figma link & architecture.md draft to `docs/`.