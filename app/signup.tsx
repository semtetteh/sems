import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, ArrowRight, Mail, X, Eye, EyeOff, Key, GraduationCap, Camera, CircleCheck as CheckCircle, Lock, User, AtSign } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface University {
  id: string;
  name: string;
  domain: string;
  location: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

// Mock data for universities
const universities: University[] = [
  {
    id: '1',
    name: 'University of Ghana',
    domain: 'ug.edu.gh',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#00205B',
    secondaryColor: '#FFD700',
  },
  {
    id: '2',
    name: 'Kwame Nkrumah University of Science and Technology',
    domain: 'knust.edu.gh',
    location: 'Kumasi, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#8A1538',
    secondaryColor: '#FFD700',
  },
  {
    id: '3',
    name: 'University of Cape Coast',
    domain: 'ucc.edu.gh',
    location: 'Cape Coast, Ghana',
    logo: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#006633',
    secondaryColor: '#FFFFFF',
  },
  {
    id: '4',
    name: 'Ashesi University',
    domain: 'ashesi.edu.gh',
    location: 'Berekuso, Ghana',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#003366',
    secondaryColor: '#CC0000',
  },
  {
    id: '5',
    name: 'University of Professional Studies',
    domain: 'upsa.edu.gh',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#1B3764',
    secondaryColor: '#F2A900',
  },
  {
    id: '6',
    name: 'Ghana Institute of Management and Public Administration',
    domain: 'gimpa.edu.gh',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#00447C',
    secondaryColor: '#FFCC00',
  },
  {
    id: '7',
    name: 'University of Education, Winneba',
    domain: 'uew.edu.gh',
    location: 'Winneba, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#003366',
    secondaryColor: '#FFCC00',
  },
  {
    id: '8',
    name: 'University of Development Studies',
    domain: 'uds.edu.gh',
    location: 'Tamale, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    primaryColor: '#006633',
    secondaryColor: '#FFCC00',
  },
];

// Signup steps
enum SignupStep {
  UNIVERSITY_SELECTION = 1,
  EMAIL_VERIFICATION = 2,
  PROFILE_SETUP = 3,
  PASSWORD_CREATION = 4
}

export default function SignUpScreen() {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.UNIVERSITY_SELECTION);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactSchoolName, setContactSchoolName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  
  // Email verification step
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationInputRefs] = useState(() => 
    Array(6).fill(0).map(() => React.createRef<TextInput>())
  );
  
  // Profile setup step
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [major, setMajor] = useState('');
  
  // Password creation step
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const progressAnim = useState(new Animated.Value((currentStep - 1) / 3))[0];
  
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Only show universities when user is searching
    if (searchQuery.trim() === '') {
      setFilteredUniversities([]);
    } else {
      const filtered = universities.filter(
        university => 
          university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          university.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Generate username from full name
    if (fullName) {
      const nameParts = fullName.toLowerCase().split(' ');
      if (nameParts.length > 1) {
        setUsername(nameParts[0] + nameParts[nameParts.length - 1].charAt(0));
      } else {
        setUsername(nameParts[0]);
      }
    }
  }, [fullName]);

  useEffect(() => {
    // Calculate password strength
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    // Animate progress bar when step changes
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / 3,
      duration: 300,
      useNativeDriver: false
    }).start();

    // Animate transition between steps
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ])
    ]).start();
  }, [currentStep]);

  const handleUniversitySelect = (university: University) => {
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    setSelectedUniversity(university);
    setEmail('');
  };

  const handleClearSelection = () => {
    setSelectedUniversity(null);
    setEmail('');
  };

  const handleVerificationCodeChange = (text: string, index: number) => {
    // Update the code at the current index
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    
    // Auto-advance to next input if current input is filled
    if (text.length === 1 && index < 5) {
      verificationInputRefs[index + 1].current?.focus();
    }
  };

  const handleVerificationCodeKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !verificationCode[index]) {
      verificationInputRefs[index - 1].current?.focus();
    }
  };

  const handleContinue = () => {
    if (currentStep === SignupStep.UNIVERSITY_SELECTION) {
      if (!selectedUniversity) {
        return;
      }

      if (!email.trim()) {
        return;
      }

      const emailDomain = email.split('@')[1];
      if (emailDomain !== selectedUniversity.domain) {
        // Show error or alert that email domain doesn't match
        return;
      }

      setIsLoading(true);

      // Simulate API call to send verification code
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(SignupStep.EMAIL_VERIFICATION);
      }, 1500);
    } 
    else if (currentStep === SignupStep.EMAIL_VERIFICATION) {
      const code = verificationCode.join('');
      if (code.length !== 6) {
        setVerificationError('Please enter a valid 6-digit code');
        return;
      }
      
      setIsLoading(true);
      
      // Simulate API call to verify code
      setTimeout(() => {
        setIsLoading(false);
        setVerificationError('');
        setCurrentStep(SignupStep.PROFILE_SETUP);
      }, 1500);
    }
    else if (currentStep === SignupStep.PROFILE_SETUP) {
      if (!fullName.trim()) {
        return;
      }
      
      if (!username.trim()) {
        return;
      }
      
      setCurrentStep(SignupStep.PASSWORD_CREATION);
    }
    else if (currentStep === SignupStep.PASSWORD_CREATION) {
      if (passwordStrength < 3) {
        return;
      }
      
      if (password !== confirmPassword) {
        return;
      }
      
      setIsLoading(true);
      
      // Simulate API call to create account
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/');
      }, 1500);
    }
  };

  const handleResendCode = () => {
    setIsResendingCode(true);
    
    // Simulate API call to resend code
    setTimeout(() => {
      setIsResendingCode(false);
      // Show success message
    }, 1500);
  };

  const handleSubmitContact = () => {
    if (!contactEmail.trim() || !contactSchoolName.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowContactModal(false);
      setContactEmail('');
      setContactSchoolName('');
      setContactMessage('');
      // Show success message
      alert('Thank you! We\'ll reach out to your school to add them to our platform.');
    }, 1500);
  };

  const renderUniversityItem = ({ item }: { item: University }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.universityCard,
          { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
        ]}
        onPress={() => handleUniversitySelect(item)}
      >
        <Image source={{ uri: item.logo }} style={styles.universityLogo} />
        <View style={styles.universityInfo}>
          <Text style={[styles.universityName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {item.name}
          </Text>
          <Text style={[styles.universityLocation, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const getStrengthColor = (strength: number): string => {
    if (strength <= 1) return '#EF4444'; // Red
    if (strength <= 3) return '#F59E0B'; // Amber
    return '#10B981'; // Green
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength === 0) return 'No password';
    if (strength <= 1) return 'Very weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    if (strength <= 4) return 'Strong';
    return 'Very strong';
  };

  const renderStepContent = () => {
    return (
      <Animated.View 
        style={[
          styles.stepContent,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {currentStep === SignupStep.UNIVERSITY_SELECTION && (
          <>
            {!selectedUniversity ? (
              <>
                <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    style={[styles.searchInput, { color: isDark ? '#E5E7EB' : '#1F2937', ...Platform.select({ web: { outlineStyle: 'none' } }) }]}
                    placeholder="Search for your university..."
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <X size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </TouchableOpacity>
                  )}
                </View>

                {searchQuery.trim() !== '' && (
                  <FlatList
                    data={filteredUniversities}
                    renderItem={renderUniversityItem}
                    keyExtractor={(item) => item.id}
                    style={styles.universitiesList}
                    contentContainerStyle={styles.universitiesListContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                          No universities found matching "{searchQuery}"
                        </Text>
                        <TouchableOpacity
                          style={[styles.contactButton, { backgroundColor: '#3B82F6' }]}
                          onPress={() => setShowContactModal(true)}
                        >
                          <Mail size={18} color="#FFFFFF" />
                          <Text style={styles.contactButtonText}>Contact Us to Add Your School</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  />
                )}
              </>
            ) : (
              <View style={styles.selectedUniversityContainer}>
                <View style={[
                  styles.selectedUniversityCard,
                  { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
                ]}>
                  <TouchableOpacity
                    style={[styles.clearButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                    onPress={handleClearSelection}
                  >
                    <X size={20} color={isDark ? '#E5E7EB' : '#4B5563'} />
                  </TouchableOpacity>

                  <Image source={{ uri: selectedUniversity.logo }} style={styles.selectedUniversityLogo} />
                  <Text style={[styles.selectedUniversityName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    {selectedUniversity.name}
                  </Text>
                  <Text style={[styles.selectedUniversityLocation, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    {selectedUniversity.location}
                  </Text>

                  <View style={styles.emailContainer}>
                    <Text style={[styles.emailLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                      Enter your university email
                    </Text>
                    <View style={[
                      styles.emailInputContainer,
                      { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                    ]}>
                      <Mail size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                      <TextInput
                        style={[styles.emailInput, { color: isDark ? '#E5E7EB' : '#1F2937', ...Platform.select({ web: { outlineStyle: 'none' } }) }]}
                        placeholder={`yourname@${selectedUniversity.domain}`}
                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {currentStep === SignupStep.EMAIL_VERIFICATION && (
          <View style={styles.verificationContainer}>
            <View style={[
              styles.verificationCard,
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
            ]}>
              {verificationError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{verificationError}</Text>
                </View>
              ) : null}
              
              <View style={styles.verificationHeader}>
                <CheckCircle size={40} color="#10B981" />
                <Text style={[styles.verificationHeaderText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Check your inbox
                </Text>
                <Text style={[styles.verificationSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  We've sent a verification code to {email}
                </Text>
              </View>
              
              <View style={styles.codeInputContainer}>
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={verificationInputRefs[index]}
                    style={[
                      styles.codeInput,
                      { 
                        backgroundColor: isDark ? '#0F172A' : '#F9FAFB', 
                        color: isDark ? '#E5E7EB' : '#1F2937', 
                        borderColor: digit ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                        ...Platform.select({ web: { outlineStyle: 'none' } })
                      }
                    ]}
                    value={digit}
                    onChangeText={(text) => handleVerificationCodeChange(text, index)}
                    onKeyPress={(e) => handleVerificationCodeKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendCode}
                disabled={isResendingCode}
              >
                {isResendingCode ? (
                  <ActivityIndicator size="small" color={isDark ? '#60A5FA' : '#3B82F6'} />
                ) : (
                  <Text style={[styles.resendButtonText, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                    Didn't receive a code? Resend
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === SignupStep.PROFILE_SETUP && (
          <View style={styles.profileContainer}>
            <View style={[
              styles.profileCard,
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
            ]}>
              <TouchableOpacity style={styles.avatarUpload}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                  {fullName ? (
                    <Text style={[styles.avatarInitials, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                      {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Text>
                  ) : (
                    <Camera size={32} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  )}
                </View>
                <Text style={[styles.avatarUploadText, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                  Add Photo
                </Text>
              </TouchableOpacity>
              
              <View style={styles.profileInputGroup}>
                <Text style={[styles.profileInputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Full Name
                </Text>
                <View style={styles.inputWithIcon}>
                  <User size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  <TextInput
                    style={[
                      styles.profileInput,
                      { 
                        backgroundColor: isDark ? '#0F172A' : '#F9FAFB', 
                        color: isDark ? '#E5E7EB' : '#1F2937', 
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        ...Platform.select({ web: { outlineStyle: 'none' } })
                      }
                    ]}
                    placeholder="Your full name"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              
              <View style={styles.profileInputGroup}>
                <Text style={[styles.profileInputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Username
                </Text>
                <View style={styles.inputWithIcon}>
                  <AtSign size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  <TextInput
                    style={[
                      styles.profileInput,
                      { 
                        backgroundColor: isDark ? '#0F172A' : '#F9FAFB', 
                        color: isDark ? '#E5E7EB' : '#1F2937', 
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        ...Platform.select({ web: { outlineStyle: 'none' } })
                      }
                    ]}
                    placeholder="Choose a username"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.profileInputGroup}>
                <Text style={[styles.profileInputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Major/Field of Study
                </Text>
                <View style={styles.inputWithIcon}>
                  <GraduationCap size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  <TextInput
                    style={[
                      styles.profileInput,
                      { 
                        backgroundColor: isDark ? '#0F172A' : '#F9FAFB', 
                        color: isDark ? '#E5E7EB' : '#1F2937', 
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        ...Platform.select({ web: { outlineStyle: 'none' } })
                      }
                    ]}
                    placeholder="e.g., Computer Science"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={major}
                    onChangeText={setMajor}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {currentStep === SignupStep.PASSWORD_CREATION && (
          <View style={styles.passwordContainer}>
            <View style={[
              styles.passwordCard,
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
            ]}>
              <View style={styles.passwordHeader}>
                <Lock size={40} color="#3B82F6" />
                <Text style={[styles.passwordTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Secure Your Account
                </Text>
                <Text style={[styles.passwordSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Create a strong password to protect your account
                </Text>
              </View>
              
              <View style={styles.passwordInputGroup}>
                <Text style={[styles.passwordInputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Password
                </Text>
                <View style={[
                  styles.passwordInputContainer,
                  { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                ]}>
                  <Key size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  <TextInput
                    style={[styles.passwordInput, { color: isDark ? '#E5E7EB' : '#1F2937', ...Platform.select({ web: { outlineStyle: 'none' } }) }]}
                    placeholder="Create a password"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    ) : (
                      <Eye size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.strengthMeterContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View 
                        key={level}
                        style={[
                          styles.strengthBar,
                          { 
                            backgroundColor: passwordStrength >= level ? 
                              getStrengthColor(passwordStrength) : 
                              (isDark ? '#374151' : '#E5E7EB') 
                          }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[
                    styles.strengthText, 
                    { color: passwordStrength > 0 ? getStrengthColor(passwordStrength) : (isDark ? '#9CA3AF' : '#6B7280') }
                  ]}>
                    {getStrengthLabel(passwordStrength)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.passwordInputGroup}>
                <Text style={[styles.passwordInputLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Confirm Password
                </Text>
                <View style={[
                  styles.passwordInputContainer,
                  { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' }
                ]}>
                  <Key size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                  <TextInput
                    style={[styles.passwordInput, { color: isDark ? '#E5E7EB' : '#1F2937', ...Platform.select({ web: { outlineStyle: 'none' } }) }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
                {password && confirmPassword && password !== confirmPassword && (
                  <Text style={styles.passwordMismatchText}>
                    Passwords don't match
                  </Text>
                )}
              </View>
              
              <View style={styles.passwordRequirements}>
                <Text style={[styles.requirementsTitle, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Password Requirements:
                </Text>
                <View style={styles.requirementList}>
                  <View style={styles.requirementItem}>
                    <View style={[
                      styles.checkCircle, 
                      { 
                        backgroundColor: password.length >= 8 ? '#10B981' : 'transparent',
                        borderColor: password.length >= 8 ? '#10B981' : (isDark ? '#4B5563' : '#D1D5DB')
                      }
                    ]}>
                      {password.length >= 8 && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.requirementText, 
                      { 
                        color: password.length >= 8 ? '#10B981' : (isDark ? '#E5E7EB' : '#4B5563')
                      }
                    ]}>
                      At least 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <View style={[
                      styles.checkCircle, 
                      { 
                        backgroundColor: /[A-Z]/.test(password) ? '#10B981' : 'transparent',
                        borderColor: /[A-Z]/.test(password) ? '#10B981' : (isDark ? '#4B5563' : '#D1D5DB')
                      }
                    ]}>
                      {/[A-Z]/.test(password) && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.requirementText, 
                      { 
                        color: /[A-Z]/.test(password) ? '#10B981' : (isDark ? '#E5E7EB' : '#4B5563')
                      }
                    ]}>
                      At least one uppercase letter
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <View style={[
                      styles.checkCircle, 
                      { 
                        backgroundColor: /[0-9]/.test(password) ? '#10B981' : 'transparent',
                        borderColor: /[0-9]/.test(password) ? '#10B981' : (isDark ? '#4B5563' : '#D1D5DB')
                      }
                    ]}>
                      {/[0-9]/.test(password) && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.requirementText, 
                      { 
                        color: /[0-9]/.test(password) ? '#10B981' : (isDark ? '#E5E7EB' : '#4B5563')
                      }
                    ]}>
                      At least one number
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <View style={[
                      styles.checkCircle, 
                      { 
                        backgroundColor: /[^A-Za-z0-9]/.test(password) ? '#10B981' : 'transparent',
                        borderColor: /[^A-Za-z0-9]/.test(password) ? '#10B981' : (isDark ? '#4B5563' : '#D1D5DB')
                      }
                    ]}>
                      {/[^A-Za-z0-9]/.test(password) && <CheckCircle size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.requirementText, 
                      { 
                        color: /[^A-Za-z0-9]/.test(password) ? '#10B981' : (isDark ? '#E5E7EB' : '#4B5563')
                      }
                    ]}>
                      At least one special character
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  const isContinueEnabled = () => {
    switch (currentStep) {
      case SignupStep.UNIVERSITY_SELECTION:
        return selectedUniversity && email.trim() && email.includes('@') && email.endsWith(selectedUniversity.domain);
      case SignupStep.EMAIL_VERIFICATION:
        return verificationCode.every(digit => digit.length === 1);
      case SignupStep.PROFILE_SETUP:
        return fullName.trim() && username.trim();
      case SignupStep.PASSWORD_CREATION:
        return passwordStrength >= 3 && password === confirmPassword;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* App Logo and Branding */}
        <View style={styles.brandingHeader}>
          <View style={[styles.logoContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <GraduationCap size={32} color="#3B82F6" />
          </View>
          <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Semster
          </Text>
        </View>
        
        {/* Step Title */}
        <View style={styles.stepTitleContainer}>
          <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {currentStep === SignupStep.UNIVERSITY_SELECTION && 'Select Your School'}
            {currentStep === SignupStep.EMAIL_VERIFICATION && 'Verify Your Email'}
            {currentStep === SignupStep.PROFILE_SETUP && 'Create Your Profile'}
            {currentStep === SignupStep.PASSWORD_CREATION && 'Secure Your Account'}
          </Text>
          <Text style={[styles.stepDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {currentStep === SignupStep.UNIVERSITY_SELECTION && 'Find your university to get started'}
            {currentStep === SignupStep.EMAIL_VERIFICATION && 'Enter the 6-digit code sent to your email'}
            {currentStep === SignupStep.PROFILE_SETUP && 'Tell us a bit about yourself'}
            {currentStep === SignupStep.PASSWORD_CREATION && 'Create a strong password to protect your account'}
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: '#3B82F6',
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
        
        {/* Step Content */}
        {renderStepContent()}

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            { 
              backgroundColor: isContinueEnabled() ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
              opacity: isContinueEnabled() ? 1 : 0.5
            }
          ]}
          onPress={handleContinue}
          disabled={!isContinueEnabled() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[
                styles.continueButtonText,
                { 
                  color: isContinueEnabled() ? 
                    '#FFFFFF' : 
                    (isDark ? '#9CA3AF' : '#6B7280')
                }
              ]}>
                {currentStep === SignupStep.PASSWORD_CREATION ? 'Create Account' : 'Continue'}
              </Text>
              <ArrowRight size={20} color={
                isContinueEnabled() ? 
                  '#FFFFFF' : 
                  (isDark ? '#9CA3AF' : '#6B7280')
              } />
            </>
          )}
        </TouchableOpacity>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.stepIndicatorWrapper}>
              <View 
                style={[
                  styles.stepIndicator,
                  { 
                    backgroundColor: currentStep >= step ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
                    borderColor: currentStep === step ? '#3B82F6' : 'transparent',
                  }
                ]}
              >
                {currentStep > step && (
                  <CheckCircle size={16} color="#FFFFFF" />
                )}
                {currentStep === step && (
                  <Text style={styles.currentStepText}>{step}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel, 
                { 
                  color: currentStep >= step ? 
                    (isDark ? '#FFFFFF' : '#111827') : 
                    (isDark ? '#9CA3AF' : '#6B7280')
                }
              ]}>
                {step === 1 && 'School'}
                {step === 2 && 'Verify'}
                {step === 3 && 'Profile'}
                {step === 4 && 'Secure'}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Sign In Link */}
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

        {/* Contact Modal */}
        {showContactModal && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Add Your School
                </Text>
                <TouchableOpacity onPress={() => setShowContactModal(false)}>
                  <X size={24} color={isDark ? '#E5E7EB' : '#4B5563'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                We'll reach out to your school's administration to add them to our platform.
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Your Email
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', color: isDark ? '#E5E7EB' : '#1F2937', borderColor: isDark ? '#374151' : '#E5E7EB', ...Platform.select({ web: { outlineStyle: 'none' } }) }
                  ]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  School Name
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', color: isDark ? '#E5E7EB' : '#1F2937', borderColor: isDark ? '#374151' : '#E5E7EB', ...Platform.select({ web: { outlineStyle: 'none' } }) }
                  ]}
                  placeholder="University name"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={contactSchoolName}
                  onChangeText={setContactSchoolName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                  Additional Information (Optional)
                </Text>
                <TextInput
                  style={[
                    styles.formTextarea,
                    { backgroundColor: isDark ? '#0F172A' : '#F9FAFB', color: isDark ? '#E5E7EB' : '#1F2937', borderColor: isDark ? '#374151' : '#E5E7EB', ...Platform.select({ web: { outlineStyle: 'none' } }) }
                  ]}
                  placeholder="Any additional details about your school..."
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={contactMessage}
                  onChangeText={setContactMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { 
                    backgroundColor: contactEmail.trim() && contactSchoolName.trim() ? 
                      '#3B82F6' : 
                      (isDark ? '#374151' : '#E5E7EB'),
                    opacity: contactEmail.trim() && contactSchoolName.trim() ? 1 : 0.5
                  }
                ]}
                onPress={handleSubmitContact}
                disabled={!contactEmail.trim() || !contactSchoolName.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.submitButtonText,
                    { 
                      color: contactEmail.trim() && contactSchoolName.trim() ? 
                        '#FFFFFF' : 
                        (isDark ? '#9CA3AF' : '#6B7280')
                    }
                  ]}>
                    Submit Request
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    padding: 20,
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  stepTitleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    maxWidth: '80%',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  universitiesList: {
    flex: 1,
  },
  universitiesListContent: {
    paddingBottom: 20,
  },
  universityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  universityLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  universityLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  selectedUniversityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedUniversityCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
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
  clearButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedUniversityLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedUniversityName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectedUniversityLocation: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  emailContainer: {
    width: '100%',
  },
  emailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepIndicatorWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  currentStepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  signInLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 120,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  verificationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  verificationHeaderText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  verificationSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  resendButton: {
    alignSelf: 'center',
    padding: 8,
  },
  resendButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  avatarUpload: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitials: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
  },
  avatarUploadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  profileInputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  profileInputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  profileInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  passwordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  passwordHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  passwordTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  passwordSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  passwordInputGroup: {
    marginBottom: 20,
  },
  passwordInputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  strengthMeterContainer: {
    marginTop: 12,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  passwordMismatchText: {
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  passwordRequirements: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  requirementList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});