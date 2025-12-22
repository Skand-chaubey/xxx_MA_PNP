import { TradingBotConfig } from '@/types';
import { EnergyData } from '@/types';
import { tradingService } from '@/services/api/tradingService';
import { useMeterStore } from '@/store';

interface TradingDecision {
  shouldSell: boolean;
  energyAmount: number;
  targetPrice: number;
  priority: 'neighbors' | 'grid' | 'both';
}

class TradingBotEngine {
  /**
   * Evaluate if energy should be sold based on bot configuration
   */
  evaluateTradingDecision(
    config: TradingBotConfig,
    currentEnergyData: EnergyData,
    batteryLevel: number, // percentage
    marketPrice: number,
    availableBuyers: Array<{ id: string; price: number; maxEnergy: number }>
  ): TradingDecision | null {
    // Check if bot is enabled
    if (!config.enabled) {
      return null;
    }

    // Check if battery level is above reserve
    const availableEnergy = currentEnergyData.generation - currentEnergyData.consumption;
    if (availableEnergy <= 0) {
      return null; // No excess energy to sell
    }

    // Check battery reserve
    if (batteryLevel < config.reservePower) {
      return null; // Battery below reserve level
    }

    // Check minimum price
    if (marketPrice < config.minSellPrice) {
      return null; // Price too low
    }

    // Determine energy amount to sell
    const sellableEnergy = Math.min(
      availableEnergy,
      batteryLevel > config.reservePower
        ? (batteryLevel - config.reservePower) / 100 * 10 // Assume 10kWh battery capacity
        : availableEnergy
    );

    if (sellableEnergy <= 0) {
      return null;
    }

    // Find best buyer based on priority
    let targetBuyer = null;
    if (config.priority === 'neighbors' || config.priority === 'both') {
      // Prefer neighbors (local buyers)
      targetBuyer = availableBuyers
        .filter((b) => b.price >= config.minSellPrice)
        .sort((a, b) => b.price - a.price)[0];
    }

    if (!targetBuyer && (config.priority === 'grid' || config.priority === 'both')) {
      // Fallback to grid
      targetBuyer = {
        id: 'grid',
        price: marketPrice,
        maxEnergy: sellableEnergy,
      };
    }

    if (!targetBuyer || targetBuyer.price < config.minSellPrice) {
      return null;
    }

    return {
      shouldSell: true,
      energyAmount: Math.min(sellableEnergy, targetBuyer.maxEnergy),
      targetPrice: targetBuyer.price,
      priority: config.priority,
    };
  }

  /**
   * Execute trading decision
   */
  async executeTrade(decision: TradingDecision, sellerId: string): Promise<boolean> {
    try {
      // TODO: Implement actual trade execution
      // const response = await tradingService.createOrder({
      //   sellerId,
      //   energyAmount: decision.energyAmount,
      //   pricePerUnit: decision.targetPrice,
      // });
      // return response.success;

      // Mock implementation
      console.log('Trading bot executing trade:', decision);
      return true;
    } catch (error) {
      console.error('Trading bot execution failed:', error);
      return false;
    }
  }

  /**
   * Monitor and execute trades based on configuration
   */
  async monitorAndTrade(
    config: TradingBotConfig,
    currentEnergyData: EnergyData,
    batteryLevel: number,
    marketPrice: number,
    availableBuyers: Array<{ id: string; price: number; maxEnergy: number }>
  ): Promise<void> {
    const decision = this.evaluateTradingDecision(
      config,
      currentEnergyData,
      batteryLevel,
      marketPrice,
      availableBuyers
    );

    if (decision && decision.shouldSell) {
      await this.executeTrade(decision, config.userId);
    }
  }
}

export const tradingBotEngine = new TradingBotEngine();

