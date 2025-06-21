import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Key, ArrowRight, GraduationCap, User, Calendar, Check, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  
  const codeInputRefs = useRef<Array<TextInput | null>>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSignUp = () => {
    setError('');
    
    if (currentStep === 1) {
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }
      
      if (!password.trim()) {
        setError('Please enter your password');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      // Simulate sending verification code
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(2);
        setResendCountdown(30);
        
        // Start countdown for resend button
        const interval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1500);
    } else if (currentStep === 2) {
      // Verify code
      const code = verificationCode.join('');
      if (code.length !== 6) {
        setError('Please enter the complete verification code');
        return;
      }
      
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsVerified(true);
        
        // Move to next step after showing verification success
        setTimeout(() => {
          setCurrentStep(3);
        }, 1000);
      }, 1500);
    } else if (currentStep === 3) {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      
      // Simulate account creation
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(app)');
      }, 1500);
    }
  };

  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setVerificationCode(['', '', '', '', '', '']);
      setResendCountdown(30);
      
      // Reset focus to first input
      codeInputRefs.current[0]?.focus();
      
      // Start countdown for resend button
      const interval = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleCodeChange = (text: string, index: number) => {
    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    
    // Auto-focus next input if value is entered
    if (text && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setIsVerified(false);
      }
    } else {
      router.back();
    }
  };

  const renderProgressBar = () => {
    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View key={index} style={styles.stepIndicatorContainer}>
              <View 
                style={[
                  styles.stepIndicator, 
                  { 
                    backgroundColor: index + 1 <= currentStep ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                  }
                ]}
              >
                {index + 1 < currentStep ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              {index < totalSteps - 1 && (
                <View 
                  style={[
                    styles.stepConnector, 
                    { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}
                >
                  <View 
                    style={[
                      styles.stepConnectorFill, 
                      { 
                        backgroundColor: '#3B82F6',
                        width: index + 1 < currentStep ? '100%' : '0%'
                      }
                    ]} 
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
            Account
          </Text>
          <Text style={[styles.progressLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
            Verify
          </Text>
          <Text style={[styles.progressLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
            Profile
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
              <GraduationCap size={48} color={isDark ? '#60A5FA' : '#3B82F6'} />
            </View>
            <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Semster
            </Text>
            <Text style={[styles.tagline, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Connect. Learn. Thrive.
            </Text>
          </View>

          {renderProgressBar()}

          <View style={[styles.formCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.formHeader}>
              <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                onPress={handleBack}
              >
                <ArrowLeft size={20} color={isDark ? '#E5E7EB' : '#4B5563'} />
              </TouchableOpacity>
              <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {currentStep === 1 ? 'Create Account' : 
                 currentStep === 2 ? 'Verify Email' : 'Complete Profile'}
              </Text>
              <View style={styles.backButtonPlaceholder} />
            </View>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            {currentStep === 1 && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Email
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <Mail size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="Enter your email"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Password
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <Key size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="Create a password"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                      ) : (
                        <Eye size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Confirm Password
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <Key size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="Confirm your password"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                      ) : (
                        <Eye size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            
            {currentStep === 2 && (
              <View style={styles.verificationContainer}>
                <Text style={[styles.verificationText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  We've sent a verification code to
                </Text>
                <Text style={[styles.verificationEmail, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {email}
                </Text>
                
                <View style={styles.codeInputContainer}>
                  {verificationCode.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => codeInputRefs.current[index] = ref}
                      style={[
                        styles.codeInput,
                        { 
                          backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
                          borderColor: isDark ? '#374151' : '#E5E7EB',
                          color: isDark ? '#E5E7EB' : '#1F2937'
                        }
                      ]}
                      value={digit}
                      onChangeText={text => handleCodeChange(text.replace(/[^0-9]/g, '').slice(0, 1), index)}
                      onKeyPress={e => handleCodeKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
                
                {isVerified && (
                  <View style={styles.verificationSuccessContainer}>
                    <View style={styles.verificationSuccessIcon}>
                      <Check size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.verificationSuccessText}>Email Verified!</Text>
                  </View>
                )}
                
                <View style={styles.resendContainer}>
                  <Text style={[styles.resendText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Didn't receive the code?
                  </Text>
                  <TouchableOpacity 
                    onPress={handleResendCode}
                    disabled={resendCountdown > 0}
                  >
                    <Text style={[
                      styles.resendButton,
                      { 
                        color: resendCountdown > 0 ? 
                          (isDark ? '#9CA3AF' : '#6B7280') : 
                          (isDark ? '#60A5FA' : '#3B82F6') 
                      }
                    ]}>
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.verificationHelp}>
                  <Text style={[styles.verificationHelpText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Check your spam folder if you don't see the email in your inbox.
                  </Text>
                  <TouchableOpacity onPress={() => setCurrentStep(1)}>
                    <Text style={[styles.changeEmailText, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                      Change email address
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {currentStep === 3 && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Full Name
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <User size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="Enter your full name"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Graduation Year (Optional)
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <Calendar size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="e.g., 2025"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={graduationYear}
                      onChangeText={setGraduationYear}
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={[
                styles.signUpButton, 
                { backgroundColor: '#3B82F6' },
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.signUpButtonText}>
                  {currentStep === 1 ? 'Creating Account...' : 
                   currentStep === 2 ? 'Verifying...' : 'Completing Setup...'}
                </Text>
              ) : (
                <View style={styles.signUpButtonContent}>
                  <Text style={styles.signUpButtonText}>
                    {currentStep === 1 ? 'Continue' : 
                     currentStep === 2 ? 'Verify Email' : 'Complete Sign Up'}
                  </Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={[styles.signInLink, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    position: 'relative',
  },
  stepConnectorFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    width: '33.33%',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  verificationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  verificationEmail: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  codeInput: {
    width: width * 0.1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  verificationSuccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  verificationSuccessIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  verificationSuccessText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  resendButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  verificationHelp: {
    alignItems: 'center',
  },
  verificationHelpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  changeEmailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  signUpButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 4,
  },
  signInLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});