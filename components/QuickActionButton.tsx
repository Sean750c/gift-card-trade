import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type QuickActionButtonProps = {
  icon: ReactNode;
  title: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

export default function QuickActionButton({
  icon,
  title,
  onPress,
  backgroundColor,
  textColor,
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
  },
});