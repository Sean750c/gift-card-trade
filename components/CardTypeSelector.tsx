import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// Import custom icons for gift cards
import { AmazonIcon, ItunesIcon, SteamIcon, GooglePlayIcon, XboxIcon, PlayStationIcon, NetflixIcon, OtherCardIcon } from '@/components/icons/GiftCardIcons';

type CardTypeSelectorProps = {
  id: string;
  name: string;
  logo: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export default function CardTypeSelector({
  id,
  name,
  logo,
  isSelected,
  onSelect,
}: CardTypeSelectorProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (logo) {
      case 'amazon':
        return <AmazonIcon size={24} />;
      case 'itunes':
        return <ItunesIcon size={24} />;
      case 'steam':
        return <SteamIcon size={24} />;
      case 'google-play':
        return <GooglePlayIcon size={24} />;
      case 'xbox':
        return <XboxIcon size={24} />;
      case 'playstation':
        return <PlayStationIcon size={24} />;
      case 'netflix':
        return <NetflixIcon size={24} />;
      case 'other':
        return <OtherCardIcon size={24} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : 'transparent',
        },
      ]}
      onPress={() => onSelect(id)}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
  },
});