import React, { createContext, useContext, useState, useEffect } from 'react';
import { PGListing, FilterState, UserProfile, TabType, StoredAccount } from '../types';
import { INITIAL_LISTINGS } from '../data/mockListings';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  listings: PGListing[];
  savedIds: string[];
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  accounts: StoredAccount[];
  activeTab: TabType;
  selectedListing: PGListing | null;
  editingListing: PGListing | null;
  filters: FilterState;
  toasts: ToastNotification[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setActiveTab: (tab: TabType) => void;
  setSelectedListing: (listing: PGListing | null) => void;
  setEditingListing: (listing: PGListing | null) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addListing: (listing: Omit<PGListing, 'id' | 'postedDate' | 'rating' | 'reviewsCount'>) => void;
  updateListing: (listing: PGListing) => void;
  deleteListing: (id: string) => void;
  toggleAvailability: (id: string) => void;
  adminToggleVerified: (id: string) => void;
  adminUpdateUser: (updatedUser: StoredAccount) => void;
  adminDeleteUser: (userId: string) => boolean;
  adminCreateUser: (newUser: StoredAccount) => boolean;
  adminResetPassword: (userId: string, newPassword: string) => boolean;
  adminResetAllData: () => void;
  adminExportData: () => string;
  adminImportData: (jsonData: string) => boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => boolean;
  registerUser: (profile: Omit<UserProfile, 'id'>, password?: string) => boolean;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  gender: 'all',
  sharing: 'all',
  roomType: 'all',
  maxRent: 10000,
  maxDistanceMeters: 3000,
  foodRequired: false,
  selectedAmenities: [],
  sortBy: 'recommended',
};

const DEFAULT_USER: UserProfile = {
  id: 'demo-user',
  name: 'Manthan Daundkar',
  email: 'manthandaundkar33@gmail.com',
  phone: '+91 97654 32190',
  role: 'admin',
  collegeBranch: 'Computer Engineering',
  year: 'Third Year (TE)',
};

