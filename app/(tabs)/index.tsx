import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';
import { useAuth } from '@/hooks/useAuth';
import { useCountry } from '@/hooks/useCountry';
import { Bell, ChevronRight, Wallet, TrendingUp, CirclePlus as PlusCircle } from 'lucide-react-native';
import RateCard from '@/components/RateCard';
import QuickActionButton from '@/components/QuickActionButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatCurrency } = useCurrencyFormat();
  const { user } = useAuth();
  const { selectedCountry } = useCountry();
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [popularCards, setPopularCards] = useState([
    { id: '1', type: 'Amazon', rate: 0.8, trend: 'up', icon: 'amazon' },
    { id: '2', type: 'iTunes', rate: 0.75, trend: 'down', icon: 'itunes' },
    { id: '3', type: 'Steam', rate: 0.82, trend: 'up', icon: 'steam' },
    { id: '4', type: 'Google Play', rate: 0.78, trend: 'stable', icon: 'google-play' },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setBalance(25000);
    setPendingTransactions(2);
    setCompletedTransactions(15);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const navigateToTrade = () => {
    router.push('/(tabs)/trade');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <View style={styles.nameContainer}>
            {selectedCountry?.image ? (
              <Image 
                source={{ uri: selectedCountry.image }} 
                style={styles.flagImage} 
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.flag}>
                {selectedCountry?.national_flag || '🇳🇬'}
              </Text>
            )}
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.fullName || 'User'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.card }]}>
          <Bell size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.balanceContainer}>
          <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <Wallet size={24} color="white" />
            </View>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            <View style={styles.balanceFooter}>
              <View style={styles.balanceStatItem}>
                <Text style={styles.balanceStatValue}>{pendingTransactions}</Text>
                <Text style={styles.balanceStatLabel}>Pending</Text>
              </View>
              <View style={styles.balanceStatDivider} />
              <View style={styles.balanceStatItem}>
                <Text style={styles.balanceStatValue}>{completedTransactions}</Text>
                <Text style={styles.balanceStatLabel}>Completed</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton 
              icon={<PlusCircle size={24} color={colors.primary} />}
              title="Sell Gift Card"
              onPress={navigateToTrade}
              backgroundColor={colors.card}
              textColor={colors.text}
            />
            <QuickActionButton 
              icon={<TrendingUp size={24} color={colors.primary} />}
              title="Check Rates"
              onPress={() => {}}
              backgroundColor={colors.card}
              textColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.ratesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Rates</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ratesScroll}
          >
            {popularCards.map((card) => (
              <RateCard 
                key={card.id}
                cardType={card.type}
                rate={card.rate}
                trend={card.trend as 'up' | 'down' | 'stable'}
                icon={card.icon}
              />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  flagImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'WorkSans-Bold',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 16,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  balanceStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceStatValue: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'WorkSans-Bold',
  },
  balanceStatLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  balanceStatDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    marginRight: 4,
  },
  ratesContainer: {
    marginBottom: 24,
  },
  ratesScroll: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  bottomPadding: {
    height: 24,
  },
});