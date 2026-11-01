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
    createdAt: '01 Nov 2026',
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
    createdAt: '01 Nov 2026',
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
    createdAt: '01 Nov 2026',
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
    createdAt: '01 Nov 2026',
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
          return parsed;
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
      localStorage.removeItem('pg_finder_nmiet_user');
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
      return true;
    } catch {
      return true;
    }
  });

  // Sync initial data from backend API on mount
  useEffect(() => {
    let isMounted = true;

    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.listings) && data.listings.length > 0) {
          setListings(data.listings);
        }
      })
      .catch((err) => {
        console.warn('Backend listings not loaded directly, using local store', err);
      });

    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.users) && data.users.length > 0) {
          setAccounts(data.users);
        }
      })
      .catch((err) => {
        console.warn('Backend users not loaded directly, using local store', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Persist listings to localStorage
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

  // Persist user session to sessionStorage
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
      const formattedToday = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const newAcc: StoredAccount = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        phone: '+91 98000 00000',
        role: email.trim().toLowerCase() === 'manthandaundkar33@gmail.com' ? 'admin' : 'student',
        collegeBranch: 'NMIET Engineering',
        year: 'Student',
        password: password || 'manthan',
        createdAt: formattedToday,
      };
      setAccounts((prev) => [...prev, newAcc]);
      setCurrentUser(newAcc);
      showToast(`Welcome to PG Finder NMIET, ${newAcc.name}!`, 'success');
      closeAuthModal();

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAcc.email, password: newAcc.password }),
      }).catch((err) => console.warn('Login sync error:', err));

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

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).catch((err) => console.warn('Login sync error:', err));

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

    const formattedToday = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newId = `user-${Date.now()}`;
    const newAccount: StoredAccount = {
      ...profile,
      id: newId,
      password: password || 'pass123',
      createdAt: formattedToday,
    };

    setAccounts((prev) => [...prev, newAccount]);
    const { password: _, ...userSafe } = newAccount;
    setCurrentUser(userSafe);
    showToast(`Registration complete! Welcome, ${profile.name}.`, 'success');
    closeAuthModal();

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount),
    }).catch((err) => console.warn('Register sync error:', err));

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

  // Add Listing (Student or Admin) -> Updates state and backend data file
  const addListing = (
    newListingData: Omit<PGListing, 'id' | 'postedDate' | 'rating' | 'reviewsCount'>
  ) => {
    const formattedToday = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newListing: PGListing = {
      ...newListingData,
      id: `pg-${Date.now()}`,
      postedDate: formattedToday,
      rating: 5.0,
      reviewsCount: 1,
    };

    setListings((prev) => [newListing, ...prev]);
    showToast('Vacancy published and updated in backend data files!', 'success');
    setActiveTab('my-posts');

    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newListing),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listing) {
          setListings((prev) =>
            prev.map((item) => (item.id === newListing.id ? data.listing : item))
          );
        }
      })
      .catch((err) => console.error('Failed to save listing to backend file:', err));
  };

  // Update Listing (Student or Admin) -> Updates state and backend data file
  const updateListing = (updated: PGListing) => {
    setListings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (selectedListing?.id === updated.id) {
      setSelectedListing(updated);
    }
    showToast('Vacancy data and date updated in backend files', 'success');
    setEditingListing(null);

    fetch(`/api/listings/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to update listing on backend file:', err));
  };

  // Delete Listing -> Removes from state and backend data file
  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
    showToast('Listing removed from backend data files', 'info');

    fetch(`/api/listings/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete listing on backend file:', err));
  };

  // Toggle Availability -> Updates state and backend data file
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

    fetch(`/api/listings/${id}/availability`, {
      method: 'PATCH',
    }).catch((err) => console.error('Failed to toggle availability on backend:', err));
  };

  // Admin Toggle Verified -> Updates state and backend data file
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

    fetch(`/api/listings/${id}/verified`, {
      method: 'PATCH',
    }).catch((err) => console.error('Failed to toggle verified status on backend:', err));
  };

  // Admin Update User -> Updates state and backend data file
  const adminUpdateUser = (updatedUser: StoredAccount) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
    );
    if (currentUser?.id === updatedUser.id) {
      const { password: _, ...safeUser } = updatedUser;
      setCurrentUser(safeUser);
    }
    showToast(`User account "${updatedUser.name}" updated in backend files`, 'success');

    fetch(`/api/auth/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    }).catch((err) => console.error('Failed to update user on backend:', err));
  };

  // Admin Delete User -> Removes from state and backend data file
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
    showToast(`Account for "${target.name}" removed from backend files`, 'info');

    fetch(`/api/auth/users/${userId}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete user on backend:', err));

    return true;
  };

  // Admin Create User -> Adds to state and backend data file
  const adminCreateUser = (newUser: StoredAccount): boolean => {
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === newUser.email.trim().toLowerCase()
    );
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return false;
    }
    const formattedToday = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const created: StoredAccount = {
      ...newUser,
      id: newUser.id || `user-${Date.now()}`,
      email: newUser.email.trim(),
      createdAt: newUser.createdAt || formattedToday,
    };
    setAccounts((prev) => [...prev, created]);
    showToast(`New user "${created.name}" created and saved to backend file`, 'success');

    fetch('/api/auth/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch((err) => console.error('Failed to create user on backend:', err));

    return true;
  };

  // Admin Reset Password -> Updates state and backend data file
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
    showToast('Password updated and saved to backend file', 'success');

    fetch(`/api/auth/users/${userId}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    }).catch((err) => console.error('Failed to reset password on backend:', err));

    return true;
  };

  // Admin Reset All Data -> Resets state and backend data files to default seed
  const adminResetAllData = () => {
    setListings(INITIAL_LISTINGS);
    setAccounts(INITIAL_USERS);
    setCurrentUser(DEFAULT_USER);
    setSavedIds(['pg-1', 'pg-2']);
    localStorage.removeItem('pg_finder_nmiet_listings');
    localStorage.removeItem('pg_finder_nmiet_accounts');
    localStorage.removeItem('pg_finder_nmiet_saved');
    showToast('All platform data reset to default seed state in backend files', 'info');

    fetch('/api/admin/reset', {
      method: 'POST',
    }).catch((err) => console.error('Failed to reset backend files:', err));
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

  // Admin Import Data -> Imports and writes directly to backend data files
  const adminImportData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.listings)) {
        setListings(parsed.listings);
      }
      if (Array.isArray(parsed.accounts)) {
        setAccounts(parsed.accounts);
      }
      showToast('Platform data imported and written to backend data files!', 'success');

      fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      }).catch((err) => console.error('Failed to import data to backend files:', err));

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
