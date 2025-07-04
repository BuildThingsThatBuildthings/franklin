import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';

export function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      navigation.navigate('Onboarding');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8 py-8">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-deep-blue text-center">
                Create Account
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Start your journey to identity-based productivity
              </Text>
            </View>

            <View className="space-y-4">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password (min 6 characters)"
                secureTextEntry
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`mt-6 py-3 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-rich-red'
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mt-4"
            >
              <Text className="text-deep-blue text-center">
                Already have an account? <Text className="font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}