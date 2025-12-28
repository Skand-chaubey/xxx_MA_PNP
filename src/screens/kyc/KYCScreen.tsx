import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useKYCStore } from '@/store';
import { KYC_DOCUMENT_TYPES } from '@/utils/constants';
import DocumentScanScreen from './DocumentScanScreen';
import LivenessCheckScreen from './LivenessCheckScreen';

type KYCScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'KYC'>;

interface Props {
  navigation: KYCScreenNavigationProp;
}

type DocumentType = (typeof KYC_DOCUMENT_TYPES)[number];

const documentConfig: Record<DocumentType, { icon: string; color: string; description: string }> = {
  aadhaar: {
    icon: 'card-account-details',
    color: '#3b82f6',
    description: 'Government issued identity card',
  },
  pan: {
    icon: 'card-account-details-outline',
    color: '#8b5cf6',
    description: 'Permanent Account Number card',
  },
  electricity_bill: {
    icon: 'file-document',
    color: '#10b981',
    description: 'Latest electricity bill',
  },
  gst: {
    icon: 'file-certificate',
    color: '#f59e0b',
    description: 'GST registration certificate',
  },
  society_registration: {
    icon: 'office-building',
    color: '#ef4444',
    description: 'Society registration document',
  },
};

export default function KYCScreen({ navigation }: Props) {
  const { status, setKYCData, isVerified } = useKYCStore();
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showLivenessCheck, setShowLivenessCheck] = useState(false);
  const [documentsScanned, setDocumentsScanned] = useState<string[]>([]);

  const handleDocumentSelect = (docType: DocumentType) => {
    setSelectedDocument(docType);
    setShowScanner(true);
  };

  const handleScanComplete = async (result: { text: string; extractedData: any }) => {
    setShowScanner(false);
    
    if (!selectedDocument) {
      Alert.alert('Error', 'No document selected');
      return;
    }
    
    setDocumentsScanned([...documentsScanned, selectedDocument]);
    
    if (selectedDocument === 'aadhaar' || selectedDocument === 'pan') {
      Alert.alert(
        'Document Scanned',
        'Now please complete the liveness check to verify your identity.',
        [
          {
            text: 'Continue',
            onPress: () => setShowLivenessCheck(true),
          },
        ]
      );
    } else {
      if (!selectedDocument) {
        Alert.alert('Error', 'No document selected');
        return;
      }
      
      setKYCData({
        userId: 'current_user_id',
        documentType: selectedDocument,
        documentNumber: result.extractedData?.consumerNumber,
        status: 'pending',
        submittedAt: new Date(),
      });
    }
  };

  const handleLivenessComplete = async (imageUri: string) => {
    try {
      setShowLivenessCheck(false);
      
      if (!imageUri) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        return;
      }
      
      const scannedDoc = documentsScanned.find((doc) => doc === 'aadhaar' || doc === 'pan');
      if (scannedDoc) {
        setKYCData({
          userId: 'current_user_id',
          documentType: scannedDoc as 'aadhaar' | 'pan',
          status: 'pending',
          submittedAt: new Date(),
        });
      }

      Alert.alert(
        'Verification Submitted',
        'Your identity verification has been submitted. You will be notified once verification is complete.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete liveness check. Please try again.');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Verification';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return 'check-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'clock-outline';
    }
  };

  if (showScanner && selectedDocument) {
    return (
      <DocumentScanScreen
        documentType={selectedDocument}
        onScanComplete={handleScanComplete}
        onCancel={() => setShowScanner(false)}
      />
    );
  }

  if (showLivenessCheck) {
    return (
      <LivenessCheckScreen
        onComplete={handleLivenessComplete}
        onCancel={() => setShowLivenessCheck(false)}
      />
    );
  }

  // Render document card component
  const renderDocumentCard = (
    docType: DocumentType,
    title: string,
    onPress: () => void,
    isOptional?: boolean
  ) => {
    const config = documentConfig[docType];
    const isScanned = documentsScanned.includes(docType);
    
    return (
      <TouchableOpacity
        style={[styles.documentCard, isOptional && styles.documentCardOptional]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.documentCardInner}>
          <View style={[styles.documentIconWrapper, { backgroundColor: config.color + '15' }]}>
            <MaterialCommunityIcons
              name={config.icon as any}
              size={24}
              color={config.color}
            />
          </View>
          <View style={styles.documentCardContent}>
            <Text style={styles.documentCardTitle}>{title}</Text>
            <Text style={styles.documentCardSubtitle}>{config.description}</Text>
          </View>
          {isScanned ? (
            <View style={styles.checkIconWrapper}>
              <MaterialCommunityIcons name="check-circle" size={22} color="#10b981" />
            </View>
          ) : (
            <View style={styles.arrowIconWrapper}>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>KYC Verification</Text>
            <Text style={styles.headerSubtitle}>Verify your identity to start trading</Text>
          </View>
          <View style={styles.shieldIconWrapper}>
            <MaterialCommunityIcons name="shield-check" size={28} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#6b7280" />
          <Text style={styles.infoBannerText}>
            As per government regulations, we need to verify your identity before you can trade energy.
          </Text>
        </View>

        {/* Status Badge */}
        {status !== 'pending' && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '12', borderColor: getStatusColor() + '30' }]}>
            <View style={[styles.statusIconWrapper, { backgroundColor: getStatusColor() + '20' }]}>
              <MaterialCommunityIcons
                name={getStatusIcon() as any}
                size={20}
                color={getStatusColor()}
              />
            </View>
            <View style={styles.statusBadgeContent}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
              <Text style={styles.statusSubtext}>
                {status === 'verified'
                  ? 'Your identity has been verified'
                  : status === 'rejected'
                  ? 'Please resubmit your documents'
                  : 'Your verification is being processed'}
              </Text>
            </View>
          </View>
        )}

        {!isVerified() && (
          <>
            {/* Section 1: Identity Documents */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrapper}>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Required</Text>
                  </View>
                  <Text style={styles.sectionTitle}>Identity Documents</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Upload a government-issued ID to verify your identity
                </Text>
              </View>

              <View style={styles.cardsContainer}>
                {renderDocumentCard(
                  'aadhaar',
                  'Scan Aadhaar Card',
                  () => navigation.navigate('AadhaarScan')
                )}
                {renderDocumentCard(
                  'pan',
                  'Scan PAN Card',
                  () => navigation.navigate('PANScan')
                )}
              </View>
            </View>

            {/* Section 2: Additional Documents */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrapper}>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Required</Text>
                  </View>
                  <Text style={styles.sectionTitle}>Additional Documents</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Required for meter verification
                </Text>
              </View>

              <View style={styles.cardsContainer}>
                {renderDocumentCard(
                  'electricity_bill',
                  'Scan Electricity Bill',
                  () => navigation.navigate('ElectricityBillScan')
                )}
              </View>
            </View>

            {/* Section 3: Business Documents (Optional) */}
            <View style={[styles.section, styles.sectionOptional]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrapper}>
                  <View style={[styles.sectionBadge, styles.sectionBadgeOptional]}>
                    <Text style={[styles.sectionBadgeText, styles.sectionBadgeTextOptional]}>Optional</Text>
                  </View>
                  <Text style={[styles.sectionTitle, styles.sectionTitleOptional]}>Business Documents</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  For societies and commercial users
                </Text>
              </View>

              <View style={styles.cardsContainer}>
                {renderDocumentCard(
                  'gst',
                  'Upload GST Certificate',
                  () => navigation.navigate('GSTScan'),
                  true
                )}
                {renderDocumentCard(
                  'society_registration',
                  'Upload Society Registration',
                  () => navigation.navigate('SocietyRegistrationScan'),
                  true
                )}
              </View>
            </View>
          </>
        )}

        {/* Verified State */}
        {isVerified() && (
          <View style={styles.verifiedContainer}>
            <View style={styles.verifiedIconWrapper}>
              <MaterialCommunityIcons name="check-circle" size={56} color="#10b981" />
            </View>
            <Text style={styles.verifiedTitle}>Identity Verified</Text>
            <Text style={styles.verifiedSubtitle}>
              Your identity has been successfully verified. You can now participate in energy trading.
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  gradientHeader: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  shieldIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  statusIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeContent: {
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionOptional: {
    opacity: 0.9,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  sectionBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  sectionBadgeOptional: {
    backgroundColor: '#f3f4f6',
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBadgeTextOptional: {
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  sectionTitleOptional: {
    color: '#374151',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  cardsContainer: {
    gap: 10,
  },
  documentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  documentCardOptional: {
    borderColor: '#f3f4f6',
  },
  documentCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  documentIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentCardContent: {
    flex: 1,
  },
  documentCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  documentCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  checkIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedContainer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  verifiedIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  verifiedSubtitle: {
    fontSize: 14,
    color: '#16a34a',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
