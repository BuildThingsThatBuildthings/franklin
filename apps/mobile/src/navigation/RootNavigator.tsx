import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../providers/AuthProvider';
import { AuthNavigator } from './AuthNavigator';
import { HomeScreen } from '../screens/HomeScreen';
import { RolesScreen } from '../screens/RolesScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Roles') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'CheckIn') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#991B1B',
        tabBarInactiveTintColor: '#6B7280',
        headerStyle: {
          backgroundColor: '#FDF9F3',
        },
        headerTintColor: '#1E3A8A',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Roles" component={RolesScreen} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}