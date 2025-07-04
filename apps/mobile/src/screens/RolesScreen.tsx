import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoleStore } from '../stores/roleStore';
import { Ionicons } from '@expo/vector-icons';

export function RolesScreen() {
  const navigation = useNavigation();
  const { roles, addRole, updateRole, deleteRole } = useRoleStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      addRole(newRoleName.trim());
      setNewRoleName('');
      setIsAdding(false);
    }
  };

  const handleUpdateRole = (id: string) => {
    if (editingName.trim()) {
      updateRole(id, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
    }
  };

  const navigateToOutcomes = (roleId: string, roleName: string) => {
    navigation.navigate('OutcomeManagement', { roleId, roleName });
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-deep-blue">
              Your Identity Roles
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
              <TextInput
                value={newRoleName}
                onChangeText={setNewRoleName}
                placeholder="Enter role name (e.g., Father, CEO, Athlete)"
                className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                autoFocus
              />
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleAddRole}
                  className="flex-1 bg-rich-red rounded-md py-2"
                >
                  <Text className="text-white text-center font-medium">
                    Add Role
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsAdding(false);
                    setNewRoleName('');
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

          {roles.map((role) => (
            <View key={role.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              {editingId === role.id ? (
                <View>
                  <TextInput
                    value={editingName}
                    onChangeText={setEditingName}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-3"
                    autoFocus
                  />
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleUpdateRole(role.id)}
                      className="flex-1 bg-rich-red rounded-md py-2"
                    >
                      <Text className="text-white text-center font-medium">
                        Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingId(null);
                        setEditingName('');
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
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-semibold text-deep-blue">
                      {role.name}
                    </Text>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => {
                          setEditingId(role.id);
                          setEditingName(role.name);
                        }}
                      >
                        <Ionicons name="pencil" size={20} color="#1E3A8A" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteRole(role.id)}>
                        <Ionicons name="trash" size={20} color="#991B1B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-gray-600 mt-2">
                    {role.outcomes.length} outcomes • {role.milestones.length} milestones
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigateToOutcomes(role.id, role.name)}
                    className="mt-3 bg-deep-blue rounded-md py-2"
                  >
                    <Text className="text-white text-center font-medium">
                      Manage Outcomes
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}