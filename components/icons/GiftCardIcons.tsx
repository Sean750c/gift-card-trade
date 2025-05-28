import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
};

// For a real app, you would use proper SVG icons
// These are simplified placeholder icons

export function AmazonIcon({ size = 24, color = '#FF9900' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>A</Text>
    </View>
  );
}

export function ItunesIcon({ size = 24, color = '#EA4CC0' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>i</Text>
    </View>
  );
}

export function SteamIcon({ size = 24, color = '#1B2838' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>S</Text>
    </View>
  );
}

export function GooglePlayIcon({ size = 24, color = '#4285F4' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>G</Text>
    </View>
  );
}

export function XboxIcon({ size = 24, color = '#107C10' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>X</Text>
    </View>
  );
}

export function PlayStationIcon({ size = 24, color = '#003791' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>P</Text>
    </View>
  );
}

export function NetflixIcon({ size = 24, color = '#E50914' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>N</Text>
    </View>
  );
}

export function OtherCardIcon({ size = 24, color = '#6C757D' }: IconProps) {
  return (
    <View style={[styles.iconContainer, { width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.iconText}>?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  iconText: {
    color: 'white',
    fontFamily: 'WorkSans-Bold',
    fontSize: 14,
  },
});