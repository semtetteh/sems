import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function DeploymentStatusScreen() {
  const { isDark } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDeploymentStatus = async () => {
    try {
      setIsRefreshing(true);
      
      // In a real implementation, this would be an API call to check deployment status
      // For demo purposes, we'll simulate a successful deployment after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a successful deployment
      setStatus('success');
      setDeployUrl('https://your-deployed-app.netlify.app');
      
      // Uncomment to simulate an error
      // setStatus('error');
      // setErrorMessage('Deployment failed due to build errors');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to fetch deployment status');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeploymentStatus();
  }, []);

  const handleRefresh = () => {
    fetchDeploymentStatus();
  };

  const handleVisitSite = () => {
    if (deployUrl) {
      // In a real app, use Linking.openURL(deployUrl)
      console.log(`Opening URL: ${deployUrl}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={isDark ? '#E5E7EB' : '#4B5563'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Deployment Status
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statusContainer}>
            {status === 'loading' ? (
              <>
                <ActivityIndicator size="large" color="#3B82F6" style={styles.statusIcon} />
                <Text style={[styles.statusTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Deployment in Progress
                </Text>
                <Text style={[styles.statusDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Your app is being deployed. This may take a few minutes.
                </Text>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle size={64} color="#10B981" style={styles.statusIcon} />
                <Text style={[styles.statusTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Deployment Successful!
                </Text>
                <Text style={[styles.statusDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Your app has been successfully deployed and is now live.
                </Text>
                
                <View style={[styles.urlContainer, { backgroundColor: isDark ? '#0F172A' : '#F3F4F6' }]}>
                  <Text style={[styles.urlText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
                    {deployUrl}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.visitButton, { backgroundColor: '#3B82F6' }]}
                  onPress={handleVisitSite}
                >
                  <ExternalLink size={20} color="#FFFFFF" />
                  <Text style={styles.visitButtonText}>Visit Site</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <XCircle size={64} color="#EF4444" style={styles.statusIcon} />
                <Text style={[styles.statusTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Deployment Failed
                </Text>
                <Text style={[styles.statusDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {errorMessage || 'There was an error deploying your app.'}
                </Text>
                
                <View style={[styles.errorContainer, { backgroundColor: isDark ? '#0F172A' : '#FEF2F2' }]}>
                  <Text style={[styles.errorText, { color: isDark ? '#F87171' : '#B91C1C' }]}>
                    Check your build logs for more information on what went wrong.
                  </Text>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.refreshButton, 
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
              isRefreshing && { opacity: 0.7 }
            ]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw 
              size={20} 
              color={isDark ? '#E5E7EB' : '#4B5563'} 
            />
            <Text style={[styles.refreshButtonText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
              {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            What happens during deployment?
          </Text>
          <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            When you deploy your app, the following steps occur:
          </Text>
          
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                <Text style={[styles.stepNumberText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Build Process
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Your code is compiled and optimized for production.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                <Text style={[styles.stepNumberText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Asset Optimization
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Images and other assets are compressed and optimized.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                <Text style={[styles.stepNumberText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Deployment
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Your app is deployed to a global CDN for fast access.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  card: {
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  urlContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  urlText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  visitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});