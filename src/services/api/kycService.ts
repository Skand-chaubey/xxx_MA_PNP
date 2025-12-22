import { apiClient } from './client';
import { KYCData, ApiResponse } from '@/types';

export interface SubmitKYCDocumentRequest {
  documentType: 'aadhaar' | 'pan' | 'electricity_bill' | 'gst' | 'society_registration';
  documentImageUri: string;
  extractedData?: {
    aadhaarNumber?: string;
    panNumber?: string;
    name?: string;
    consumerNumber?: string;
    discomName?: string;
  };
}

export interface SubmitLivenessRequest {
  livenessImageUri: string;
  documentType: 'aadhaar' | 'pan';
}

class KYCService {
  async submitDocument(data: SubmitKYCDocumentRequest): Promise<ApiResponse<KYCData>> {
    return apiClient.post('/kyc/documents', data);
  }

  async submitLivenessCheck(data: SubmitLivenessRequest): Promise<ApiResponse<KYCData>> {
    return apiClient.post('/kyc/liveness', data);
  }

  async getKYCStatus(): Promise<ApiResponse<KYCData>> {
    return apiClient.get('/kyc/status');
  }

  async submitBusinessDocument(
    documentType: 'gst' | 'society_registration',
    documentImageUri: string
  ): Promise<ApiResponse<KYCData>> {
    return apiClient.post('/kyc/business', {
      documentType,
      documentImageUri,
    });
  }
}

export const kycService = new KYCService();

