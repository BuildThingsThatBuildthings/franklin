module.exports = {
  projects: [
    {
      displayName: 'mobile',
      testMatch: ['<rootDir>/apps/mobile/**/*.test.{js,ts,tsx}'],
      preset: 'jest-expo',
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
      ],
    },
    {
      displayName: 'packages',
      testMatch: ['<rootDir>/packages/**/*.test.{js,ts,tsx}'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
  ],
};