import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, CircleCheck as CheckCircle, Clock, ShieldCheck, Mail } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OtpVerificationScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, signUpData } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [securityTips, setSecurityTips] = useState([
    "Never share your verification code with anyone",
    "Check that the email is from semster.edu",
    "Report suspicious activity immediately"
  ]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Animation values
  const successScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(3);
  }, []);

  useEffect(() => {
    // Countdown for resend button
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleBack = () => {
    router.back();
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0]; // Only take the first character
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus next input if value is entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      
      // Start success animation
      successScale.value = withRepeat(
        withTiming(1.2, { duration: 300 }),
        2,
        true
      );
      
      // Navigate to next step after showing success state
      setTimeout(() => {
        router.push('/signup/profile-setup');
      }, 1500);
    }, 1500);
  };

  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    
    // Simulate resending code
    setResendCountdown(60);
    
    // Start pulse animation for the email icon
    pulseOpacity.value = withRepeat(
      withTiming(0.5, { duration: 1000 }),
      2,
      true
    );
    
    Alert.alert('Code Sent', `A new verification code has been sent to ${signUpData.email}`);
  };

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }]
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={isDark ? '#E5E7EB' : '#4B5563'} />
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
            <View style={[styles.stepDot, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <Text style={[styles.stepNumber, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>4</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
            <View style={[styles.stepDot, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <Text style={[styles.stepNumber, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>5</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.content}
        >
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Verification Code
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Enter the 6-digit code sent to {signUpData.email || 'your email'}
          </Text>

          {isVerified ? (
            <Animated.View 
              style={[styles.verificationSuccess, successAnimatedStyle]}
            >
              <View style={styles.successIcon}>
                <CheckCircle size={64} color="#10B981" />
              </View>
              <Text style={styles.successText}>Email Verified!</Text>
              <Text style={[styles.successSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Taking you to the next step...
              </Text>
            </Animated.View>
          ) : (
            <Animated.View 
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.otpContainer}
            >
              <Animated.View 
                style={[styles.emailIconContainer, pulseAnimatedStyle]}
              >
                <Mail size={32} color={isDark ? '#60A5FA' : '#3B82F6'} />
              </Animated.View>
              
              <View style={styles.otpInputsContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={[
                      styles.otpInput,
                      { 
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: digit ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                        color: isDark ? '#E5E7EB' : '#1F2937'
                      }
                    ]}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>
            </Animated.View>
          )}

          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.resendContainer}
          >
            <Text style={[styles.resendText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Didn't receive the code?
            </Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={resendCountdown > 0}
              style={styles.resendButton}
            >
              {resendCountdown > 0 ? (
                <View style={styles.countdownContainer}>
                  <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text style={[
                    styles.countdownText,
                    { color: isDark ? '#9CA3AF' : '#6B7280' }
                  ]}>
                    Resend in {resendCountdown}s
                  </Text>
                </View>
              ) : (
                <Text style={[
                  styles.resendButtonText,
                  { color: isDark ? '#60A5FA' : '#3B82F6' }
                ]}>
                  Resend Code
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(500).duration(500)}
            style={[styles.securityContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.securityHeader}>
              <ShieldCheck size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text style={[styles.securityTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Security Tips
              </Text>
            </View>
            
            {securityTips.map((tip, index) => (
              <Animated.View 
                key={index}
                entering={SlideInRight.delay(600 + (index * 100)).duration(500)}
                style={styles.securityTip}
              >
                <View style={styles.bulletPoint} />
                <Text style={[styles.securityTipText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  {tip}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.footer}
        >
          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              { 
                backgroundColor: otp.every(digit => digit) && !isVerified ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                opacity: otp.every(digit => digit) && !isVerified && !isLoading ? 1 : 0.5
              }
            ]}
            onPress={handleVerify}
            disabled={!otp.every(digit => digit) || isVerified || isLoading}
          >
            {isLoading ? (
              <Text style={[
                styles.verifyButtonText,
                { color: '#FFFFFF' }
              ]}>
                Verifying...
              </Text>
            ) : (
              <>
                <Text style={[
                  styles.verifyButtonText,
                  { 
                    color: otp.every(digit => digit) && !isVerified ? 
                      '#FFFFFF' : 
                      (isDark ? '#9CA3AF' : '#6B7280')
                  }
                ]}>
                  Verify
                </Text>
                <ArrowRight 
                  size={20} 
                  color={otp.every(digit => digit) && !isVerified ? 
                    '#FFFFFF' : 
                    (isDark ? '#9CA3AF' : '#6B7280')
                  } 
                />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 40, // To balance the back button
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  stepLine: {
    height: 2,
    width: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
    textAlign: 'center',
  },
  emailIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  otpInput: {
    width: width > 380 ? 48 : 40,
    height: width > 380 ? 56 : 48,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 4,
  },
  verificationSuccess: {
    alignItems: 'center',
    marginVertical: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  resendButton: {
    padding: 4,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  securityContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  securityTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  securityTipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});