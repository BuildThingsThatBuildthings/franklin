import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMilestoneStore } from '../stores/milestoneStore';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format } from '../utils/date';

export function MilestoneScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { outcomeId, outcomeTitle, roleName } = route.params as {
    outcomeId: string;
    outcomeTitle: string;
    roleName: string;
  };
  
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestoneStore();
  const outcomeMilestones = milestones
    .filter(m => m.outcome_id === outcomeId)
    .sort((a, b) => a.order - b.order);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddMilestone = () => {
    if (newMilestoneTitle.trim()) {
      const dueDate = addDays(new Date(), 28); // 4 weeks from now
      addMilestone(outcomeId, newMilestoneTitle.trim(), dueDate);
      setNewMilestoneTitle('');
      setIsAdding(false);
    }
  };

  const handleGenerateMicroSteps = (milestoneId: string, milestoneTitle: string) => {
    navigation.navigate('MicroSteps', {
      milestoneId,
      milestoneTitle,
      outcomeTitle,
      roleName,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
          <Text className="ml-2 text-deep-blue font-medium">{roleName}</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-600 mt-2">{outcomeTitle}</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-deep-blue">
              Milestones
            </Text>
            <TouchableOpacity
              onPress={() => setIsAdding(true)}
              className="bg-rich-red rounded-full p-2"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {isAdding && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-sm text-gray-600 mb-2">
                What's a key milestone toward this outcome?
              </Text>
              <TextInput
                value={newMilestoneTitle}
                onChangeText={setNewMilestoneTitle}
                placeholder="e.g., Schedule weekly family activities"
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                multiline
                autoFocus
              />
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleAddMilestone}
                  className="flex-1 bg-rich-red rounded-md py-2"
                >
                  <Text className="text-white text-center font-medium">
                    Add Milestone
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsAdding(false);
                    setNewMilestoneTitle('');
                  }}
                  className="flex-1 bg-gray-300 rounded-md py-2"
                >
                  <Text className="text-gray-700 text-center font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {outcomeMilestones.length === 0 && !isAdding && (
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-gray-500 text-center">
                No milestones yet. Break down your outcome into smaller goals.
              </Text>
            </View>
          )}

          {outcomeMilestones.map((milestone, index) => (
            <View key={milestone.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <View className="bg-deep-blue rounded-full w-8 h-8 items-center justify-center mr-3">
                  <Text className="text-white font-bold">{index + 1}</Text>
                </View>
                <Text className="text-lg font-semibold text-deep-blue flex-1">
                  {milestone.title}
                </Text>
              </View>
              
              {milestone.due_date && (
                <Text className="text-sm text-gray-500 ml-11 mb-2">
                  Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                </Text>
              )}
              
              <TouchableOpacity
                onPress={() => handleGenerateMicroSteps(milestone.id, milestone.title)}
                className="bg-deep-blue rounded-md py-2 ml-11"
              >
                <Text className="text-white text-center font-medium">
                  Manage Micro-Steps
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {outcomeMilestones.length > 0 && (
            <View className="bg-blue-50 rounded-lg p-4 mb-8">
              <Text className="text-sm text-deep-blue">
                💡 <Text className="font-semibold">Tip:</Text> Each milestone should be
                achievable in 2-4 weeks and directly contribute to your 12-week outcome.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}