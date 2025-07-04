# Franklin App Deployment Guide

## Prerequisites

- Expo account (free at expo.dev)
- Apple Developer account ($99/year for iOS)
- Google Play Developer account ($25 one-time for Android)
- Supabase project (free tier available)

## Environment Setup

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/functions/calculate_identity_score.sql`

3. Get your credentials:
   - Settings → API → Project URL
   - Settings → API → anon public key

4. Update `.env` file:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Expo Setup

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure project:
```bash
cd apps/mobile
eas build:configure
```

4. Update `app.json` with your project ID

## Build Process

### Development Build

```bash
cd apps/mobile
eas build --profile development --platform all
```

### Preview Build (for TestFlight/Internal Testing)

```bash
eas build --profile preview --platform all
```

### Production Build

```bash
eas build --profile production --platform all
```

## App Store Submission

### iOS (App Store)

1. Build for production:
```bash
eas build --profile production --platform ios
```

2. Submit to App Store:
```bash
eas submit --platform ios
```

3. Required in App Store Connect:
   - App screenshots (6.5", 5.5")
   - App description
   - Keywords
   - Privacy policy URL
   - Support URL

### Android (Google Play)

1. Build for production:
```bash
eas build --profile production --platform android
```

2. Submit to Google Play:
```bash
eas submit --platform android
```

3. Required in Google Play Console:
   - App screenshots
   - Feature graphic (1024x500)
   - App description
   - Content rating questionnaire
   - Privacy policy URL

## Post-Launch

### Monitoring

1. **Sentry** (Error Tracking)
   - Create project at sentry.io
   - Add DSN to app config
   - Monitor crashes and performance

2. **PostHog** (Analytics)
   - Set up project at posthog.com
   - Add API key to app
   - Track user behavior and feature adoption

3. **Supabase Dashboard**
   - Monitor database usage
   - Check authentication metrics
   - Review Row Level Security logs

### Updates

1. **Over-the-Air Updates** (for JS changes):
```bash
eas update --branch production --message "Bug fixes"
```

2. **Native Updates** (for native code changes):
   - Increment version in `app.json`
   - Build new version
   - Submit to stores

## Security Checklist

- [ ] All API keys in environment variables
- [ ] Row Level Security enabled on all tables
- [ ] SSL certificates valid
- [ ] Authentication required for all data access
- [ ] Input validation on all forms
- [ ] Sensitive data encrypted at rest
- [ ] Regular security audits scheduled

## Performance Optimization

1. **Images**
   - Use WebP format where possible
   - Implement lazy loading
   - Optimize with `expo-optimize`

2. **Bundle Size**
   - Run `npx expo-doctor`
   - Remove unused dependencies
   - Enable Hermes on Android

3. **Database**
   - Index frequently queried columns
   - Use database views for complex queries
   - Implement pagination for large datasets

## Backup Strategy

1. **Database Backups**
   - Enable Point-in-Time Recovery in Supabase
   - Schedule daily backups
   - Test restore procedures monthly

2. **Code Backups**
   - GitHub repository (already set up)
   - Tag all releases
   - Maintain changelog

## Support

- **User Support**: Set up help@yourapp.com
- **Bug Reports**: Use GitHub Issues
- **Feature Requests**: Use GitHub Discussions
- **Status Page**: statuspage.io or similar

---

**Remember**: Always test thoroughly on real devices before submitting to app stores!