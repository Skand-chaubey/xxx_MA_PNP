import { create } from 'zustand';
import { KYCData, KYCStatus } from '@/types';

interface KYCState {
  kycData: KYCData | null;
  status: KYCStatus;
  setKYCData: (data: KYCData) => void;
  setStatus: (status: KYCStatus) => void;
  isVerified: () => boolean;
}

export const useKYCStore = create<KYCState>((set, get) => ({
  kycData: null,
  status: 'pending',

  setKYCData: (kycData) =>
    set({
      kycData,
      status: kycData.status,
    }),

  setStatus: (status) =>
    set((state) => ({
      status,
      kycData: state.kycData ? { ...state.kycData, status } : null,
    })),

  isVerified: () => get().status === 'verified',
}));

