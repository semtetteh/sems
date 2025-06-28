import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SignUpIntroScreen() {
  const { isDark } = useTheme();
  const { setCurrentStep } = useAuth();
  
  useEffect(() => {
    // Reset to step 1 when entering signup flow
    setCurrentStep(1);
  }, []);

  const handleGetStarted = () => {
    router.push('/signup/school-selection');
  };

  const handleSignIn = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.logoContainer}
        >
          <View style={[styles.logoCircle, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <GraduationCap size={48} color={isDark ? '#60A5FA' : '#3B82F6'} />
          </View>
          <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Semster
          </Text>
          <Text style={[styles.tagline, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Connect. Learn. Thrive.
          </Text>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {[
            {
              icon: <Sparkles size={24} color="#FFFFFF" />,
              title: "Campus Community",
              description: "Connect with students and faculty at your school",
              color: "#3B82F6",
              delay: 400
            },
            {
              icon: <Sparkles size={24} color="#FFFFFF" />,
              title: "Academic Resources",
              description: "Access study materials and collaborate on projects",
              color: "#10B981",
              delay: 600
            },
            {
              icon: <Sparkles size={24} color="#FFFFFF" />,
              title: "Campus Events",
              description: "Stay updated on events and activities on campus",
              color: "#F59E0B",
              delay: 800
            }
          ].map((feature, index) => (
            <Animated.View 
              key={index}
              entering={FadeInRight.delay(feature.delay).duration(800)}
              style={[styles.featureCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                {feature.icon}
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {feature.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View 
          entering={FadeInDown.delay(1000).duration(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={[styles.getStartedButton, { backgroundColor: '#3B82F6' }]}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

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
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
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
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  featuresContainer: {
    marginVertical: 40,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  signInLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});