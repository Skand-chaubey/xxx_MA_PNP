import { create } from 'zustand';
import { Meter, EnergyData } from '@/types';

interface MeterState {
  meters: Meter[];
  currentMeter: Meter | null;
  energyData: EnergyData[];
  setMeters: (meters: Meter[]) => void;
  setCurrentMeter: (meter: Meter | null) => void;
  addEnergyData: (data: EnergyData[]) => void;
  clearEnergyData: () => void;
}

export const useMeterStore = create<MeterState>((set) => ({
  meters: [],
  currentMeter: null,
  energyData: [],

  setMeters: (meters) => set({ meters }),

  setCurrentMeter: (currentMeter) => set({ currentMeter }),

  addEnergyData: (data) =>
    set((state) => ({
      energyData: [...state.energyData, ...data].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      ),
    })),

  clearEnergyData: () => set({ energyData: [] }),
}));

