# Franklin - Transform Identity Goals into Daily Actions

Franklin is a React Native mobile app that helps users achieve their identity-level goals through daily micro-actions. Built with Expo, TypeScript, and Supabase.

## 🎯 Mission

Franklin transforms identity-level goals into daily micro-actions.

## ✨ Features

- **Identity-Based Goal Setting**: Define who you want to be through roles (Father, Professional, Health Enthusiast, etc.)
- **12-Week Outcomes**: Set concrete outcomes for each role
- **Micro-Steps**: Break down outcomes into daily actionable steps
- **Twice-Daily Check-ins**: Morning planning and evening reflection
- **Progress Tracking**: Visual analytics and streak tracking
- **Offline-First**: Works without internet, syncs when connected
- **Privacy-Focused**: Your data stays yours

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BuildThingsThatBuildthings/franklin.git
cd franklin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in Supabase SQL editor
   - Run the SQL from `supabase/rls.sql` to set up Row Level Security
   - Copy your project URL and anon key to `.env`

5. Start the development server:
```bash
npm run dev
```

## 🛠️ Development

### Project Structure

```
franklin/
├── apps/
│   └── mobile/          # Expo React Native app
├── packages/
│   ├── ui/             # Shared UI components
│   ├── data-access/    # Supabase hooks and queries
│   └── utils/          # Shared utilities
├── supabase/           # Database schema and migrations
└── docs/               # Documentation
```

### Commands

- `npm run dev` - Start the Expo development server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run build:ios` - Build for iOS (requires EAS)
- `npm run build:android` - Build for Android (requires EAS)

### Tech Stack

- **Frontend**: React Native, Expo SDK 52, TypeScript
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: Zustand + React Query
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Navigation**: React Navigation
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions + EAS Build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Building for Production

### iOS
```bash
cd apps/mobile
eas build --platform ios --profile production
```

### Android
```bash
cd apps/mobile
eas build --platform android --profile production
```

## 🔒 Security

- All data is encrypted at rest and in transit
- Row-level security ensures users only see their own data
- No tracking or analytics without explicit consent
- Regular security audits based on OWASP Mobile Top 10

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love by [BuildThingsThatBuildThings](https://github.com/BuildThingsThatBuildthings)
- Inspired by identity-based habit formation research
- Special thanks to the React Native and Expo communities

---

**Ready to transform your identity into daily actions? Let's build together! 🚀**