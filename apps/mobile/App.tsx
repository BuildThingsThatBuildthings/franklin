import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './src/providers/NotificationProvider';
import { AuthProvider } from './src/providers/AuthProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useInitializeStores } from './src/hooks/useInitializeStores';
import './src/styles/global.css';

const queryClient = new QueryClient();

function AppContent() {
  useInitializeStores();
  
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}