import { apiClient } from './client';
import { Meter, EnergyData, ApiResponse } from '@/types';

export interface RegisterMeterRequest {
  discomName: string;
  consumerNumber: string;
  meterSerialId: string;
  billImageUri: string;
}

export interface MeterVerificationResponse {
  meter: Meter;
  verified: boolean;
}

class MeterService {
  async registerMeter(data: RegisterMeterRequest): Promise<ApiResponse<Meter>> {
    return apiClient.post('/meters/register', data);
  }

  async verifyMeter(meterId: string): Promise<ApiResponse<MeterVerificationResponse>> {
    return apiClient.post(`/meters/${meterId}/verify`, {});
  }

  async getMeterData(
    meterId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<EnergyData[]>> {
    return apiClient.get(
      `/meters/${meterId}/data?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
  }

  async getLatestMeterData(meterId: string): Promise<ApiResponse<EnergyData>> {
    return apiClient.get(`/meters/${meterId}/data/latest`);
  }

  async requestHardwareInstallation(data: {
    address: string;
    loadCapacity: number;
  }): Promise<ApiResponse<{ requestId: string }>> {
    return apiClient.post('/meters/request-installation', data);
  }
}

export const meterService = new MeterService();