const INITIAL_USERS: StoredAccount[] = [
  {
    id: 'demo-user',
    name: 'Manthan Daundkar',
    email: 'manthandaundkar33@gmail.com',
    phone: '+91 97654 32190',
    role: 'admin',
    collegeBranch: 'Computer Engineering',
    year: 'Third Year (TE)',
    password: 'manthan',
  },
  {
    id: 'student-tanmay',
    name: 'Tanmay Joshi',
    email: 'tanmay.joshi@nmiet.edu.in',
    phone: '+91 91580 44221',
    role: 'student',
    collegeBranch: 'Information Technology',
    year: 'Final Year (BE)',
    password: 'password123',
  },
  {
    id: 'student-shreya',
    name: 'Shreya Kulkarni',
    email: 'shreya.k@nmiet.edu.in',
    phone: '+91 98220 55114',
    role: 'student',
    collegeBranch: 'Computer Engineering',
    year: 'Second Year (SE)',
    password: 'password123',
  },
  {
    id: 'student-rohit',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@nmiet.edu.in',
    phone: '+91 98231 77620',
    role: 'student',
    collegeBranch: 'Mechanical Engineering',
    year: 'Third Year (TE)',
    password: 'password123',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<PGListing[]>(() => {
    try {
      const stored = localStorage.getItem('pg_finder_nmiet_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep all demo vacancies assigned to demo account posts
          return parsed.map((item: PGListing) => {
            const initial = INITIAL_LISTINGS.find((init) => init.id === item.id);
            const resolvedRoomType = item.roomType || initial?.roomType || '2 BHK';
            if (item.id.startsWith('pg-')) {
              return {
                ...item,
                ...(initial ? { title: initial.title, type: initial.type } : {}),
                roomType: resolvedRoomType,
                postedBy: 'demo-user',
                postedByName: 'Manthan (NMIET Student)',
              };
            }
            return {
              ...item,
              roomType: resolvedRoomType,
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_LISTINGS;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pg_finder_nmiet_saved');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return ['pg-1', 'pg-2'];
  });

  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const stored = localStorage.getItem('pg_finder_nmiet_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a: StoredAccount) =>
            a.id === 'demo-user' || a.email.toLowerCase() === 'manthandaundkar33@gmail.com'
              ? {
                  ...a,
                  name: 'Manthan Daundkar',
                  email: 'manthandaundkar33@gmail.com',
                  role: 'admin',
                  password: a.password || 'manthan',
                }
              : a
          );
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      // Clean up legacy auto-login if stored previously in localStorage
      localStorage.removeItem('pg_finder_nmiet_user');

      // Check current browser tab session
      const sessionStored = sessionStorage.getItem('pg_finder_nmiet_user');
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Default to null: do not keep signed in as admin when site opens
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [activeTab, setActiveTab] = useState<TabType>('explore');

  const isAdmin = Boolean(
    currentUser &&
      (currentUser.role === 'admin' ||
        currentUser.email.toLowerCase() === 'manthandaundkar33@gmail.com')
  );
  const [selectedListing, setSelectedListing] = useState<PGListing | null>(null);
  const [editingListing, setEditingListing] = useState<PGListing | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('pg_finder_nmiet_theme');
      if (stored) return stored === 'dark';
      return true; // Default to dark mode to match glowing themed cards
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('pg_finder_nmiet_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('pg_finder_nmiet_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Persist listings
  useEffect(() => {
    try {
      localStorage.setItem('pg_finder_nmiet_listings', JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  // Persist saved
  useEffect(() => {
    try {
      localStorage.setItem('pg_finder_nmiet_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }, [savedIds]);

  // Persist user session to sessionStorage (resets when closing browser or opening new window)
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('pg_finder_nmiet_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('pg_finder_nmiet_user');
      }
    } catch (e) {
      console.warn('Failed to save user session', e);
    }
  }, [currentUser]);

  // Persist accounts
  useEffect(() => {
    try {
      localStorage.setItem('pg_finder_nmiet_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts', e);
    }
  }, [accounts]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, password?: string): boolean => {
    const found = accounts.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) {
      // Auto-create friendly student session if not found
      const newAcc: StoredAccount = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        phone: '+91 98000 00000',
        role: 'student',
        collegeBranch: 'NMIET Engineering',
        year: 'Student',
        password: password || 'manthan',
      };
      setAccounts((prev) => [...prev, newAcc]);
      setCurrentUser(newAcc);
      showToast(`Welcome to PG Finder NMIET, ${newAcc.name}!`, 'success');
      closeAuthModal();
      return true;
    }

    if (found.password && password && found.password !== password) {
      showToast('Incorrect password. Please try again.', 'error');
      return false;
    }

    const { password: _, ...userSafe } = found;
    setCurrentUser(userSafe);
    showToast(`Logged in successfully as ${found.name}!`, 'success');
    closeAuthModal();
    return true;
  };

  const registerUser = (profile: Omit<UserProfile, 'id'>, password?: string): boolean => {
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === profile.email.trim().toLowerCase()
    );
    if (existing) {
      showToast('An account with this email already exists. Please login.', 'error');
      return false;
    }

    const newId = `user-${Date.now()}`;
    const newAccount: StoredAccount = {
      ...profile,
      id: newId,
      password: password || 'pass123',
    };

    setAccounts((prev) => [...prev, newAccount]);
    const { password: _, ...userSafe } = newAccount;
    setCurrentUser(userSafe);
    showToast(`Registration complete! Welcome, ${profile.name}.`, 'success');
    closeAuthModal();
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (activeTab === 'admin') {
      setActiveTab('explore');
    }
    showToast('You have been logged out.', 'info');
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved list', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Added to your shortlisted PGs!', 'success');
        return [...prev, id];
      }
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const addListing = (
    newListingData: Omit<PGListing, 'id' | 'postedDate' | 'rating' | 'reviewsCount'>
  ) => {
    const newListing: PGListing = {
      ...newListingData,
      id: `pg-${Date.now()}`,
      postedDate: 'Today',
      rating: 5.0,
      reviewsCount: 1,
    };
    setListings((prev) => [newListing, ...prev]);
    showToast('Vacancy published successfully!', 'success');
    setActiveTab('my-posts');
  };

  const updateListing = (updated: PGListing) => {
    setListings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (selectedListing?.id === updated.id) {
      setSelectedListing(updated);
    }
    showToast('Vacancy updated successfully', 'success');
    setEditingListing(null);
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
    showToast('Listing deleted', 'info');
  };

  const toggleAvailability = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isAvailable;
          showToast(
            nextState ? 'Status set to: Available' : 'Status set to: Occupied / Filled',
            'info'
          );
          return { ...item, isAvailable: nextState };
        }
        return item;
      })
    );
  };

  const adminToggleVerified = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isVerified;
          showToast(
            next
              ? `Verified badge granted to "${item.title}"`
              : `Verified badge removed from "${item.title}"`,
            'info'
          );
          return { ...item, isVerified: next };
        }
        return item;
      })
    );
  };

  const adminUpdateUser = (updatedUser: StoredAccount) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
    );
    if (currentUser?.id === updatedUser.id) {
      const { password: _, ...safeUser } = updatedUser;
      setCurrentUser(safeUser);
    }
    showToast(`User account "${updatedUser.name}" updated`, 'success');
  };

  const adminDeleteUser = (userId: string): boolean => {
    const target = accounts.find((a) => a.id === userId);
    if (!target) return false;
    if (
      target.email.toLowerCase() === 'manthandaundkar33@gmail.com' ||
      target.id === 'demo-user'
    ) {
      showToast('Master admin account cannot be deleted!', 'error');
      return false;
    }
    setAccounts((prev) => prev.filter((a) => a.id !== userId));
    showToast(`Account for "${target.name}" deleted`, 'info');
    return true;
  };

  const adminCreateUser = (newUser: StoredAccount): boolean => {
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === newUser.email.trim().toLowerCase()
    );
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return false;
    }
    const created: StoredAccount = {
      ...newUser,
      id: newUser.id || `user-${Date.now()}`,
      email: newUser.email.trim(),
    };
    setAccounts((prev) => [...prev, created]);
    showToast(`New user "${created.name}" created successfully`, 'success');
    return true;
  };

  const adminResetPassword = (userId: string, newPassword: string): boolean => {
    if (!newPassword || newPassword.trim().length < 4) {
      showToast('Password must be at least 4 characters', 'error');
      return false;
    }
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userId ? { ...acc, password: newPassword.trim() } : acc
      )
    );
    showToast('Password updated successfully', 'success');
    return true;
  };

  const adminResetAllData = () => {
    setListings(INITIAL_LISTINGS);
    setAccounts(INITIAL_USERS);
    setCurrentUser(DEFAULT_USER);
    setSavedIds(['pg-1', 'pg-2']);
    localStorage.removeItem('pg_finder_nmiet_listings');
    localStorage.removeItem('pg_finder_nmiet_accounts');
    localStorage.removeItem('pg_finder_nmiet_saved');
    showToast('All platform data reset to default seed state', 'info');
  };

  const adminExportData = (): string => {
    const exportObject = {
      platform: 'PG Finder NMIET',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      admin: currentUser?.email,
      listings,
      accounts,
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const adminImportData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.listings)) {
        setListings(parsed.listings);
      }
      if (Array.isArray(parsed.accounts)) {
        setAccounts(parsed.accounts);
      }
      showToast('Platform data imported successfully!', 'success');
      return true;
    } catch {
      showToast('Invalid backup JSON format', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        savedIds,
        currentUser,
        isLoggedIn: currentUser !== null,
        isAdmin,
        accounts,
        activeTab,
        selectedListing,
        editingListing,
        filters,
        toasts,
        isAuthModalOpen,
        authModalMode,
        setActiveTab,
        setSelectedListing,
        setEditingListing,
        setFilters,
        resetFilters,
        toggleSave,
        isSaved,
        addListing,
        updateListing,
        deleteListing,
        toggleAvailability,
        adminToggleVerified,
        adminUpdateUser,
        adminDeleteUser,
        adminCreateUser,
        adminResetPassword,
        adminResetAllData,
        adminExportData,
        adminImportData,
        openAuthModal,
        closeAuthModal,
        login,
        registerUser,
        logout,
        showToast,
        dismissToast,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
