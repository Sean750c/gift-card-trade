import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ChevronRight, Wallet, TrendingUp, CirclePlus as PlusCircle } from 'lucide-react-native';
import RateCard from '@/components/RateCard';
import QuickActionButton from '@/components/QuickActionButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatCurrency } = useCurrencyFormat();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [recentCards, setRecentCards] = useState([]);
  const [popularCards, setPopularCards] = useState([
    { id: '1', type: 'Amazon', rate: 0.8, trend: 'up', icon: 'amazon' },
    { id: '2', type: 'iTunes', rate: 0.75, trend: 'down', icon: 'itunes' },
    { id: '3', type: 'Steam', rate: 0.82, trend: 'up', icon: 'steam' },
    { id: '4', type: 'Google Play', rate: 0.78, trend: 'stable', icon: 'google-play' },
  ]);

  useEffect(() => {
    // Mock data loading
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // This would fetch data from an API in a real app
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
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.fullName || 'User'}
          </Text>
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

        <View style={styles.recentTransactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {recentCards.length > 0 ? (
            <View>
              {/* Transactions would be listed here */}
            </View>
          ) : (
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.card }]}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                style={styles.emptyStateImage}
                resizeMode="contain"
              />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Transactions Yet</Text>
              <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
                Start trading gift cards to see your transactions here
              </Text>
              <TouchableOpacity 
                style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                onPress={navigateToTrade}
              >
                <Text style={styles.emptyStateButtonText}>Start Trading</Text>
              </TouchableOpacity>
            </View>
          )}
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
  greeting: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
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
  recentTransactionsContainer: {
    marginBottom: 24,
  },
  emptyStateContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateImage: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    marginBottom: 16,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
  },
  bottomPadding: {
    height: 24,
  },
});