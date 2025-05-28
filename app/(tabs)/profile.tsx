import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, Shield, CreditCard, ChevronRight, LogOut, Copy, Mail, Phone, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [verificationProgress, setVerificationProgress] = useState(2); // Out of 5

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const navigateToVerification = () => {
    router.push('/verification');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
        <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.card }]}>
          <Edit size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </Text>
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.fullName || 'User Name'}
          </Text>
          
          <View style={styles.userIdContainer}>
            <Text style={[styles.userId, { color: colors.textSecondary }]}>
              ID: 12345678
            </Text>
            <TouchableOpacity style={styles.copyButton}>
              <Copy size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.contactInfoContainer}>
          <View style={[styles.contactItem, { backgroundColor: colors.card }]}>
            <Mail size={20} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text }]}>
              {user?.email || 'user@example.com'}
            </Text>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
              <CheckCircle size={14} color="white" />
            </View>
          </View>
          
          <View style={[styles.contactItem, { backgroundColor: colors.card }]}>
            <Phone size={20} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text }]}>
              {user?.phone || '+234 812 345 6789'}
            </Text>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
              <CheckCircle size={14} color="white" />
            </View>
          </View>
        </View>
        
        <View style={[styles.verificationCard, { backgroundColor: colors.card }]}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationTitleContainer}>
              <Shield size={20} color={colors.primary} />
              <Text style={[styles.verificationTitle, { color: colors.text }]}>
                Verification Status
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.verifyButton, { backgroundColor: colors.primary }]}
              onPress={navigateToVerification}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { backgroundColor: colors.border }
              ]}
            >
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${(verificationProgress / 5) * 100}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {verificationProgress}/5 completed
            </Text>
          </View>
          
          <View style={styles.verificationSteps}>
            <VerificationStep 
              label="Email Verification"
              isCompleted={true}
              colors={colors}
            />
            <VerificationStep 
              label="Phone Verification"
              isCompleted={true}
              colors={colors}
            />
            <VerificationStep 
              label="Government ID"
              isCompleted={false}
              colors={colors}
            />
            <VerificationStep 
              label="Bank Account"
              isCompleted={false}
              colors={colors}
            />
            <VerificationStep 
              label="Address Verification"
              isCompleted={false}
              colors={colors}
            />
          </View>
        </View>
        
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, { color: colors.text }]}>
              Payment Methods
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingsItem, { backgroundColor: colors.card }]}
          >
            <View style={styles.settingsItemLeft}>
              <CreditCard size={20} color={colors.primary} />
              <Text style={[styles.settingsItemText, { color: colors.text }]}>
                Bank Accounts
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

function VerificationStep({ label, isCompleted, colors }) {
  return (
    <View style={styles.verificationStep}>
      <View style={[
        styles.verificationStepIcon, 
        { 
          backgroundColor: isCompleted ? colors.success : colors.border,
        }
      ]}>
        {isCompleted ? (
          <CheckCircle size={16} color="white" />
        ) : (
          <XCircle size={16} color="white" />
        )}
      </View>
      <Text style={[
        styles.verificationStepText, 
        { 
          color: isCompleted ? colors.success : colors.textSecondary,
          fontFamily: isCompleted ? 'WorkSans-SemiBold' : 'WorkSans-Regular',
        }
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'WorkSans-Bold',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'WorkSans-Bold',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 8,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  copyButton: {
    padding: 4,
    marginLeft: 8,
  },
  contactInfoContainer: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    marginLeft: 8,
  },
  verifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'WorkSans-SemiBold',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'right',
  },
  verificationSteps: {
    marginBottom: 8,
  },
  verificationStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationStepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verificationStepText: {
    fontSize: 14,
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingsHeader: {
    marginBottom: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  bottomPadding: {
    height: 40,
  },
});