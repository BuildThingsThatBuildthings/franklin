import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '../stores/progressStore';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export function ProgressScreen() {
  const { getWeeklyProgress, getStreaks, getIdentityScore } = useProgressStore();
  const weeklyData = getWeeklyProgress();
  const streaks = getStreaks();
  const identityScore = getIdentityScore();

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <Text className="text-2xl font-bold text-deep-blue mb-6">
            Your Progress
          </Text>

          <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-deep-blue mb-2">
              Identity Score
            </Text>
            <View className="flex-row items-end">
              <Text className="text-4xl font-bold text-rich-red">
                {identityScore}
              </Text>
              <Text className="text-lg text-gray-600 ml-1 mb-1">/ 100</Text>
            </View>
            <Text className="text-sm text-gray-500 mt-2">
              Based on your micro-step completion rate
            </Text>
          </View>

          <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-deep-blue mb-4">
              Weekly Completion
            </Text>
            {weeklyData.labels.length > 0 && weeklyData.data.length > 0 ? (
              <LineChart
                data={{
                  labels: weeklyData.labels,
                  datasets: [
                    {
                      data: weeklyData.data,
                    },
                  ],
                }}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(153, 27, 27, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#991B1B',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <Text className="text-gray-500 text-center py-8">
                No data available yet
              </Text>
            )}
          </View>

          <View className="bg-white rounded-lg p-4 mb-8 shadow-sm">
            <Text className="text-lg font-semibold text-deep-blue mb-4">
              Current Streaks
            </Text>
            {streaks.length > 0 ? (
              streaks.map((streak) => (
                <View key={streak.roleId} className="mb-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-700 font-medium">
                      {streak.roleName}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-2xl font-bold text-rich-red mr-1">
                        {streak.days}
                      </Text>
                      <Text className="text-gray-600">days</Text>
                    </View>
                  </View>
                  <View className="bg-gray-200 h-2 rounded-full mt-2">
                    <View
                      className="bg-rich-red h-2 rounded-full"
                      style={{ width: `${Math.min(streak.days / 30 * 100, 100)}%` }}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-center">
                Start completing micro-steps to build streaks!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}