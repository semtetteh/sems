import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, User, Camera, AtSign, CircleAlert as AlertCircle, CheckCircle, Edit3, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AVATAR_SUGGESTIONS = [
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
];

export default function ProfileSetupScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, updateSignUpData, signUpData } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarSuggestions, setShowAvatarSuggestions] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameTypingTimeout, setUsernameTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Animation values
  const avatarScale = useSharedValue(1);
  const suggestionsHeight = useSharedValue(0);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(4);
  }, []);

  useEffect(() => {
    // Clear errors when user types
    if (nameError && fullName) setNameError('');
  }, [fullName]);

  useEffect(() => {
    // Check username availability after user stops typing
    if (username.trim().length > 0) {
      if (usernameTypingTimeout) {
        clearTimeout(usernameTypingTimeout);
      }
      
      setIsCheckingUsername(true);
      setUsernameAvailable(false);
      
      const timeout = setTimeout(() => {
        // Simulate checking username availability
        const isAvailable = Math.random() > 0.3; // 70% chance of being available for demo
        setUsernameAvailable(isAvailable);
        setIsCheckingUsername(false);
        
        if (!isAvailable) {
          setUsernameError('Username already taken');
        } else {
          setUsernameError('');
        }
      }, 1000);
      
      setUsernameTypingTimeout(timeout);
    } else {
      setUsernameError('');
      setUsernameAvailable(false);
      setIsCheckingUsername(false);
    }
  }, [username]);

  const handleBack = () => {
    router.back();
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarSuggestions(false);
      suggestionsHeight.value = withTiming(0);
      
      // Animate avatar selection
      avatarScale.value = withSpring(1.2, {}, () => {
        avatarScale.value = withSpring(1);
      });
    }
  };

  const toggleAvatarSuggestions = () => {
    setShowAvatarSuggestions(!showAvatarSuggestions);
    suggestionsHeight.value = withTiming(showAvatarSuggestions ? 0 : 120);
  };

  const selectSuggestedAvatar = (uri: string) => {
    setAvatarUri(uri);
    setShowAvatarSuggestions(false);
    suggestionsHeight.value = withTiming(0);
    
    // Animate avatar selection
    avatarScale.value = withSpring(1.2, {}, () => {
      avatarScale.value = withSpring(1);
    });
  };

  const validateInputs = () => {
    let isValid = true;
    
    if (!fullName.trim()) {
      setNameError('Please enter your full name');
      isValid = false;
    }
    
    if (!username.trim()) {
      setUsernameError('Please enter a username');
      isValid = false;
    } else if (username.includes(' ')) {
      setUsernameError('Username cannot contain spaces');
      isValid = false;
    } else if (!usernameAvailable) {
      setUsernameError('Please choose an available username');
      isValid = false;
    }
    
    return isValid;
  };

  const handleContinue = () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Simulate checking username availability
    setTimeout(() => {
      setIsLoading(false);
      
      // Store profile data
      updateSignUpData({
        fullName,
        username,
        avatarUrl: avatarUri
      });
      
      router.push('/signup/password-creation');
    }, 1000);
  };

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }]
  }));

  const suggestionsAnimatedStyle = useAnimatedStyle(() => ({
    height: suggestionsHeight.value,
    opacity: suggestionsHeight.value === 0 ? 0 : 1,
    overflow: 'hidden'
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
              <Text style={styles.stepNumber}>4</Text>
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
            Create Your Profile
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Let others know who you are
          </Text>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.avatarSection}
          >
            <Animated.View style={avatarAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.avatarContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                onPress={handlePickImage}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <>
                    <Camera size={32} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <Text style={[styles.avatarText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Add Photo
                    </Text>
                  </>
                )}
                <View style={styles.editIconContainer}>
                  <Edit3 size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={[styles.suggestionsButton, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
              onPress={toggleAvatarSuggestions}
            >
              <Sparkles size={16} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text style={[styles.suggestionsButtonText, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                {showAvatarSuggestions ? 'Hide Suggestions' : 'View Suggestions'}
              </Text>
            </TouchableOpacity>
            
            <Animated.View style={[styles.avatarSuggestions, suggestionsAnimatedStyle]}>
              <View style={styles.suggestionsRow}>
                {AVATAR_SUGGESTIONS.map((uri, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestionItem,
                      avatarUri === uri && { borderColor: '#3B82F6', borderWidth: 2 }
                    ]}
                    onPress={() => selectSuggestedAvatar(uri)}
                  >
                    <Image source={{ uri }} style={styles.suggestionImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.formGroup}
          >
            <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Full Name
            </Text>
            <View style={[
              styles.inputContainer,
              { 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: nameError ? '#EF4444' : isDark ? '#374151' : '#E5E7EB'
              }
            ]}>
              <User size={20} color={nameError ? '#EF4444' : (isDark ? '#60A5FA' : '#3B82F6')} />
              <TextInput
                style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                placeholder="Your full name"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            {nameError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{nameError}</Text>
              </View>
            ) : null}
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(500).duration(500)}
            style={styles.formGroup}
          >
            <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              Username
            </Text>
            <View style={[
              styles.inputContainer,
              { 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: usernameError ? '#EF4444' : 
                             usernameAvailable && username ? '#10B981' : 
                             isDark ? '#374151' : '#E5E7EB'
              }
            ]}>
              <AtSign size={20} color={
                usernameError ? '#EF4444' : 
                usernameAvailable && username ? '#10B981' : 
                (isDark ? '#60A5FA' : '#3B82F6')
              } />
              <TextInput
                style={[styles.input, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
                placeholder="Choose a username"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              {isCheckingUsername && username ? (
                <View style={styles.loadingIndicator} />
              ) : usernameAvailable && username ? (
                <CheckCircle size={20} color="#10B981" />
              ) : null}
            </View>
            {usernameError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{usernameError}</Text>
              </View>
            ) : usernameAvailable && username ? (
              <View style={styles.successContainer}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.successText}>Username available</Text>
              </View>
            ) : (
              <Text style={[styles.helperText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                This will be your unique identifier on Semster
              </Text>
            )}
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.footer}
        >
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              { 
                backgroundColor: fullName && username && usernameAvailable ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                opacity: fullName && username && usernameAvailable && !isLoading ? 1 : 0.5
              }
            ]}
            onPress={handleContinue}
            disabled={!fullName || !username || !usernameAvailable || isLoading}
          >
            {isLoading ? (
              <Text style={[
                styles.continueButtonText,
                { color: '#FFFFFF' }
              ]}>
                Processing...
              </Text>
            ) : (
              <>
                <Text style={[
                  styles.continueButtonText,
                  { color: fullName && username && usernameAvailable ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280') }
                ]}>
                  Continue
                </Text>
                <ArrowRight 
                  size={20} 
                  color={fullName && username && usernameAvailable ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')} 
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  suggestionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  suggestionsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  avatarSuggestions: {
    marginTop: 16,
    width: '100%',
  },
  suggestionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  suggestionItem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  suggestionImage: {
    width: 64,
    height: 64,
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
  loadingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderTopColor: 'transparent',
    animationName: 'spin',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
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