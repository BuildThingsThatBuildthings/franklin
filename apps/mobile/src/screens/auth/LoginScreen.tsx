import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
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
        <View className="flex-1 justify-center px-8">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-deep-blue text-center">
              Franklin
            </Text>
            <Text className="text-lg text-gray-600 text-center mt-2">
              Transform goals into daily actions
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
              placeholder="Password"
              secureTextEntry
              className="bg-white px-4 py-3 rounded-lg shadow-sm"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-6 py-3 rounded-lg ${
              loading ? 'bg-gray-400' : 'bg-rich-red'
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="mt-4"
          >
            <Text className="text-deep-blue text-center">
              Don't have an account? <Text className="font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}