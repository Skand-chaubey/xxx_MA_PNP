import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useWalletStore } from '@/store';
import { formatCurrency, formatEnergy, getTimeAgo } from '@/utils/helpers';
import { Transaction } from '@/types';

type WalletScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Wallet'>;

interface Props {
  navigation: WalletScreenNavigationProp;
}

export default function WalletScreen({ navigation }: Props) {
  const { wallet, transactions } = useWalletStore();

  const handleTopUp = () => {
    navigation.navigate('TopUp');
  };

  const handleWithdraw = () => {
    navigation.navigate('Withdraw');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'energy_sale':
        return <MaterialCommunityIcons name="lightning-bolt" size={24} color="#10b981" />;
      case 'energy_purchase':
        return <MaterialCommunityIcons name="flash" size={24} color="#3b82f6" />;
      case 'topup':
        return <MaterialCommunityIcons name="plus-circle" size={24} color="#10b981" />;
      case 'withdrawal':
        return <MaterialCommunityIcons name="minus-circle" size={24} color="#ef4444" />;
      default:
        return <Ionicons name="swap-horizontal" size={24} color="#6b7280" />;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isPositive = item.type === 'energy_sale' || item.type === 'topup';
    const amountPrefix = isPositive ? '+' : '-';
    const amountColor = isPositive ? '#10b981' : '#ef4444';

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          {getTransactionIcon(item.type || '')}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {item.type ? item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Transaction'}
          </Text>
          <Text style={styles.transactionTime}>
            {item.createdAt ? getTimeAgo(item.createdAt) : 'Unknown time'}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {amountPrefix}
          {item.currency === 'INR' ? formatCurrency(item.amount || 0) : formatEnergy(item.amount || 0)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Wallet</Text>
            <Text style={styles.headerSubtitle}>Manage your energy & cash balance</Text>
          </View>
          <MaterialCommunityIcons name="wallet" size={32} color="#ffffff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Dual Balance Cards */}
          {wallet ? (
            <View style={styles.balanceContainer}>
              {/* Energy Balance Card */}
              <View style={styles.balanceCard}>
                <LinearGradient
                  colors={['#ecfdf5', '#d1fae5']}
                  style={styles.balanceCardGradient}
                >
                  <View style={styles.balanceCardHeader}>
                    <View style={[styles.balanceIconContainer, { backgroundColor: '#10b981' }]}>
                      <MaterialCommunityIcons name="lightning-bolt" size={28} color="#ffffff" />
                    </View>
                    <Text style={styles.balanceLabel}>Energy Balance</Text>
                  </View>
                  <Text style={styles.balanceValue}>
                    {formatEnergy(wallet.energyBalance, 'kWh')}
                  </Text>
                  <Text style={styles.balanceSubtext}>Available to sell</Text>
                </LinearGradient>
              </View>

              {/* Cash Balance Card */}
              <View style={styles.balanceCard}>
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  style={styles.balanceCardGradient}
                >
                  <View style={styles.balanceCardHeader}>
                    <View style={[styles.balanceIconContainer, { backgroundColor: '#f59e0b' }]}>
                      <MaterialCommunityIcons name="currency-inr" size={28} color="#ffffff" />
                    </View>
                    <Text style={styles.balanceLabel}>Cash Balance</Text>
                  </View>
                  <Text style={styles.balanceValue}>{formatCurrency(wallet.cashBalance)}</Text>
                  <Text style={styles.balanceSubtext}>Ready to withdraw</Text>
                </LinearGradient>
              </View>
            </View>
          ) : (
            <View style={styles.emptyBalance}>
              <MaterialCommunityIcons name="wallet-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No wallet data available</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleTopUp} activeOpacity={0.8}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="add-circle" size={24} color="#ffffff" />
                <Text style={styles.actionButtonText}>Top Up</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={handleWithdraw}
              activeOpacity={0.8}
            >
              <View style={styles.withdrawButtonContent}>
                <Ionicons name="cash-outline" size={24} color="#10b981" />
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Transaction History */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {transactions.length > 0 && (
              <Text style={styles.sectionCount}>{transactions.length} transactions</Text>
            )}
          </View>
          {transactions.length > 0 ? (
            <View style={styles.transactionsContainer}>
              <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.transactionSeparator} />}
              />
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <MaterialCommunityIcons name="history" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  gradientHeader: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d1fae5',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceCardGradient: {
    padding: 20,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyBalance: {
    padding: 48,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  withdrawButtonContent: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 76,
  },
  emptyTransactions: {
    padding: 48,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
