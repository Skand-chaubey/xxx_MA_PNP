import { create } from 'zustand';
import { KYCData, KYCStatus } from '@/types';
import { supabaseDatabaseService } from '@/services/supabase/databaseService';

// Document status type for individual documents
export type DocumentStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

// KYC Document type mapping
export type KYCDocumentType = 'aadhaar' | 'pan' | 'electricity_bill' | 'gst' | 'society_registration';

// Per-document status interface
export interface DocumentStatusMap {
  aadhaar: DocumentStatus;
  pan: DocumentStatus;
  electricity_bill: DocumentStatus;
  gst: DocumentStatus;
  society_registration: DocumentStatus;
}

// Extended KYC document with extracted data
export interface KYCDocument extends KYCData {
  id?: string;
}

// Required documents for KYC verification
export const REQUIRED_KYC_DOCS: KYCDocumentType[] = ['aadhaar', 'pan', 'electricity_bill'];

interface KYCState {
  // Per-document data
  documents: Record<KYCDocumentType, KYCDocument | null>;
  documentStatuses: DocumentStatusMap;
  
  // Overall status
  overallStatus: KYCStatus;
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  
  // Last sync timestamp
  lastSyncedAt: number | null;
  
  // Actions
  fetchKYCDocuments: (userId: string) => Promise<void>;
  syncFromBackend: (userId: string) => Promise<{ status: KYCStatus; documents: Record<KYCDocumentType, KYCDocument | null> }>;
  submitDocument: (userId: string, documentType: KYCDocumentType, data: Partial<KYCDocument>) => Promise<void>;
  getDocumentStatus: (documentType: KYCDocumentType) => DocumentStatus;
  getDocument: (documentType: KYCDocumentType) => KYCDocument | null;
  calculateOverallStatus: () => KYCStatus;
  isVerified: () => boolean;
  canUploadDocument: (documentType: KYCDocumentType) => boolean;
  canUseOCR: (documentType: KYCDocumentType) => boolean;
  resetKYC: () => void;
}

const initialDocumentStatuses: DocumentStatusMap = {
  aadhaar: 'not_started',
  pan: 'not_started',
  electricity_bill: 'not_started',
  gst: 'not_started',
  society_registration: 'not_started',
};

const initialDocuments: Record<KYCDocumentType, KYCDocument | null> = {
  aadhaar: null,
  pan: null,
  electricity_bill: null,
  gst: null,
  society_registration: null,
};

