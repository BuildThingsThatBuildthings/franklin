import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOutcomeStore } from '../stores/outcomeStore';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format } from '../utils/date';

export function OutcomeManagementScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { roleId, roleName } = route.params as { roleId: string; roleName: string };
  
  const { outcomes, addOutcome, updateOutcome, deleteOutcome } = useOutcomeStore();
  const roleOutcomes = outcomes.filter(o => o.role_id === roleId && !o.archived);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newOutcomeTitle, setNewOutcomeTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddOutcome = () => {
    if (newOutcomeTitle.trim()) {
      const targetDate = addDays(new Date(), 84); // 12 weeks from now
      addOutcome(roleId, newOutcomeTitle.trim(), targetDate);
      setNewOutcomeTitle('');
      setIsAdding(false);
    }
  };

  const handleUpdateOutcome = (id: string) => {
    if (editingTitle.trim()) {
      updateOutcome(id, { title: editingTitle.trim() });
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const handleDeleteOutcome = (id: string) => {
    Alert.alert(
      'Delete Outcome',
      'Are you sure you want to delete this outcome and all its milestones?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteOutcome(id),
        },
      ]
    );
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
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-deep-blue">
              12-Week Outcomes
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
                What do you want to achieve in 12 weeks?
              </Text>
              <TextInput
                value={newOutcomeTitle}
                onChangeText={setNewOutcomeTitle}
                placeholder="e.g., Be present and engaged with family daily"
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                multiline
                autoFocus
              />
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleAddOutcome}
                  className="flex-1 bg-rich-red rounded-md py-2"
                >
                  <Text className="text-white text-center font-medium">
                    Add Outcome
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsAdding(false);
                    setNewOutcomeTitle('');
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

          {roleOutcomes.length === 0 && !isAdding && (
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-gray-500 text-center">
                No outcomes set for this role yet.
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Tap + to create your first 12-week outcome.
              </Text>
            </View>
          )}

          {roleOutcomes.map((outcome) => (
            <View key={outcome.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              {editingId === outcome.id ? (
                <View>
                  <TextInput
                    value={editingTitle}
                    onChangeText={setEditingTitle}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                    multiline
                    autoFocus
                  />
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleUpdateOutcome(outcome.id)}
                      className="flex-1 bg-rich-red rounded-md py-2"
                    >
                      <Text className="text-white text-center font-medium">
                        Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingId(null);
                        setEditingTitle('');
                      }}
                      className="flex-1 bg-gray-300 rounded-md py-2"
                    >
                      <Text className="text-gray-700 text-center font-medium">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                      <Text className="text-lg font-semibold text-deep-blue">
                        {outcome.title}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        Target: {format(new Date(outcome.target_date), 'MMM d, yyyy')}
                      </Text>
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => {
                          setEditingId(outcome.id);
                          setEditingTitle(outcome.title);
                        }}
                      >
                        <Ionicons name="pencil" size={20} color="#1E3A8A" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteOutcome(outcome.id)}
                      >
                        <Ionicons name="trash" size={20} color="#991B1B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View className="mt-3 pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-600 mb-2">
                      {outcome.milestones?.length || 0} milestones
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Milestones', {
                          outcomeId: outcome.id,
                          outcomeTitle: outcome.title,
                          roleName,
                        });
                      }}
                      className="bg-deep-blue rounded-md py-2"
                    >
                      <Text className="text-white text-center font-medium">
                        Manage Milestones
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}