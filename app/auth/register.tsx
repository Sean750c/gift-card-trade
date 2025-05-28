import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register(fullName, email, phone, password);
      router.push('/auth/verify');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
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
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign up to start trading gift cards securely
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <User size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Mail size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your email address"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Phone size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your phone number"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Lock size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Create a strong password"
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
              style={[styles.registerButton, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>
                  Sign In
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
    marginBottom: 32,
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
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
  },
});