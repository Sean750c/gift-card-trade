import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useCountry } from '@/hooks/useCountry';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown, X } from 'lucide-react-native';
import { Country } from '@/services/api';

export default function CountrySelector() {
  const { colors } = useTheme();
  const { countries, selectedCountry, setSelectedCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        { 
          backgroundColor: selectedCountry?.id === item.id ? colors.primaryLight : 'transparent'
        }
      ]}
      onPress={() => {
        setSelectedCountry(item);
        setIsOpen(false);
      }}
    >
      <Text style={styles.flag}>{item.national_flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.currencyInfo, { color: colors.textSecondary }]}>
          {item.currency_symbol} {item.currency_name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card }]}
        onPress={() => setIsOpen(true)}
      >
        {selectedCountry ? (
          <>
            <Text style={styles.flag}>{selectedCountry.national_flag}</Text>
            <Text style={[styles.selectedText, { color: colors.text }]}>
              {selectedCountry.name}
            </Text>
          </>
        ) : (
          <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
            Select Country
          </Text>
        )}
        <ChevronDown size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={countries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    marginRight: 4,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Bold',
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 4,
  },
  currencyInfo: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
});