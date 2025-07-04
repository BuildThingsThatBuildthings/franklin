import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMicroStepStore } from '../stores/microStepStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

export function CheckInScreen() {
  const { getTodaySteps, updateStepStatus, addReflection } = useMicroStepStore();
  const [todaySteps, setTodaySteps] = useState(getTodaySteps());
  const [reflection, setReflection] = useState('');
  const [checkInType, setCheckInType] = useState<'morning' | 'evening'>(
    new Date().getHours() < 12 ? 'morning' : 'evening'
  );

  useEffect(() => {
    setTodaySteps(getTodaySteps());
  }, []);

  const handleStatusToggle = (stepId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'planned' : 'done';
    updateStepStatus(stepId, newStatus);
    setTodaySteps(getTodaySteps());
  };

  const handleSaveReflection = () => {
    if (reflection.trim()) {
      addReflection(new Date().toISOString().split('T')[0], reflection);
      setReflection('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <Text className="text-2xl font-bold text-deep-blue">
            {checkInType === 'morning' ? '🌅 Morning Plan' : '🌙 Evening Reflect'}
          </Text>
          <Text className="text-gray-600 mt-2">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-lg font-semibold text-deep-blue mb-3">
            Today's Micro-Steps
          </Text>

          {todaySteps.length === 0 ? (
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-gray-500 text-center">
                No micro-steps for today. Add some from your roles!
              </Text>
            </View>
          ) : (
            todaySteps.map((step) => (
              <TouchableOpacity
                key={step.id}
                onPress={() => handleStatusToggle(step.id, step.status)}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-start">
                  <View className="mr-3 mt-1">
                    <Ionicons
                      name={
                        step.status === 'done'
                          ? 'checkmark-circle'
                          : 'checkmark-circle-outline'
                      }
                      size={24}
                      color={step.status === 'done' ? '#16A34A' : '#9CA3AF'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-medium ${
                        step.status === 'done'
                          ? 'text-gray-500 line-through'
                          : 'text-deep-blue'
                      }`}
                    >
                      {step.description}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {step.roleName} • {step.type}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {checkInType === 'evening' && (
          <View className="mt-6 mb-8">
            <Text className="text-lg font-semibold text-deep-blue mb-3">
              Daily Reflection
            </Text>
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <TextInput
                value={reflection}
                onChangeText={setReflection}
                placeholder="How did today go? (140 characters max)"
                multiline
                maxLength={140}
                className="min-h-[80px] text-gray-700"
                textAlignVertical="top"
              />
              <Text className="text-xs text-gray-500 mt-2">
                {reflection.length}/140 characters
              </Text>
              <TouchableOpacity
                onPress={handleSaveReflection}
                className="mt-3 bg-rich-red rounded-md py-2"
              >
                <Text className="text-white text-center font-medium">
                  Save Reflection
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}