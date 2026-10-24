import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Search,
  PlusCircle,
  FileText,
  Bookmark,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { BrandIcon } from './BrandIcon';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    savedIds,
    currentUser,
    isAdmin,
    logout,
    openAuthModal,
    listings,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const myPostsCount = currentUser
    ? listings.filter((l) => l.postedBy === currentUser.id).length
    : 0;

  const handleNav = (tab: 'explore' | 'find' | 'create' | 'my-posts' | 'saved' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & College Affiliation */}
          <div
            onClick={() => handleNav('explore')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center font-bold tracking-tight shadow-xs group-hover:scale-105 transition-all border border-purple-200/90 dark:border-purple-800/60 p-1.5">
              <BrandIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  PG Finder
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  NMIET
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                CampusNest · Talegaon Dabhade
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'explore'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Explore
            </button>

            <button
              onClick={() => handleNav('find')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'find'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Find PG
            </button>

            <button
              onClick={() => handleNav('create')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'create'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Post Vacancy
            </button>

            <button
              onClick={() => handleNav('my-posts')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                activeTab === 'my-posts'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              My Posts
              {myPostsCount > 0 && (
                <span className="text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded-full">
                  {myPostsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                activeTab === 'saved'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Saved
              {savedIds.length > 0 && (
                <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                  {savedIds.length}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60'
                }`}
                title="Master Admin Control Portal"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                <span>Admin Panel</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 ml-0.5">
                  Master
                </span>
              </button>
            )}
          </nav>

          {/* User profile, Dark Mode & Login/Register CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full text-white bg-blue-600 flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {isAdmin ? 'Master Administrator' : 'NMIET Student'}
                    </div>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 p-3 text-slate-900 dark:text-slate-100">
                      <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{currentUser.name}</span>
                          {isAdmin && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                        {currentUser.collegeBranch && (
                          <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1 flex items-center gap-1 font-medium">
                            <GraduationCap className="w-3 h-3" />
                            {currentUser.collegeBranch} {currentUser.year ? `(${currentUser.year})` : ''}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              handleNav('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-md transition-colors flex items-center gap-2 font-semibold"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            Admin Control Portal
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleNav('my-posts');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          Manage My Vacancies ({myPostsCount})
                        </button>

                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>

                        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          {isAdmin ? 'Exclusive Master Administrator' : 'Verified NMIET Student Portal'}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-4 space-y-2">
          {currentUser ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2 flex items-center justify-between border dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  {isAdmin && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAdmin ? 'Master Admin' : 'Student'} · {currentUser.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-center"
              >
                Student Sign In
              </button>
              <button
                onClick={() => {
                  openAuthModal('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-center"
              >
                Register
              </button>
            </div>
          )}

          <button
            onClick={() => handleNav('explore')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
              activeTab === 'explore'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Compass className="w-4 h-4 text-slate-500" />
            Explore Accommodations
          </button>

          <button
            onClick={() => handleNav('find')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
              activeTab === 'find'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            Find PG (Search & Filter)
          </button>

          <button
            onClick={() => handleNav('create')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
              activeTab === 'create'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Post a Vacancy
          </button>

          <button
            onClick={() => handleNav('my-posts')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
              activeTab === 'my-posts'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-slate-500" />
              My Vacancies
            </div>
            {myPostsCount > 0 && (
              <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-full">
                {myPostsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('saved')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
              activeTab === 'saved'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-slate-500" />
              Saved PGs
            </div>
            {savedIds.length > 0 && (
              <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                {savedIds.length}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg text-left ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                Admin Control Portal
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
                Master
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
