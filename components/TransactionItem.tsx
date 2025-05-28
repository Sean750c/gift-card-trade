import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';
import { formatDistanceToNow } from 'date-fns';

// Import custom icons for gift cards
import { AmazonIcon, ItunesIcon, SteamIcon, GooglePlayIcon } from '@/components/icons/GiftCardIcons';

type TransactionItemProps = {
  id: string;
  type: string;
  amount: number;
  exchangeRate: number;
  status: string;
  date: Date;
};

export default function TransactionItem({
  id,
  type,
  amount,
  exchangeRate,
  status,
  date,
}: TransactionItemProps) {
  const { colors } = useTheme();
  const { formatCurrency } = useCurrencyFormat();

  const getIcon = () => {
    switch (type) {
      case 'amazon':
        return <AmazonIcon size={24} />;
      case 'itunes':
        return <ItunesIcon size={24} />;
      case 'steam':
        return <SteamIcon size={24} />;
      case 'google':
        return <GooglePlayIcon size={24} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formattedDate = formatDistanceToNow(date, { addSuffix: true });

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardAlt }]}>
          {getIcon()}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.cardType, { color: colors.text }]}>
            {capitalizeFirstLetter(type)} Card
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatCurrency(amount * exchangeRate)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {capitalizeFirstLetter(status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    justifyContent: 'center',
  },
  cardType: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'WorkSans-Regular',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
  },
});