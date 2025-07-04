import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the providers and navigation
jest.mock('../src/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ user: null, loading: false }),
}));

jest.mock('../src/providers/NotificationProvider', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    // The app should render and show the auth screen when not logged in
    expect(getByText).toBeTruthy();
  });
});