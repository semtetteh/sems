import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<{ error: any }>;
  updateProfile: (data: { username?: string, full_name?: string, avatar_url?: string }) => Promise<{ error: any }>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  signUpData: {
    school?: string;
    email?: string;
    username?: string;
    fullName?: string;
    avatarUrl?: string;
    password?: string;
  };
  updateSignUpData: (data: Partial<AuthContextType['signUpData']>) => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  verifyOtp: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  currentStep: 1,
  setCurrentStep: () => {},
  signUpData: {},
  updateSignUpData: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<AuthContextType['signUpData']>({});

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        router.replace('/(app)');
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (data: { username?: string, full_name?: string, avatar_url?: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...data,
          updated_at: new Date(),
        });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateSignUpData = (data: Partial<AuthContextType['signUpData']>) => {
    setSignUpData(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        verifyOtp,
        updateProfile,
        currentStep,
        setCurrentStep,
        signUpData,
        updateSignUpData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);