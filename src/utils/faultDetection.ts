import { EnergyData } from '@/types';

interface FaultAlert {
  type: 'zero_generation' | 'low_generation' | 'disconnection';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
}

class FaultDetectionService {
  /**
   * Check for zero generation during peak sun hours
   */
  detectZeroGeneration(energyData: EnergyData[]): FaultAlert | null {
    if (!energyData.length) return null;

    const now = new Date();
    const currentHour = now.getHours();
    
    // Peak sun hours: 10 AM to 4 PM
    const isPeakSunHours = currentHour >= 10 && currentHour <= 16;

    if (!isPeakSunHours) return null;

    // Check last 4 data points (1 hour of 15-min intervals)
    const recentData = energyData.slice(0, 4);
    const allZero = recentData.every((data) => data.generation === 0);

    if (allZero) {
      return {
        type: 'zero_generation',
        severity: 'high',
        message: 'Zero generation detected during peak sun hours. Please check your solar panels.',
        timestamp: now,
      };
    }

    return null;
  }

  /**
   * Check for low generation (below expected threshold)
   */
  detectLowGeneration(
    energyData: EnergyData[],
    expectedGeneration: number
  ): FaultAlert | null {
    if (!energyData.length) return null;

    const recentData = energyData.slice(0, 4);
    const averageGeneration =
      recentData.reduce((sum, data) => sum + data.generation, 0) / recentData.length;

    // If generation is less than 50% of expected
    if (averageGeneration < expectedGeneration * 0.5 && averageGeneration > 0) {
      return {
        type: 'low_generation',
        severity: 'medium',
        message: `Low generation detected. Expected: ${expectedGeneration}kW, Actual: ${averageGeneration.toFixed(2)}kW`,
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Check for device disconnection (no data for extended period)
   */
  detectDisconnection(energyData: EnergyData[]): FaultAlert | null {
    if (!energyData.length) return null;

    const latestData = energyData[0];
    const timeSinceLastData = Date.now() - latestData.timestamp.getTime();
    const oneHour = 60 * 60 * 1000;

    // If no data for more than 1 hour
    if (timeSinceLastData > oneHour) {
      return {
        type: 'disconnection',
        severity: 'high',
        message: 'No data received for over 1 hour. Please check device connectivity.',
        timestamp: new Date(),
      };
    }

    return null;
  }

  /**
   * Run all fault detection checks
   */
  runFaultChecks(
    energyData: EnergyData[],
    expectedGeneration?: number
  ): FaultAlert[] {
    const alerts: FaultAlert[] = [];

    const zeroGenAlert = this.detectZeroGeneration(energyData);
    if (zeroGenAlert) alerts.push(zeroGenAlert);

    if (expectedGeneration) {
      const lowGenAlert = this.detectLowGeneration(energyData, expectedGeneration);
      if (lowGenAlert) alerts.push(lowGenAlert);
    }

    const disconnectionAlert = this.detectDisconnection(energyData);
    if (disconnectionAlert) alerts.push(disconnectionAlert);

    return alerts;
  }
}

export const faultDetectionService = new FaultDetectionService();

