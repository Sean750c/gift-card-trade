import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react-native';

export default function VerifyOTP() {
  const router = useRouter();
  const { colors } = useTheme();
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResendCode = () => {
    if (timeLeft === 0) {
      // Reset the timer
      setTimeLeft(60);
      // Logic to resend OTP would go here
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    // On backspace, move to previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await verifyOtp(otpValue);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Verification</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a verification code to your email/phone. Enter the code below to verify your account.
          </Text>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              style={[
                styles.otpInput, 
                { 
                  borderColor: digit ? colors.primary : colors.border,
                  backgroundColor: colors.card,
                  color: colors.text
                }
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={(e) => handleKeyPress(index, e)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            Didn't receive code?
          </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={timeLeft > 0}
          >
            <Text 
              style={[
                styles.resendLink, 
                { color: timeLeft > 0 ? colors.textSecondary : colors.primary }
              ]}
            >
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    padding: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'WorkSans-Bold',
  },
  verifyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    marginRight: 4,
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
  },
});