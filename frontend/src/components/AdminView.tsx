import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PGListing, StoredAccount, GenderType } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  User,
  Users,
  Home,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  FileText,
  BadgeCheck,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    isAdmin,
    currentUser,
    listings,
    accounts,
    setActiveTab,
    openAuthModal,
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
    setSelectedListing,
    showToast,
  } = useApp();

  // Active sub-tab in Admin
  const [adminTab, setAdminTab] = useState<'vacancies' | 'users' | 'backup'>('vacancies');

  // Search & filter states for listings
  const [listingSearch, setListingSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | GenderType>('all');
  const [availFilter, setAvailFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Search & filter states for users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'student'>('all');

  // Reveal password state for each user
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Modals state
  const [editingVacancy, setEditingVacancy] = useState<PGListing | null>(null);
  const [editingUser, setEditingUser] = useState<StoredAccount | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [resetPassUser, setResetPassUser] = useState<StoredAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'listing' | 'user'; id: string; name: string } | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'admin'>('student');
  const [newUserBranch, setNewUserBranch] = useState('CSE Engg');
  const [newUserYear, setNewUserYear] = useState('Third Year (TE)');
  const [newUserPassword, setNewUserPassword] = useState('');

  // Backup import JSON state
  const [importJsonText, setImportJsonText] = useState('');

  // If not admin, show access denied screen
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xl text-center space-y-6 text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Restricted Admin Area
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            This dashboard is private and reserved exclusively for the platform administrator.
            Other visitors and student accounts do not have permission to view or manage site data.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Current Session:</div>
          <div className="text-slate-500 dark:text-slate-400">
            {currentUser ? `Signed in as: ${currentUser.name} (${currentUser.email})` : 'Not signed in'}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Sign in as Administrator
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.address.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.landmark.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.contactName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.id.toLowerCase().includes(listingSearch.toLowerCase());

    const matchesType = typeFilter === 'all' || l.type === typeFilter;
    const matchesAvail =
      availFilter === 'all' ||
      (availFilter === 'available' ? l.isAvailable : !l.isAvailable);
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' ? l.isVerified : !l.isVerified);

    return matchesSearch && matchesType && matchesAvail && matchesVerified;
  });

  // Filter users
  const filteredUsers = accounts.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.collegeBranch && u.collegeBranch.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesRole =
      userRoleFilter === 'all' ||
      (userRoleFilter === 'admin' ? u.role === 'admin' || u.email.toLowerCase() === 'manthandaundkar33@gmail.com' : u.role !== 'admin' && u.email.toLowerCase() !== 'manthandaundkar33@gmail.com');

    return matchesSearch && matchesRole;
  });

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportDownload = () => {
    const dataStr = adminExportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pg-finder-nmiet-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully', 'success');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      showToast('Please paste valid JSON backup content', 'error');
      return;
    }
    const success = adminImportData(importJsonText);
    if (success) {
      setImportJsonText('');
    }
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }
    const success = adminCreateUser({
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 98000 00000',
      role: newUserRole,
      collegeBranch: newUserBranch,
      year: newUserYear,
      password: newUserPassword.trim() || 'password123',
    });
    if (success) {
      setIsCreateUserOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
    }
  };

  const activeListingsCount = listings.filter((l) => l.isAvailable).length;
  const verifiedListingsCount = listings.filter((l) => l.isVerified).length;
  const adminUsersCount = accounts.filter(
    (u) => u.role === 'admin' || u.email.toLowerCase() === 'manthandaundkar33@gmail.com'
  ).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Master Admin Badge */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.25),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>CONFIDENTIAL · MASTER ADMIN DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Platform Data & Control Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              Full administrative authority over all accommodation vacancies, user login credentials,
              NMIET verification badges, and system database backups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Vacancy</span>
            </button>
            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>New User</span>
            </button>
            <button
              onClick={handleExportDownload}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download full JSON platform backup"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Vacancies</span>
            <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {listings.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            {activeListingsCount} active · {listings.length - activeListingsCount} occupied
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Verified PGs</span>
            <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {verifiedListingsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {Math.round((verifiedListingsCount / (listings.length || 1)) * 100)}% verification rate
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Registered Logins</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {accounts.length}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
            {accounts.length - adminUsersCount} students · {adminUsersCount} admin
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Platform Status</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            Live
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Zero Brokerage · NMIET
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setAdminTab('vacancies')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            adminTab === 'vacancies'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Vacancies Data ({listings.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            adminTab === 'users'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Logins & Accounts ({accounts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('backup')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            adminTab === 'backup'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Database & Backup</span>
        </button>
      </div>

      {/* TAB 1: VACANCIES MANAGEMENT */}
      {adminTab === 'vacancies' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vacancy, landmark, host..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Genders</option>
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
                <option value="unisex">Co-ed / Shared Flat</option>
              </select>

              <select
                value={availFilter}
                onChange={(e) => setAvailFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Availability</option>
                <option value="available">Available Only</option>
                <option value="occupied">Occupied Only</option>
              </select>

              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Table of Listings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Accommodation</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Rent / Mo</th>
                    <th className="px-4 py-3">Distance & Landmark</th>
                    <th className="px-4 py-3">Host Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Verified</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        No vacancies match your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map((listing) => (
                      <tr
                        key={listing.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-[220px]">
                          <div className="truncate">{listing.title}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            ID: {listing.id} · Posted by: {listing.postedByName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] capitalize ${
                              listing.type === 'boys'
                                ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
                                : listing.type === 'girls'
                                ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {listing.type} · {listing.roomType ? `${listing.roomType} · ` : ''}{typeof listing.sharing === 'number' ? `${listing.sharing}p` : listing.sharing}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ₹{listing.rent.toLocaleString('en-IN')}
                          <div className="text-[10px] font-normal text-slate-400">
                            Dep: ₹{listing.deposit.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[180px]">
                          <div className="truncate">{listing.landmark}</div>
                          <div className="text-[10px] text-slate-400 truncate">{listing.distanceMeters}m from NMIET</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          <div>{listing.contactName}</div>
                          <div className="text-[10px] text-slate-400">{listing.contactPhone}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => toggleAvailability(listing.id)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                              listing.isAvailable
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                            title="Click to toggle Available / Occupied"
                          >
                            {listing.isAvailable ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Available</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-400" />
                                <span>Occupied</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => adminToggleVerified(listing.id)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                              listing.isVerified
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                            }`}
                            title="Click to toggle Verified badge"
                          >
                            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>{listing.isVerified ? 'Verified' : 'Unverified'}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedListing(listing)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Preview Listing Modal"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingVacancy(listing)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors cursor-pointer"
                              title="Edit Vacancy Data"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setItemToDelete({
                                  type: 'listing',
                                  id: listing.id,
                                  name: listing.title,
                                })
                              }
                              className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                              title="Delete Vacancy"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER LOGINS & ACCOUNTS */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, email, branch..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="student">Students Only</option>
              </select>

              <button
                onClick={() => setIsCreateUserOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Student Login</span>
              </button>
            </div>
          </div>

          {/* Table of User Accounts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">User & ID</th>
                    <th className="px-4 py-3">Login Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Branch & Year</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Password / Credential</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => {
                    const isSelfAdmin =
                      user.email.toLowerCase() === 'manthandaundkar33@gmail.com' ||
                      user.id === 'demo-user';
                    const isRevealed = Boolean(revealedPasswords[user.id]);

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{user.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {user.id} {isSelfAdmin && '· (You)'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          {user.role === 'admin' || isSelfAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[10px] border border-purple-200 dark:border-purple-800">
                              <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[10px]">
                              Student
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <div>{user.collegeBranch || 'NMIET'}</div>
                          <div className="text-[10px] text-slate-400">{user.year || 'Student'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {user.phone || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                              {isRevealed ? user.password || 'password' : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                              title={isRevealed ? 'Hide Password' : 'Show Password'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                setResetPassUser(user);
                                setNewPasswordInput('');
                              }}
                              className="text-purple-600 dark:text-purple-400 hover:underline text-[10px] font-semibold ml-1 cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowEditPassword(false);
                              }}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors cursor-pointer"
                              title="Edit User Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isSelfAdmin}
                              onClick={() =>
                                setItemToDelete({
                                  type: 'user',
                                  id: user.id,
                                  name: user.name,
                                })
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                isSelfAdmin
                                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer'
                              }`}
                              title={isSelfAdmin ? 'Primary admin cannot be deleted' : 'Delete User Account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM & BACKUP */}
      {adminTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: JSON Export & Backup */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Download className="w-4 h-4" />
              <span>Full Data Export & Backup</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export all {listings.length} vacancies and {accounts.length} student user profiles as a
              structured JSON document. You can store this file offline and restore it at any time.
            </p>

            <button
              onClick={handleExportDownload}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup ({listings.length} Vacancies + {accounts.length} Users)</span>
            </button>
          </div>

          {/* Card 2: Factory Reset */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Factory Seed Reset</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Reset all platform listings, student accounts, and bookmarks back to the initial sample seed
              dataset for NMIET Talegaon Dabhade.
            </p>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/90 text-rose-700 dark:text-rose-300 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Site Data to Defaults</span>
            </button>
          </div>

          {/* Card 3: JSON Import / Restore */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Upload className="w-4 h-4" />
              <span>Restore Database from JSON</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste the contents of a previously exported backup file below to restore or synchronize
              vacancies and account data.
            </p>

            <textarea
              rows={5}
              placeholder='Paste exported JSON here: { "listings": [...], "accounts": [...] }'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setImportJsonText('')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Import & Apply Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT VACANCY --- */}
      {editingVacancy && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setEditingVacancy(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Admin Edit Vacancy: {editingVacancy.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingVacancy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateListing(editingVacancy);
                setEditingVacancy(null);
                showToast('Vacancy data updated by Admin', 'success');
              }}
              className="overflow-y-auto p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Accommodation Title</label>
                <input
                  type="text"
                  value={editingVacancy.title}
                  onChange={(e) => setEditingVacancy({ ...editingVacancy, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editingVacancy.type}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, type: e.target.value as GenderType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="unisex">Co-ed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Room Type</label>
                  <select
                    value={editingVacancy.roomType || '2 BHK'}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, roomType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="1 RK">1 RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="Studio / Single Room">Studio / Single Room</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sharing (Persons)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={
                      typeof editingVacancy.sharing === 'number'
                        ? editingVacancy.sharing
                        : editingVacancy.sharing === 'single'
                        ? 1
                        : editingVacancy.sharing === 'double'
                        ? 2
                        : editingVacancy.sharing === 'triple'
                        ? 3
                        : 4
                    }
                    onChange={(e) =>
                      setEditingVacancy({
                        ...editingVacancy,
                        sharing: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rent (₹/mo)</label>
                  <input
                    type="number"
                    value={editingVacancy.rent}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, rent: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={editingVacancy.deposit}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, deposit: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    value={editingVacancy.address}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Landmark</label>
                  <input
                    type="text"
                    value={editingVacancy.landmark}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, landmark: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Host Name</label>
                  <input
                    type="text"
                    value={editingVacancy.contactName}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, contactName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingVacancy.contactPhone}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, contactPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editingVacancy.contactWhatsapp}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, contactWhatsapp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingVacancy.isAvailable}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Mark as Available</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-purple-700 dark:text-purple-400">
                  <input
                    type="checkbox"
                    checked={editingVacancy.isVerified}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, isVerified: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Grant NMIET Verified Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingVacancy(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Save Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT USER --- */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => {
            setEditingUser(null);
            setShowEditPassword(false);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit User: {editingUser.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowEditPassword(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingUser.password || !editingUser.password.trim()) {
                  showToast('Password cannot be empty', 'error');
                  return;
                }
                adminUpdateUser(editingUser);
                setEditingUser(null);
                setShowEditPassword(false);
              }}
              className="p-6 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Login Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold">Login Password</label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                    Edit Password
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                    placeholder="Enter or update password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    title={showEditPassword ? 'Hide password' : 'Show password'}
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Editing this updates the user's login password immediately.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <select
                    value={editingUser.role || 'student'}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value as 'student' | 'admin' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    value={editingUser.year || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Third Year"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Branch / Department</label>
                <input
                  type="text"
                  value={editingUser.collegeBranch || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, collegeBranch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. CSE Engg, ECE Engg, CSE-AI Engg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setShowEditPassword(false);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: RESET PASSWORD --- */}
      {resetPassUser && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setResetPassUser(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Reset User Password
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Account: {resetPassUser.name} ({resetPassUser.email})
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">New Password</label>
              <input
                type="text"
                placeholder="Enter new password (min 4 chars)"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetPassUser(null)}
                className="px-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (adminResetPassword(resetPassUser.id, newPasswordInput)) {
                    setResetPassUser(null);
                  }
                }}
                className="px-4 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE USER --- */}
      {isCreateUserOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsCreateUserOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Student or Admin Account
                </h3>
              </div>
              <button
                onClick={() => setIsCreateUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sahil Deshmukh"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Login Email *</label>
                <input
                  type="email"
                  placeholder="e.g. sahil.d@nmiet.edu.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98..."
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">College Branch</label>
                  <input
                    type="text"
                    value={newUserBranch}
                    onChange={(e) => setNewUserBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    value={newUserYear}
                    onChange={(e) => setNewUserYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Initial Password</label>
                <input
                  type="text"
                  placeholder="Defaults to password123"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CONFIRM DELETE --- */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete {itemToDelete.type === 'listing' ? 'Vacancy' : 'User Account'}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Are you sure you want to permanently remove{' '}
                <strong className="text-slate-800 dark:text-slate-200">"{itemToDelete.name}"</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (itemToDelete.type === 'listing') {
                    deleteListing(itemToDelete.id);
                  } else {
                    adminDeleteUser(itemToDelete.id);
                  }
                  setItemToDelete(null);
                }}
                className="flex-1 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CONFIRM FACTORY RESET --- */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-rose-200 dark:border-rose-800 text-slate-900 dark:text-slate-100 p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Site Data to Seed Defaults?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will reset all vacancies and user accounts back to original demo values. Any
                new vacancies or registrations created locally will be overwritten.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  adminResetAllData();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-sm"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
