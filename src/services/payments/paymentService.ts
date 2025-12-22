import { ApiResponse } from '@/types';

export interface TopUpRequest {
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking';
}

export interface TopUpResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  upiIntent?: string; // For UPI payments
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountId: string;
}

class PaymentService {
  /**
   * Initiate wallet top-up
   */
  async initiateTopUp(data: TopUpRequest): Promise<ApiResponse<TopUpResponse>> {
    // TODO: Implement with Razorpay/PhonePe SDK
    // This is a placeholder structure
    throw new Error('Payment service not yet implemented');
  }

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId: string): Promise<ApiResponse<{ status: string }>> {
    // TODO: Implement payment verification
    throw new Error('Payment verification not yet implemented');
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(
    data: WithdrawalRequest
  ): Promise<ApiResponse<{ requestId: string }>> {
    // TODO: Implement withdrawal request
    throw new Error('Withdrawal service not yet implemented');
  }

  /**
   * Get withdrawal status
   */
  async getWithdrawalStatus(
    requestId: string
  ): Promise<ApiResponse<{ status: string; amount: number }>> {
    // TODO: Implement withdrawal status check
    throw new Error('Withdrawal status check not yet implemented');
  }

  /**
   * Open UPI payment app
   */
  async openUPIApp(upiIntent: string): Promise<boolean> {
    // TODO: Implement UPI intent opening
    // This would use Linking.openURL() with UPI deep link
    // Example: upi://pay?pa=merchant@upi&pn=Merchant&am=100&cu=INR
    return false;
  }
}

export const paymentService = new PaymentService();

