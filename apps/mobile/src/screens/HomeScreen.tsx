import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoleStore } from '../stores/roleStore';
import { useMicroStepStore } from '../stores/microStepStore';
import { format } from '../utils/date';

export function HomeScreen() {
  const roles = useRoleStore((state) => state.roles);
  const todaySteps = useMicroStepStore((state) => state.getTodaySteps());

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl font-bold text-deep-blue mt-4">
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
        
        <View className="mt-6">
          <Text className="text-lg font-semibold text-deep-blue mb-3">
            Today's Micro-Steps
          </Text>
          
          {todaySteps.length === 0 ? (
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-gray-500 text-center">
                No micro-steps planned for today.
              </Text>
              <TouchableOpacity className="mt-3 bg-rich-red rounded-md py-2">
                <Text className="text-white text-center font-medium">
                  Plan Your Day
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            todaySteps.map((step) => (
              <View
                key={step.id}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <Text className="text-deep-blue font-medium">
                  {step.description}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View
                    className={`px-2 py-1 rounded ${
                      step.status === 'done'
                        ? 'bg-green-100'
                        : step.status === 'planned'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        step.status === 'done'
                          ? 'text-green-800'
                          : step.status === 'planned'
                          ? 'text-blue-800'
                          : 'text-gray-800'
                      }`}
                    >
                      {step.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 ml-3">
                    {step.roleName}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="mt-6 mb-8">
          <Text className="text-lg font-semibold text-deep-blue mb-3">
            Your Roles
          </Text>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <Text className="text-deep-blue font-medium text-lg">
                {role.name}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {role.outcomes.length} active outcomes
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}