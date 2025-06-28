import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, ArrowRight, MapPin, School } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

// Mock data for schools
const mockSchools = [
  {
    id: '1',
    name: 'University of Ghana',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Kwame Nkrumah University of Science and Technology',
    location: 'Kumasi, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    name: 'University of Cape Coast',
    location: 'Cape Coast, Ghana',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    name: 'Ashesi University',
    location: 'Berekuso, Ghana',
    logo: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '5',
    name: 'Ghana Institute of Management and Public Administration',
    location: 'Accra, Ghana',
    logo: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function SchoolSelectionScreen() {
  const { isDark } = useTheme();
  const { currentStep, setCurrentStep, updateSignUpData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState(mockSchools);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep(1);
  }, []);

  useEffect(() => {
    // Simulate API call for searching schools
    if (searchQuery) {
      setIsLoading(true);
      setTimeout(() => {
        const filteredSchools = mockSchools.filter(
          school => 
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSchools(filteredSchools);
        setIsLoading(false);
      }, 500);
    } else {
      setSchools(mockSchools);
    }
  }, [searchQuery]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (selectedSchool) {
      const school = schools.find(s => s.id === selectedSchool);
      if (school) {
        updateSignUpData({ school: school.name });
        router.push('/signup/email-verification');
      }
    }
  };

  const renderSchoolItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.schoolCard,
        { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
        selectedSchool === item.id && { borderColor: '#3B82F6', borderWidth: 2 }
      ]}
      onPress={() => setSelectedSchool(item.id)}
    >
      <Image source={{ uri: item.logo }} style={styles.schoolLogo} />
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <View style={styles.header}>
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
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Select Your School
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Connect with your campus community
        </Text>

        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#E5E7EB' : '#1F2937' }]}
            placeholder="Search for your school"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : schools.length > 0 ? (
          <FlatList
            data={schools}
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
      </View>

      <View style={styles.footer}>
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
      </View>
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    marginBottom: 24,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolsList: {
    paddingBottom: 24,
  },
  schoolCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  schoolLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
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
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});