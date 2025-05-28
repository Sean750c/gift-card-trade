import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';
import { Filter, Search } from 'lucide-react-native';
import TransactionItem from '@/components/TransactionItem';

// Mock data for transactions
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'amazon',
    amount: 100,
    exchangeRate: 0.8,
    status: 'completed',
    date: new Date(2023, 5, 15, 14, 30),
  },
  {
    id: '2',
    type: 'itunes',
    amount: 50,
    exchangeRate: 0.75,
    status: 'pending',
    date: new Date(2023, 5, 14, 9, 45),
  },
  {
    id: '3',
    type: 'steam',
    amount: 200,
    exchangeRate: 0.82,
    status: 'completed',
    date: new Date(2023, 5, 12, 18, 15),
  },
  {
    id: '4',
    type: 'google',
    amount: 75,
    exchangeRate: 0.78,
    status: 'rejected',
    date: new Date(2023, 5, 10, 11, 20),
  },
  {
    id: '5',
    type: 'amazon',
    amount: 150,
    exchangeRate: 0.8,
    status: 'completed',
    date: new Date(2023, 5, 5, 16, 10),
  },
];

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { formatCurrency } = useCurrencyFormat();
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch updated transaction data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filterTransactions = (status: string | null) => {
    setFilterStatus(status);
    if (!status) {
      setTransactions(MOCK_TRANSACTIONS);
    } else {
      setTransactions(MOCK_TRANSACTIONS.filter(tx => tx.status === status));
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.success }]}>
          <Text style={styles.statValue}>
            {formatCurrency(MOCK_TRANSACTIONS
              .filter(tx => tx.status === 'completed')
              .reduce((sum, tx) => sum + (tx.amount * tx.exchangeRate), 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
          <Text style={styles.statValue}>
            {formatCurrency(MOCK_TRANSACTIONS
              .filter(tx => tx.status === 'pending')
              .reduce((sum, tx) => sum + (tx.amount * tx.exchangeRate), 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.error }]}>
          <Text style={styles.statValue}>
            {formatCurrency(MOCK_TRANSACTIONS
              .filter(tx => tx.status === 'rejected')
              .reduce((sum, tx) => sum + (tx.amount * tx.exchangeRate), 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.textSecondary} />
        <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
          Search transactions
        </Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollableFilter 
          label="All"
          isActive={filterStatus === null}
          onPress={() => filterTransactions(null)}
          activeColor={colors.primary}
          textColor={colors.text}
          secondaryColor={colors.card}
        />
        <ScrollableFilter 
          label="Completed"
          isActive={filterStatus === 'completed'}
          onPress={() => filterTransactions('completed')}
          activeColor={colors.primary}
          textColor={colors.text}
          secondaryColor={colors.card}
        />
        <ScrollableFilter 
          label="Pending"
          isActive={filterStatus === 'pending'}
          onPress={() => filterTransactions('pending')}
          activeColor={colors.primary}
          textColor={colors.text}
          secondaryColor={colors.card}
        />
        <ScrollableFilter 
          label="Rejected"
          isActive={filterStatus === 'rejected'}
          onPress={() => filterTransactions('rejected')}
          activeColor={colors.primary}
          textColor={colors.text}
          secondaryColor={colors.card}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Transaction History</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card }]}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem
            id={item.id}
            type={item.type}
            amount={item.amount}
            exchangeRate={item.exchangeRate}
            status={item.status}
            date={item.date}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Transactions</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {filterStatus 
                ? `You don't have any ${filterStatus} transactions yet.` 
                : "You haven't made any transactions yet."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ScrollableFilter({ label, isActive, onPress, activeColor, textColor, secondaryColor }) {
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { 
          backgroundColor: isActive ? activeColor : secondaryColor,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        { color: isActive ? 'white' : textColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    textAlign: 'center',
  },
});