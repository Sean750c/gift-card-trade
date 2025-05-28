import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, ArrowLeft, Upload, CreditCard as Edit, CircleDollarSign, X } from 'lucide-react-native';
import CardTypeSelector from '@/components/CardTypeSelector';

const CARD_TYPES = [
  { id: 'amazon', name: 'Amazon', logo: 'amazon' },
  { id: 'itunes', name: 'iTunes', logo: 'itunes' },
  { id: 'steam', name: 'Steam', logo: 'steam' },
  { id: 'google', name: 'Google Play', logo: 'google-play' },
  { id: 'xbox', name: 'Xbox', logo: 'xbox' },
  { id: 'psn', name: 'PlayStation', logo: 'playstation' },
  { id: 'netflix', name: 'Netflix', logo: 'netflix' },
  { id: 'other', name: 'Other', logo: 'other' },
];

export default function TradeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [cardAmount, setCardAmount] = useState('');
  const [expectedAmount, setExpectedAmount] = useState(0);

  const handleSelectCardType = (id: string) => {
    setSelectedCardType(id);
  };

  const toggleCamera = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        return;
      }
    }
    setCameraActive(prev => !prev);
  };

  const toggleCameraFacing = () => {
    setCameraFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    // In a real app, this would capture an image
    // For demo purposes, we'll just set a mock image path
    setCapturedImage('https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
    setCameraActive(false);
  };

  const clearCapturedImage = () => {
    setCapturedImage(null);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the trade
      router.push('/(tabs)/history');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateExpectedAmount = () => {
    // This would be a more complex calculation in a real app
    if (cardAmount && selectedCardType) {
      // Mock calculation based on card type and amount
      const rates = {
        amazon: 0.8,
        itunes: 0.75,
        steam: 0.82,
        google: 0.78,
        xbox: 0.72,
        psn: 0.74,
        netflix: 0.76,
        other: 0.7,
      };
      const rate = rates[selectedCardType as keyof typeof rates];
      const parsed = parseFloat(cardAmount);
      if (!isNaN(parsed)) {
        setExpectedAmount(parsed * rate);
      }
    }
  };

  React.useEffect(() => {
    calculateExpectedAmount();
  }, [cardAmount, selectedCardType]);

  const renderStepOne = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Select Gift Card Type
      </Text>
      
      <ScrollView
        contentContainerStyle={styles.cardTypesContainer}
        showsVerticalScrollIndicator={false}
      >
        {CARD_TYPES.map((card) => (
          <CardTypeSelector
            key={card.id}
            id={card.id}
            name={card.name}
            logo={card.logo}
            isSelected={selectedCardType === card.id}
            onSelect={handleSelectCardType}
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedCardType ? colors.primary : colors.border }
        ]}
        onPress={handleNextStep}
        disabled={!selectedCardType}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Upload Gift Card
      </Text>
      
      <View style={styles.uploadOptionsContainer}>
        {capturedImage ? (
          <View style={styles.capturedImageContainer}>
            <Image 
              source={{ uri: capturedImage }} 
              style={styles.capturedImage} 
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={[styles.removeImageButton, { backgroundColor: colors.error }]}
              onPress={clearCapturedImage}
            >
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <TouchableOpacity 
              style={[styles.uploadOption, { backgroundColor: colors.card }]}
              onPress={toggleCamera}
            >
              <Camera size={36} color={colors.primary} />
              <Text style={[styles.uploadOptionText, { color: colors.text }]}>Scan Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.uploadOption, { backgroundColor: colors.card }]}
            >
              <Upload size={36} color={colors.primary} />
              <Text style={[styles.uploadOptionText, { color: colors.text }]}>Upload Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.uploadOption, { backgroundColor: colors.card }]}
            >
              <Edit size={36} color={colors.primary} />
              <Text style={[styles.uploadOptionText, { color: colors.text }]}>Manual Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.cardDetailsContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Card Number</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Enter card number"
            placeholderTextColor={colors.textSecondary}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Card PIN</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Enter card PIN"
            placeholderTextColor={colors.textSecondary}
            value={cardPin}
            onChangeText={setCardPin}
            secureTextEntry
          />
        </View>
      </View>
      
      <View style={styles.stepButtonsContainer}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handlePreviousStep}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            { 
              backgroundColor: (capturedImage || cardNumber) ? colors.primary : colors.border,
              flex: 1,
              marginLeft: 12
            }
          ]}
          onPress={handleNextStep}
          disabled={!capturedImage && !cardNumber}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepThree = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Card Amount & Summary
      </Text>
      
      <View style={styles.amountContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Card Amount ($)</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Enter card amount"
            placeholderTextColor={colors.textSecondary}
            value={cardAmount}
            onChangeText={setCardAmount}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Trade Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Card Type</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {CARD_TYPES.find(card => card.id === selectedCardType)?.name || 'Unknown'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Card Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            ${cardAmount || '0.00'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Exchange Rate</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {selectedCardType === 'amazon' ? '0.80' : 
             selectedCardType === 'itunes' ? '0.75' : 
             selectedCardType === 'steam' ? '0.82' : 
             selectedCardType === 'google' ? '0.78' : '0.70'}
          </Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>You Receive</Text>
          <View style={styles.totalValueContainer}>
            <CircleDollarSign size={20} color={colors.primary} />
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${expectedAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.stepButtonsContainer}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handlePreviousStep}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            { 
              backgroundColor: cardAmount ? colors.primary : colors.border,
              flex: 1,
              marginLeft: 12
            }
          ]}
          onPress={handleNextStep}
          disabled={!cardAmount}
        >
          <Text style={styles.nextButtonText}>Submit Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cameraActive) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={cameraFacing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControlsTop}>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={toggleCamera}
              >
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraGuide}>
              <View style={[styles.cameraGuideFrame, { borderColor: colors.primary }]} />
              <Text style={styles.cameraGuideText}>
                Position the gift card inside the frame
              </Text>
            </View>
            
            <View style={styles.cameraControlsBottom}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trade Gift Card</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                backgroundColor: colors.primary,
                width: `${(currentStep / 3) * 100}%`
              }
            ]} 
          />
        </View>
        <View style={styles.stepsTextContainer}>
          <Text style={[styles.stepsText, { color: colors.text }]}>
            Step {currentStep} of 3
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'WorkSans-Bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsTextContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  stepsText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-Bold',
    marginBottom: 24,
  },
  cardTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  uploadOptionsContainer: {
    marginBottom: 24,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uploadOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  uploadOptionText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
  },
  capturedImageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetailsContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
  },
  stepButtonsContainer: {
    flexDirection: 'row',
  },
  amountContainer: {
    marginBottom: 24,
  },
  summaryContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  totalValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'WorkSans-Bold',
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraControlsTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeCameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraGuide: {
    alignItems: 'center',
  },
  cameraGuideFrame: {
    width: '80%',
    aspectRatio: 16/9,
    borderWidth: 2,
    borderRadius: 12,
  },
  cameraGuideText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    marginTop: 16,
    textAlign: 'center',
  },
  cameraControlsBottom: {
    alignItems: 'center',
    marginBottom: 32,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },
});