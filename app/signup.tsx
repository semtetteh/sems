import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Key, 
  User, 
  Calendar, 
  ArrowRight, 
  GraduationCap,
  CheckCircle,
  ArrowLeft
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const codeInputRefs = useRef<Array<TextInput | null>>([]);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Update progress bar animation when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step - 1) / 3,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [step]);
  
  // Handle resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 3 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);
  
  // Start resend timer when reaching verification step
  useEffect(() => {
    if (step === 3) {
      setResendTimer(60);
    }
  }, [step]);

  const handleNextStep = () => {
    setError('');
    
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (!password) {
        setError('Please enter a password');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (!graduationYear.trim()) {
        setError('Please enter your graduation year');
        return;
      }
      
      // Simulate sending verification code
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } else if (step === 3) {
      // Validate verification code
      if (verificationCode.some(digit => !digit)) {
        setError('Please enter the complete verification code');
        return;
      }
      
      // Simulate verification
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(4);
      }, 1500);
    } else if (step === 4) {
      // Complete signup and redirect to home
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(app)');
      }, 1500);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleVerificationCodeChange = (text: string, index: number) => {
    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    
    // Auto-focus to next input if a digit was entered
    if (text && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleVerificationCodeKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    // Simulate resending code
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(60);
      setVerificationCode(['', '', '', '', '', '']);
      // Focus on first input
      codeInputRefs.current[0]?.focus();
    }, 1000);
  };
  
  const handleChangeEmail = () => {
    setStep(1);
    setVerificationCode(['', '', '', '', '', '']);
  };

  const handleSignIn = () => {
    router.push('/');
  };

  const renderProgressBar = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });
    
    return (
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: progressWidth,
              backgroundColor: '#3B82F6'
            }
          ]}
        />
        <View style={styles.stepsContainer}>
          {[1, 2, 3, 4].map((stepNumber) => (
            <View 
              key={`step-${stepNumber}`}
              style={[
                styles.stepIndicator,
                { 
                  backgroundColor: stepNumber <= step ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB')
                }
              ]}
            >
              {stepNumber < step ? (
                <CheckCircle size={16} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepNumber}>{stepNumber}</Text>
              )}
            </View>
          ))}
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
        {/* Top Progress Bar */}
        {renderProgressBar()}
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            {/* Back Button */}
            {step > 1 && (
              <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                onPress={handlePreviousStep}
              >
                <ArrowLeft size={20} color={isDark ? '#E5E7EB' : '#4B5563'} />
              </TouchableOpacity>
            )}
            
            {/* Logo */}
            <View style={[styles.logoCircle, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
              <GraduationCap size={48} color={isDark ? '#60A5FA' : '#3B82F6'} />
            </View>
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Create Account
                </Text>
                <Text style={[styles.formDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Let's get started with your account setup
                </Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
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
              </>
            )}
            
            {/* Step 2: Password and Graduation Year */}
            {step === 2 && (
              <>
                <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Secure Your Account
                </Text>
                <Text style={[styles.formDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Create a strong password and add your graduation year
                </Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
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
                  <Text style={[styles.passwordHint, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Password must be at least 8 characters long
                  </Text>
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
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    Graduation Year
                  </Text>
                  <View style={[
                    styles.inputContainer, 
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                  ]}>
                    <Calendar size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <TextInput
                      style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                      placeholder="Enter graduation year"
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
            
            {/* Step 3: Verification Code */}
            {step === 3 && (
              <>
                <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Verify Your Email
                </Text>
                <Text style={[styles.formDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  We've sent a 6-digit verification code to {email}
                </Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                <View style={styles.verificationContainer}>
                  {verificationCode.map((digit, index) => (
                    <TextInput
                      key={`code-${index}`}
                      ref={ref => codeInputRefs.current[index] = ref}
                      style={[
                        styles.verificationInput,
                        { 
                          backgroundColor: isDark ? '#0F172A' : '#F9FAFB', 
                          borderColor: digit ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                          color: isDark ? '#E5E7EB' : '#1F2937'
                        }
                      ]}
                      value={digit}
                      onChangeText={text => handleVerificationCodeChange(text, index)}
                      onKeyPress={e => handleVerificationCodeKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
                
                <View style={styles.verificationHelp}>
                  <Text style={[styles.verificationHelpText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Didn't receive the code? Check your spam folder or
                  </Text>
                  
                  <View style={styles.verificationActions}>
                    <TouchableOpacity 
                      onPress={handleResendCode}
                      disabled={resendTimer > 0}
                    >
                      <Text style={[
                        styles.verificationActionText, 
                        { color: resendTimer > 0 ? (isDark ? '#4B5563' : '#9CA3AF') : '#3B82F6' }
                      ]}>
                        Resend Code {resendTimer > 0 ? `(${resendTimer}s)` : ''}
                      </Text>
                    </TouchableOpacity>
                    
                    <Text style={[styles.verificationHelpText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      or
                    </Text>
                    
                    <TouchableOpacity onPress={handleChangeEmail}>
                      <Text style={[styles.verificationActionText, { color: '#3B82F6' }]}>
                        Change Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            
            {/* Step 4: Success */}
            {step === 4 && (
              <>
                <View style={styles.successIconContainer}>
                  <CheckCircle size={64} color="#10B981" />
                </View>
                
                <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Account Created!
                </Text>
                
                <Text style={[styles.formDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Your account has been successfully created. Welcome to Semster!
                </Text>
                
                <Text style={[styles.successDetails, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  You're now ready to connect with fellow students, join communities, and make the most of your campus experience.
                </Text>
              </>
            )}
            
            {/* Next Button */}
            <TouchableOpacity 
              style={[
                styles.nextButton, 
                { backgroundColor: '#3B82F6' },
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleNextStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.nextButtonText}>
                  {step === 3 ? 'Verifying...' : step === 4 ? 'Redirecting...' : 'Processing...'}
                </Text>
              ) : (
                <View style={styles.nextButtonContent}>
                  <Text style={styles.nextButtonText}>
                    {step === 4 ? 'Get Started' : 'Continue'}
                  </Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            
            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={[styles.signInLink, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    height: 40,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  formDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
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
  passwordHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  verificationInput: {
    width: width * 0.11,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  verificationHelp: {
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationHelpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  verificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verificationActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successDetails: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  nextButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  signInLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});