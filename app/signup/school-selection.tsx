import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, ArrowRight, MapPin, School, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Animated, { FadeInDown, FadeInUp, FadeIn, useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Mock data for schools
const mockSchools = [
  {
    id: '1',
    name: 'University of Ghana',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: true,
  },
  {
    id: '2',
    name: 'Kwame Nkrumah University of Science and Technology',
    location: 'Kumasi, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
  {
    id: '3',
    name: 'University of Cape Coast',
    location: 'Cape Coast, Ghana',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: true,
  },
  {
    id: '4',
    name: 'Ashesi University',
    location: 'Berekuso, Ghana',
    logo: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
  {
    id: '5',
    name: 'Ghana Institute of Management and Public Administration',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
  {
    id: '6',
    name: 'University of Professional Studies',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
  {
    id: '7',
    name: 'Central University',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
  {
    id: '8',
    name: 'University of Education',
    location: 'Winneba, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
    featured: false,
  },
];

export default function SchoolSelectionScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, updateSignUpData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<typeof mockSchools>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [featuredSchools, setFeaturedSchools] = useState<typeof mockSchools>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Animation values
  const searchBarWidth = useSharedValue('90%');
  const searchBarBorderRadius = useSharedValue(50);
  const resultsOpacity = useSharedValue(0);
  const searchIconScale = useSharedValue(1);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(1);
    
    // Set featured schools
    setFeaturedSchools(mockSchools.filter(school => school.featured));
  }, []);

  useEffect(() => {
    // Filter schools based on search query
    if (searchQuery) {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = mockSchools.filter(
          school => 
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSchools(filtered);
        setIsLoading(false);
        
        // Show results with animation
        if (!showResults) {
          setShowResults(true);
          searchBarWidth.value = withTiming('100%');
          searchBarBorderRadius.value = withTiming(16);
          resultsOpacity.value = withTiming(1);
        }
      }, 500);
    } else {
      setFilteredSchools([]);
      
      // Hide results with animation
      if (showResults) {
        setShowResults(false);
        searchBarWidth.value = withTiming('90%');
        searchBarBorderRadius.value = withTiming(50);
        resultsOpacity.value = withTiming(0);
      }
    }
  }, [searchQuery]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (selectedSchool) {
      const school = mockSchools.find(s => s.id === selectedSchool);
      if (school) {
        updateSignUpData({ school: school.name });
        router.push('/signup/email-verification');
      }
    }
  };

  const handleSearchFocus = () => {
    searchIconScale.value = withSpring(1.2);
    setTimeout(() => {
      searchIconScale.value = withSpring(1);
    }, 300);
  };

  const renderSchoolItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(400)}
    >
      <TouchableOpacity
        style={[
          styles.schoolCard,
          { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
          selectedSchool === item.id && { borderColor: '#3B82F6', borderWidth: 2 }
        ]}
        onPress={() => setSelectedSchool(item.id)}
      >
        <View style={styles.schoolInfo}>
          <Text 
            style={[styles.schoolName, { color: isDark ? '#FFFFFF' : '#111827' }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.schoolLocation, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {item.location}
            </Text>
          </View>
        </View>
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  // Animated styles
  const searchContainerStyle = useAnimatedStyle(() => ({
    width: searchBarWidth.value,
    borderRadius: searchBarBorderRadius.value,
  }));

  const searchIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchIconScale.value }]
  }));

  const resultsContainerStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
    transform: [{ 
      translateY: resultsOpacity.value === 0 ? 20 : 0 
    }]
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#E5E7EB' : '#4B5563'} />
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
          <View style={[styles.stepDot, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <Text style={[styles.stepNumber, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>2</Text>
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
          Select Your School
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Connect with your campus community
        </Text>

        <View style={styles.searchSection}>
          <Animated.View 
            style={[
              styles.searchContainer, 
              { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
              searchContainerStyle
            ]}
          >
            <Animated.View style={searchIconStyle}>
              <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </Animated.View>
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
              placeholder="Search for your school"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
            />
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.schoolsContainer,
            resultsContainerStyle,
            { display: showResults ? 'flex' : 'none' }
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={[styles.loadingText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                Searching schools...
              </Text>
            </View>
          ) : filteredSchools.length > 0 ? (
            <FlatList
              data={filteredSchools}
              renderItem={renderSchoolItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.schoolsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <School size={48} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.emptyStateText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                No schools found matching "{searchQuery}"
              </Text>
            </View>
          )}
        </Animated.View>

        {!showResults && (
          <Animated.View 
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.schoolsPrompt}
          >
            <School size={64} color={isDark ? '#60A5FA' : '#3B82F6'} />
            <Text style={[styles.promptTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Find Your School
            </Text>
            <Text style={[styles.promptText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Search for your university or college to connect with your campus community
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.delay(600).duration(500)}
        style={styles.footer}
      >
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            { 
              backgroundColor: selectedSchool ? '#3B82F6' : (isDark ? '#374151' : '#E5E7EB'),
              opacity: selectedSchool ? 1 : 0.5
            }
          ]}
          onPress={handleContinue}
          disabled={!selectedSchool}
        >
          <Text style={[
            styles.continueButtonText,
            { color: selectedSchool ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280') }
          ]}>
            Continue
          </Text>
          <ArrowRight size={20} color={selectedSchool ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')} />
        </TouchableOpacity>
      </Animated.View>
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
  searchSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
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
  schoolsContainer: {
    flex: 1,
  },
  schoolsList: {
    paddingBottom: 24,
  },
  schoolCard: {
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
    position: 'relative',
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: '80%',
  },
  schoolsPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  promptTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
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