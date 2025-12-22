import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TradingBotConfig } from '@/types';
import { MIN_SELL_PRICE, MAX_SELL_PRICE, DEFAULT_RESERVE_POWER } from '@/utils/constants';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

type TradingBotScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TradingBot'
>;

interface Props {
  navigation: TradingBotScreenNavigationProp;
  config?: TradingBotConfig;
  onSave?: (config: TradingBotConfig) => void;
}

export default function TradingBotScreen({ navigation, config, onSave }: Props) {
  const [enabled, setEnabled] = useState(config?.enabled || false);
  const [reservePower, setReservePower] = useState(
    config?.reservePower || DEFAULT_RESERVE_POWER
  );
  const [minSellPrice, setMinSellPrice] = useState(
    config?.minSellPrice || MIN_SELL_PRICE
  );
  const [priority, setPriority] = useState<'neighbors' | 'grid' | 'both'>(
    config?.priority || 'both'
  );

  const handleSave = () => {
    if (minSellPrice < MIN_SELL_PRICE || minSellPrice > MAX_SELL_PRICE) {
      Alert.alert('Invalid Price', `Price must be between ₹${MIN_SELL_PRICE} and ₹${MAX_SELL_PRICE}`);
      return;
    }

    if (reservePower < 0 || reservePower > 100) {
      Alert.alert('Invalid Reserve', 'Reserve power must be between 0% and 100%');
      return;
    }

    const newConfig: TradingBotConfig = {
      userId: config?.userId || 'current_user_id',
      enabled,
      reservePower,
      minSellPrice,
      priority,
      updatedAt: new Date(),
    };

    if (onSave) {
      onSave(newConfig);
    }
    Alert.alert('Success', 'Trading bot configuration saved', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Trading Bot (Auto-Pilot)</Text>
          <Text style={styles.subtitle}>
            Set and forget rules for automated energy trading
          </Text>

          {/* Enable/Disable */}
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelContainer}>
                <Text style={styles.switchLabel}>Enable Auto-Selling</Text>
                <Text style={styles.switchHint}>
                  Automatically sell excess energy based on your rules
                </Text>
              </View>
              <Switch value={enabled} onValueChange={setEnabled} />
            </View>
          </View>

          {enabled && (
            <>
              {/* Reserve Power */}
              <View style={styles.section}>
                <Text style={styles.label}>Reserve Power</Text>
                <Text style={styles.hint}>
                  Keep this percentage of battery for your home use
                </Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>{reservePower}%</Text>
                  <View style={styles.sliderTrack}>
                    <View
                      style={[
                        styles.sliderFill,
                        { width: `${reservePower}%` },
                      ]}
                    />
                    <View
                      style={[
                        styles.sliderThumb,
                        { left: `${reservePower}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>0%</Text>
                    <Text style={styles.sliderLabel}>100%</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  value={reservePower.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text, 10);
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                      setReservePower(value);
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="40"
                />
              </View>

              {/* Minimum Sell Price */}
              <View style={styles.section}>
                <Text style={styles.label}>Minimum Sell Price</Text>
                <Text style={styles.hint}>
                  Only sell if the market price is above this amount (₹/unit)
                </Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={minSellPrice.toString()}
                    onChangeText={(text) => {
                      const value = parseFloat(text);
                      if (!isNaN(value)) {
                        setMinSellPrice(value);
                      }
                    }}
                    keyboardType="decimal-pad"
                    placeholder="8.00"
                  />
                  <Text style={styles.unitText}>/unit</Text>
                </View>
              </View>

              {/* Priority */}
              <View style={styles.section}>
                <Text style={styles.label}>Selling Priority</Text>
                <Text style={styles.hint}>
                  Choose where to sell your excess energy first
                </Text>
                <View style={styles.priorityOptions}>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'neighbors' && styles.priorityOptionActive,
                    ]}
                    onPress={() => setPriority('neighbors')}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        priority === 'neighbors' && styles.priorityOptionTextActive,
                      ]}
                    >
                      Neighbors First
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'grid' && styles.priorityOptionActive,
                    ]}
                    onPress={() => setPriority('grid')}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        priority === 'grid' && styles.priorityOptionTextActive,
                      ]}
                    >
                      Grid First
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'both' && styles.priorityOptionActive,
                    ]}
                    onPress={() => setPriority('both')}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        priority === 'both' && styles.priorityOptionTextActive,
                      ]}
                    >
                      Both
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 32,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 12,
    color: '#6b7280',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    position: 'absolute',
    top: -8,
    marginLeft: -10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#6b7280',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 12,
  },
  unitText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  priorityOptionActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  priorityOptionTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

