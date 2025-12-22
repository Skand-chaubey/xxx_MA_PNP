import { create } from 'zustand';
import { Wallet, Transaction } from '@/types';

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  setWallet: (wallet: Wallet) => void;
  updateBalance: (energyDelta?: number, cashDelta?: number) => void;
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  transactions: [],

  setWallet: (wallet) => set({ wallet }),

  updateBalance: (energyDelta, cashDelta) =>
    set((state) => {
      if (!state.wallet) return state;
      return {
        wallet: {
          ...state.wallet,
          energyBalance: state.wallet.energyBalance + (energyDelta || 0),
          cashBalance: state.wallet.cashBalance + (cashDelta || 0),
          updatedAt: new Date(),
        },
      };
    }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  setTransactions: (transactions) => set({ transactions }),
}));

