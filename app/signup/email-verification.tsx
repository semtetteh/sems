import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Mail, AlertCircle, Shield } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  SlideInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence, 
  withSpring, 
  withDelay 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function EmailVerificationScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, updateSignUpData, signUpData } = useAuth();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [securityTips, setSecurityTips] = useState([
    "Use your school email for verification",
    "We'll never share your email with third parties",
    "Your data is encrypted and secure"
  ]);

  // Animation values
  const emailInputScale = useSharedValue(1);
  const emailInputBorderWidth = useSharedValue(1);
  const mailIconFloat = useSharedValue(0);
  const mailIconRotate = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const securityItemsOpacity = useSharedValue(0);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(2);
    
    // Start floating animation for mail icon
    mailIconFloat.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
    
    // Start rotation animation for mail icon
    mailIconRotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 }),
        withTiming(5, { duration: 2000 })
      ),
      -1,
      true
    );
    
    // Animate security items in
    securityItemsOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    setIsValid(isValidEmail);
    
    // Clear error when user types
    if (error) setError('');

    // Animate input on validation change
    if (email && !isValidEmail) {
      emailInputBorderWidth.value = withTiming(2, { duration: 300 });
    } else if (email && isValidEmail) {
      emailInputBorderWidth.value = withTiming(2, { duration: 300 });
    } else {
      emailInputBorderWidth.value = withTiming(1, { duration: 300 });
    }
  }, [email]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!isValid) {
      setError('Please enter a valid email address');
      emailInputScale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      return;
    }

    // Check if it's a school email (this is a simplified check)
    if (!email.includes('.edu') && !email.includes('ac.')) {
      setError('Please use your school email address');
      emailInputScale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    // Simulate API call to send verification code
    setTimeout(() => {
      setIsLoading(false);
      updateSignUpData({ email });
      router.push('/signup/otp-verification');
    }, 1000);
  };

  const emailInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emailInputScale.value }],
    borderWidth: emailInputBorderWidth.value,
    borderColor: error ? '#EF4444' : (isValid && email ? '#10B981' : (isDark ? '#374151' : '#E5E7EB'))
  }));

  const mailIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: mailIconFloat.value },
      { rotateZ: `${mailIconRotate.value}deg` }
    ]
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const securityContainerStyle = useAnimatedStyle(() => ({
    opacity: securityItemsOpacity.value,
    transform: [{ translateY: (1 - securityItemsOpacity.value) * 20 }]
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
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
            <View style={[styles.stepDot, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <Text style={[styles.stepNumber, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>3</Text>
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
            Verify Your Email
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Enter your school email address to receive a verification code
          </Text>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.emailIconContainer}
          >
            <Animated.View style={mailIconStyle}>
              <Mail size={64} color={isDark ? '#60A5FA' : '#3B82F6'} />
            </Animated.View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.formGroup}
          >
            <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              School Email
            </Text>
            <Animated.View 
              style={[
                styles.inputContainer,
                { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
                emailInputStyle
              ]}
            >
              <Mail size={20} color={error ? '#EF4444' : (isValid && email ? '#10B981' : (isDark ? '#60A5FA' : '#3B82F6'))} />
              <TextInput
                style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                placeholder="your.name@school.edu"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </Animated.View>
            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : isValid && email ? (
              <View style={styles.successContainer}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.successText}>Valid school email</Text>
              </View>
            ) : (
              <Text style={[styles.helperText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                We'll send a verification code to this email
              </Text>
            )}
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.schoolInfo}
          >
            <Text style={[styles.schoolInfoLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Selected School:
            </Text>
            <Text style={[styles.schoolName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {signUpData.school || 'University of Ghana'}
            </Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.securityContainer, 
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
              securityContainerStyle
            ]}
          >
            <View style={styles.securityHeader}>
              <Shield size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text style={[styles.securityTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Security & Privacy
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
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity 
              style={[
                styles.continueButton, 
                { 
                  backgroundColor: isValid ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                  opacity: isValid && !isLoading ? 1 : 0.5
                }
              ]}
              onPress={handleContinue}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <Text style={[
                  styles.continueButtonText,
                  { color: '#FFFFFF' }
                ]}>
                  Sending...
                </Text>
              ) : (
                <>
                  <Text style={[
                    styles.continueButtonText,
                    { color: isValid ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280') }
                  ]}>
                    Continue
                  </Text>
                  <ArrowRight size={20} color={isValid ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')} />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  emailIconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  schoolInfo: {
    marginTop: 32,
    marginBottom: 32,
  },
  schoolInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
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
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});