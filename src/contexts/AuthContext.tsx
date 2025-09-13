
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface User {
  id: string;
  fullName: string;
  email: string;
  totalPortfolio: number;
  profit: number;
  bonus: number;
  deposit: number;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  sex: string;
  dateOfBirth: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (signupData: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Defer profile fetching to prevent deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', authUser.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, user still gets basic info
        setUser({
          id: authUser.id,
          fullName: authUser.user_metadata?.full_name || 'User',
          email: authUser.email || '',
          totalPortfolio: 0,
          profit: 0,
          bonus: 0,
          deposit: 0
        });
      } else if (profile) {
        setUser({
          id: authUser.id,
          fullName: profile.full_name,
          email: authUser.email || '',
          totalPortfolio: Number(profile.total_portfolio || 0),
          profit: Number(profile.profit || 0),
          bonus: Number(profile.bonus || 0),
          deposit: Number(profile.deposit || 0)
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed');
        return false;
      }
      
      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        toast.success('Login successful!');
        return true;
      }
      
      toast.error('Login failed - no user returned');
      return false;
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting signup for:', signupData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email.trim(),
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName.trim(),
            phone_number: signupData.phoneNumber,
            country: signupData.country,
            sex: signupData.sex,
            date_of_birth: signupData.dateOfBirth,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Signup failed');
        return false;
      }

      if (data.user && data.session) {
        console.log('Signup successful for user:', data.user.id);
        
        // Update the profile with additional fields
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone_number: signupData.phoneNumber,
            country: signupData.country,
            sex: signupData.sex,
            date_of_birth: signupData.dateOfBirth,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        toast.success('Account created successfully! Welcome to Veridian Assets.');
        return true;
      } else if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!');
        return true;
      }

      toast.error('Signup failed - no user returned');
      return false;
    } catch (error) {
      console.error('Signup exception:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