export const useKYCStore = create<KYCState>((set, get) => ({
  documents: { ...initialDocuments },
  documentStatuses: { ...initialDocumentStatuses },
  overallStatus: 'pending',
  isLoading: false,
  isSubmitting: false,
  lastSyncedAt: null,

  /**
   * Fetch KYC documents from backend and update local state
   * This is the SINGLE SOURCE OF TRUTH
   */
  fetchKYCDocuments: async (userId: string) => {
    set({ isLoading: true });
    try {
      console.log('[KYCStore] Fetching KYC documents from backend for user:', userId);
      const kycDocs = await supabaseDatabaseService.getKYCDocuments(userId);
      console.log('[KYCStore] Fetched', kycDocs.length, 'KYC documents from backend');
      
      const newDocuments: Record<KYCDocumentType, KYCDocument | null> = { ...initialDocuments };
      const newStatuses: DocumentStatusMap = { ...initialDocumentStatuses };
      
      // Map fetched documents to state
      kycDocs.forEach((doc) => {
        const docType = doc.documentType as KYCDocumentType;
        if (docType in newDocuments) {
          newDocuments[docType] = doc;
          newStatuses[docType] = doc.status as DocumentStatus;
          console.log(`[KYCStore] Document ${docType}: status = ${doc.status}`);
        }
      });
      
      set({
        documents: newDocuments,
        documentStatuses: newStatuses,
        isLoading: false,
        lastSyncedAt: Date.now(),
      });
      
      // Calculate overall status
      const overallStatus = get().calculateOverallStatus();
      console.log('[KYCStore] Overall KYC status calculated:', overallStatus);
      set({ overallStatus });
    } catch (error) {
      console.error('[KYCStore] Error fetching KYC documents:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Sync KYC state from backend - used on login
   * Returns the synced status and documents
   */
  syncFromBackend: async (userId: string) => {
    console.log('[KYCStore] Syncing KYC from backend for user:', userId);
    
    try {
      const kycDocs = await supabaseDatabaseService.getKYCDocuments(userId);
      console.log('[KYCStore] Sync: fetched', kycDocs.length, 'documents');
      
      const newDocuments: Record<KYCDocumentType, KYCDocument | null> = { ...initialDocuments };
      const newStatuses: DocumentStatusMap = { ...initialDocumentStatuses };
      
      // Map fetched documents to state
      kycDocs.forEach((doc) => {
        const docType = doc.documentType as KYCDocumentType;
        if (docType in newDocuments) {
          newDocuments[docType] = doc;
          newStatuses[docType] = doc.status as DocumentStatus;
        }
      });
      
      set({
        documents: newDocuments,
        documentStatuses: newStatuses,
        lastSyncedAt: Date.now(),
      });
      
      // Calculate overall status
      const overallStatus = get().calculateOverallStatus();
      set({ overallStatus });
      
      console.log('[KYCStore] Sync complete. Status:', overallStatus);
      
      return {
        status: overallStatus,
        documents: newDocuments,
      };
    } catch (error) {
      console.error('[KYCStore] Sync error:', error);
      throw error;
    }
  },

  /**
   * Submit a KYC document
   */
  submitDocument: async (userId: string, documentType: KYCDocumentType, data: Partial<KYCDocument>) => {
    // Check if document can be uploaded
    const canUpload = get().canUploadDocument(documentType);
    if (!canUpload) {
      throw new Error(`Cannot upload ${documentType}: document is either pending or already verified`);
    }
    
    set({ isSubmitting: true });
    try {
      console.log('[KYCStore] Submitting document:', documentType);
      
      const submitted = await supabaseDatabaseService.submitKYCDocument(
        userId,
        documentType,
        {
          documentNumber: data.documentNumber,
          name: data.name,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          fileUrl: data.fileUrl,
        }
      );
      
      console.log('[KYCStore] Document submitted, status:', submitted.status);
      
      // Update local state
      set((state) => ({
        documents: {
          ...state.documents,
          [documentType]: submitted,
        },
        documentStatuses: {
          ...state.documentStatuses,
          [documentType]: 'pending' as DocumentStatus,
        },
        isSubmitting: false,
        lastSyncedAt: Date.now(),
      }));
      
      // Recalculate overall status
      const overallStatus = get().calculateOverallStatus();
      set({ overallStatus });
    } catch (error) {
      console.error('[KYCStore] Error submitting KYC document:', error);
      set({ isSubmitting: false });
      throw error;
    }
  },

  getDocumentStatus: (documentType: KYCDocumentType) => {
    return get().documentStatuses[documentType];
  },

  getDocument: (documentType: KYCDocumentType) => {
    return get().documents[documentType];
  },

  /**
   * Calculate overall KYC status based on required documents
   * Logic:
   * - VERIFIED: All required docs are verified
   * - REJECTED: Any required doc is rejected
   * - PENDING: Any required doc is pending (and none rejected)
   * - INCOMPLETE (pending): Missing required docs
   */
  calculateOverallStatus: (): KYCStatus => {
    const { documentStatuses } = get();
    
    // Check if all required docs are verified
    const allVerified = REQUIRED_KYC_DOCS.every((doc) => documentStatuses[doc] === 'verified');
    if (allVerified) {
      console.log('[KYCStore] All required docs verified');
      return 'verified';
    }
    
    // Check if any required doc is rejected
    const anyRejected = REQUIRED_KYC_DOCS.some((doc) => documentStatuses[doc] === 'rejected');
    if (anyRejected) {
      console.log('[KYCStore] Some docs rejected');
      return 'rejected';
    }
    
    // Check if any required doc is pending
    const anyPending = REQUIRED_KYC_DOCS.some((doc) => documentStatuses[doc] === 'pending');
    if (anyPending) {
      console.log('[KYCStore] Some docs pending review');
      return 'pending';
    }
    
    // Missing docs - return pending (incomplete)
    console.log('[KYCStore] KYC incomplete - missing required docs');
    return 'pending';
  },

  isVerified: () => get().overallStatus === 'verified',

  /**
   * Check if a document can be uploaded
   * Returns TRUE for: not_started, rejected
   * Returns FALSE for: pending, verified
   */
  canUploadDocument: (documentType: KYCDocumentType): boolean => {
    const status = get().documentStatuses[documentType];
    const canUpload = status === 'not_started' || status === 'rejected';
    console.log(`[KYCStore] canUploadDocument(${documentType}): status=${status}, canUpload=${canUpload}`);
    return canUpload;
  },

  /**
   * Check if OCR can be used for a document
   * OCR is ONLY allowed for: not_started, rejected
   * OCR is DISABLED for: pending, verified
   */
  canUseOCR: (documentType: KYCDocumentType): boolean => {
    const status = get().documentStatuses[documentType];
    const canUse = status === 'not_started' || status === 'rejected';
    console.log(`[KYCStore] canUseOCR(${documentType}): status=${status}, canUse=${canUse}`);
    return canUse;
  },

  /**
   * Reset KYC state - called on logout
   */
  resetKYC: () => {
    console.log('[KYCStore] Resetting KYC state');
    set({
      documents: { ...initialDocuments },
      documentStatuses: { ...initialDocumentStatuses },
      overallStatus: 'pending',
      isLoading: false,
      isSubmitting: false,
      lastSyncedAt: null,
    });
  },
}));

