import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue trading gift cards
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Mail size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Lock size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={navigateToForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={[styles.registerLink, { color: colors.primary }]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    padding: 8,
    marginBottom: 16,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
  },
});