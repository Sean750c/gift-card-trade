import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Moon, Globe, Bell, Lock, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <Moon size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <Lock size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>Biometric Login</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={biometricEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <Lock size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>Change Password</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <HelpCircle size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingItemLeft}>
              <Info size={20} color={colors.primary} />
              <Text style={[styles.settingItemText, { color: colors.text }]}>About</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'WorkSans-Bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  languageDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLanguage: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    marginRight: 4,
  },
  languagesContainer: {
    borderRadius: 12,
    padding: 8,
    marginTop: 4,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  languageOptionText: {
    fontSize: 14,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Regular',
  },
});