import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Key, Eye, EyeOff, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Shield, Lock, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PasswordCreationScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, signUp, updateSignUpData, signUpData } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength criteria
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  
  // Animation values
  const strengthBarWidth = useSharedValue(0);
  const successScale = useSharedValue(1);
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(5);
  }, []);

  useEffect(() => {
    // Check password strength
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    
    // Calculate strength percentage
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar];
    const metCriteria = criteria.filter(Boolean).length;
    const strengthPercentage = (metCriteria / criteria.length) * 100;
    setPasswordStrength(strengthPercentage);
    
    // Animate strength bar
    strengthBarWidth.value = withTiming(strengthPercentage, { duration: 500 });
    
    // Clear errors when user types
    if (passwordError) setPasswordError('');
    if (confirmPasswordError && confirmPassword) setConfirmPasswordError('');
  }, [password, confirmPassword, hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]);

  const handleBack = () => {
    router.back();
  };

  const validatePassword = () => {
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setPasswordError('Please ensure your password meets all requirements');
      
      // Shake animation for error
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      
      return false;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      
      // Shake animation for error
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      
      return false;
    }
    
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);

    // Store password in sign-up data
    updateSignUpData({ password });

    // Simulate account creation
    setTimeout(() => {
      // Success animation
      successScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      
      // Show success message
      Alert.alert(
        'Account Created!',
        'Your account has been created successfully. You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/')
          }
        ]
      );
      
      setIsLoading(false);
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#EF4444'; // Red
    if (passwordStrength < 70) return '#F59E0B'; // Yellow
    return '#10B981'; // Green
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const strengthBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${strengthBarWidth.value}%`,
    backgroundColor: 
      strengthBarWidth.value < 40 ? '#EF4444' : 
      strengthBarWidth.value < 70 ? '#F59E0B' : 
      '#10B981'
  }));

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }]
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
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.stepNumber}>5</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.content}
        >
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Create Password
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Set a secure password for your account
          </Text>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={[styles.formGroup, shakeAnimatedStyle]}
          >
            <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Password
            </Text>
            <View style={[
              styles.inputContainer,
              { 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: passwordError ? '#EF4444' : isDark ? '#374151' : '#E5E7EB'
              }
            ]}>
              <Key size={20} color={passwordError ? '#EF4444' : (isDark ? '#60A5FA' : '#3B82F6')} />
              <TextInput
                style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                placeholder="Create a password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                ) : (
                  <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            ) : password ? (
              <View style={styles.passwordStrengthContainer}>
                <Text style={[styles.passwordStrengthLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Password Strength:
                </Text>
                <Text style={[styles.passwordStrengthValue, { color: getPasswordStrengthColor() }]}>
                  {getPasswordStrengthText()}
                </Text>
                <View style={[styles.strengthBarContainer, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
                  <Animated.View style={[styles.strengthBar, strengthBarAnimatedStyle]} />
                </View>
              </View>
            ) : null}

            <Animated.View 
              entering={FadeInDown.delay(400).duration(500)}
              style={styles.passwordRequirements}
            >
              <View style={styles.requirementItem}>
                {hasMinLength ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <Shield size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
                <Text 
                  style={[
                    styles.requirementText, 
                    { 
                      color: hasMinLength ? 
                        '#10B981' : 
                        (isDark ? '#9CA3AF' : '#6B7280') 
                    }
                  ]}
                >
                  At least 8 characters
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {hasUppercase ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <Shield size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
                <Text 
                  style={[
                    styles.requirementText, 
                    { 
                      color: hasUppercase ? 
                        '#10B981' : 
                        (isDark ? '#9CA3AF' : '#6B7280') 
                    }
                  ]}
                >
                  At least one uppercase letter
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {hasLowercase ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <Shield size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
                <Text 
                  style={[
                    styles.requirementText, 
                    { 
                      color: hasLowercase ? 
                        '#10B981' : 
                        (isDark ? '#9CA3AF' : '#6B7280') 
                    }
                  ]}
                >
                  At least one lowercase letter
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {hasNumber ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <Shield size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
                <Text 
                  style={[
                    styles.requirementText, 
                    { 
                      color: hasNumber ? 
                        '#10B981' : 
                        (isDark ? '#9CA3AF' : '#6B7280') 
                    }
                  ]}
                >
                  At least one number
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {hasSpecialChar ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <Shield size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
                <Text 
                  style={[
                    styles.requirementText, 
                    { 
                      color: hasSpecialChar ? 
                        '#10B981' : 
                        (isDark ? '#9CA3AF' : '#6B7280') 
                    }
                  ]}
                >
                  At least one special character
                </Text>
              </View>
            </Animated.View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(500).duration(500)}
            style={[styles.formGroup, shakeAnimatedStyle]}
          >
            <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Confirm Password
            </Text>
            <View style={[
              styles.inputContainer,
              { 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: confirmPasswordError ? '#EF4444' : 
                             password && confirmPassword && password === confirmPassword ? '#10B981' :
                             isDark ? '#374151' : '#E5E7EB'
              }
            ]}>
              <Lock size={20} color={
                confirmPasswordError ? '#EF4444' : 
                password && confirmPassword && password === confirmPassword ? '#10B981' :
                (isDark ? '#60A5FA' : '#3B82F6')
              } />
              <TextInput
                style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                placeholder="Confirm your password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                ) : (
                  <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              </View>
            ) : password && confirmPassword && password === confirmPassword ? (
              <View style={styles.successContainer}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.successText}>Passwords match</Text>
              </View>
            ) : null}
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(600).duration(500)}
            style={[styles.securityContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.securityHeader}>
              <Sparkles size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text style={[styles.securityTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Almost there!
              </Text>
            </View>
            <Text style={[styles.securityText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              You're one step away from joining Semster. Create a strong password to secure your account.
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(700).duration(500)}
          style={styles.footer}
        >
          <TouchableOpacity 
            style={[
              styles.createAccountButton, 
              { 
                backgroundColor: password && confirmPassword && password === confirmPassword && passwordStrength >= 60 ? 
                  '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                opacity: password && confirmPassword && password === confirmPassword && passwordStrength >= 60 && !isLoading ? 1 : 0.5
              }
            ]}
            onPress={handleCreateAccount}
            disabled={!password || !confirmPassword || password !== confirmPassword || passwordStrength < 60 || isLoading}
          >
            {isLoading ? (
              <Text style={[
                styles.createAccountButtonText,
                { color: '#FFFFFF' }
              ]}>
                Creating Account...
              </Text>
            ) : (
              <>
                <Text style={[
                  styles.createAccountButtonText,
                  { color: password && confirmPassword && password === confirmPassword && passwordStrength >= 60 ? 
                      '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280') }
                ]}>
                  Create Account
                </Text>
                <ArrowRight 
                  size={20} 
                  color={password && confirmPassword && password === confirmPassword && passwordStrength >= 60 ? 
                    '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')} 
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
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
  passwordStrengthContainer: {
    marginTop: 8,
  },
  passwordStrengthLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  passwordStrengthValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  strengthBarContainer: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
  },
  passwordRequirements: {
    marginTop: 16,
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  securityContainer: {
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  securityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  createAccountButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});