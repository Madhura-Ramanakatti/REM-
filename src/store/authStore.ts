import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_USERS } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),

      signIn: async (email, password) => {
        if (!isSupabaseConfigured) {
          // Mock auth: find user by email/password
          const found = MOCK_USERS.find(u => u.email === email && u.password === password);
          if (!found) throw new Error('Invalid email or password');
          set({ user: found, isAuthenticated: true, isLoading: false });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      signUp: async (email, password, name) => {
        if (!isSupabaseConfigured) {
          // Mock signup
          const newUser: User = {
            id: `u${Date.now()}`,
            name,
            email,
            password,
            role: 'user' as UserRole,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            phone: '',
            joinedAt: new Date().toISOString().split('T')[0],
          };
          MOCK_USERS.push(newUser);
          return;
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name,
              email,
              role: 'user',
            });
          if (profileError) throw profileError;
        }
      },

      logout: async () => {
        if (isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        set({ user: null, isAuthenticated: false });
      },

      initialize: async () => {
        set({ isLoading: true });

        if (!isSupabaseConfigured) {
          // In dev mode without Supabase, just mark as loaded.
          // User will log in via mock credentials.
          set({ isLoading: false });
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({
              user: {
                id: session.user.id,
                name: profile.name,
                email: session.user.email!,
                role: profile.role as UserRole,
                avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                phone: '',
                joinedAt: profile.joined_at,
                password: '',
              },
              isAuthenticated: true,
            });
          }
        }
        set({ isLoading: false });

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              set({
                user: {
                  id: session.user.id,
                  name: profile.name,
                  email: session.user.email!,
                  role: profile.role as UserRole,
                  avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                  phone: '',
                  joinedAt: profile.joined_at,
                  password: '',
                },
                isAuthenticated: true,
              });
            }
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, isAuthenticated: false });
          }
        });
      },
    }),
    { name: 'auth-store' }
  )
);
