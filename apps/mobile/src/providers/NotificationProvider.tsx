import React, { createContext, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  scheduleMorningPlan: () => Promise<void>;
  scheduleEveningReflect: () => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  };

  const scheduleMorningPlan = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Morning Planning',
        body: 'Time to plan your micro-steps for today!',
      },
      trigger: {
        hour: 5,
        minute: 0,
        repeats: true,
      },
    });
  };

  const scheduleEveningReflect = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Evening Reflection',
        body: 'How did your micro-steps go today?',
      },
      trigger: {
        hour: 21,
        minute: 0,
        repeats: true,
      },
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return (
    <NotificationContext.Provider
      value={{
        scheduleMorningPlan,
        scheduleEveningReflect,
        cancelAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};