import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

// Import custom icons for gift cards
import { AmazonIcon, ItunesIcon, SteamIcon, GooglePlayIcon } from '@/components/icons/GiftCardIcons';

type RateCardProps = {
  cardType: string;
  rate: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
};

export default function RateCard({ cardType, rate, trend, icon }: RateCardProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (icon) {
      case 'amazon':
        return <AmazonIcon size={32} />;
      case 'itunes':
        return <ItunesIcon size={32} />;
      case 'steam':
        return <SteamIcon size={32} />;
      case 'google-play':
        return <GooglePlayIcon size={32} />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={colors.success} />;
      case 'down':
        return <TrendingDown size={16} color={colors.error} />;
      case 'stable':
        return <Minus size={16} color={colors.warning} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={[styles.cardType, { color: colors.text }]}>{cardType}</Text>
      <View style={styles.rateContainer}>
        <Text style={[styles.rate, { color: colors.text }]}>₦{(rate * 100).toFixed(0)}%</Text>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardType: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 8,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rate: {
    fontSize: 16,
    fontFamily: 'WorkSans-Bold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});