import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoleStore } from '../../stores/roleStore';
import { useNotifications } from '../../providers/NotificationProvider';
import { Ionicons } from '@expo/vector-icons';

const SUGGESTED_ROLES = [
  { name: 'Father', icon: 'people' },
  { name: 'Professional', icon: 'briefcase' },
  { name: 'Health Enthusiast', icon: 'fitness' },
  { name: 'Friend', icon: 'heart' },
  { name: 'Learner', icon: 'book' },
  { name: 'Creator', icon: 'bulb' },
];

export function OnboardingScreen() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [customRole, setCustomRole] = useState('');
  const { addRole } = useRoleStore();
  const { scheduleMorningPlan, scheduleEveningReflect } = useNotifications();
  const navigation = useNavigation();

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const addCustomRole = () => {
    if (customRole.trim() && !selectedRoles.includes(customRole.trim())) {
      setSelectedRoles((prev) => [...prev, customRole.trim()]);
      setCustomRole('');
    }
  };

  const completeOnboarding = async () => {
    // Add selected roles
    for (const roleName of selectedRoles) {
      await addRole(roleName);
    }

    // Schedule notifications
    await scheduleMorningPlan();
    await scheduleEveningReflect();

    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-6">
        <View className="mt-8 mb-6">
          <Text className="text-3xl font-bold text-deep-blue text-center">
            Define Your Identity
          </Text>
          <Text className="text-gray-600 text-center mt-3">
            Select the roles that matter most to you. These will shape your daily
            micro-steps.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-deep-blue mb-4">
            Suggested Roles
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {SUGGESTED_ROLES.map((role) => (
              <TouchableOpacity
                key={role.name}
                onPress={() => toggleRole(role.name)}
                className={`m-2 px-4 py-3 rounded-lg flex-row items-center ${
                  selectedRoles.includes(role.name)
                    ? 'bg-rich-red'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <Ionicons
                  name={role.icon as any}
                  size={20}
                  color={selectedRoles.includes(role.name) ? 'white' : '#1E3A8A'}
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedRoles.includes(role.name)
                      ? 'text-white'
                      : 'text-deep-blue'
                  }`}
                >
                  {role.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-semibold text-deep-blue mb-3">
            Add Custom Role
          </Text>
          <View className="flex-row space-x-2">
            <TextInput
              value={customRole}
              onChangeText={setCustomRole}
              placeholder="Enter custom role"
              className="flex-1 bg-white px-4 py-3 rounded-lg shadow-sm"
            />
            <TouchableOpacity
              onPress={addCustomRole}
              className="bg-deep-blue px-4 py-3 rounded-lg"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {selectedRoles.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-deep-blue mb-3">
              Your Selected Roles ({selectedRoles.length})
            </Text>
            <View className="bg-white rounded-lg p-4 shadow-sm">
              {selectedRoles.map((role, index) => (
                <View
                  key={role}
                  className={`flex-row justify-between items-center ${
                    index > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''
                  }`}
                >
                  <Text className="text-deep-blue font-medium">{role}</Text>
                  <TouchableOpacity onPress={() => toggleRole(role)}>
                    <Ionicons name="close-circle" size={24} color="#991B1B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={completeOnboarding}
          disabled={selectedRoles.length === 0}
          className={`mb-8 py-3 rounded-lg ${
            selectedRoles.length === 0 ? 'bg-gray-400' : 'bg-rich-red'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}