import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PGListing } from '../types';
import {
  FileText,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Clock,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

export const MyPostsView: React.FC = () => {
  const {
    listings,
    currentUser,
    setActiveTab,
    setSelectedListing,
    setEditingListing,
    deleteListing,
    toggleAvailability,
    openAuthModal,
  } = useApp();

  const [listingToDelete, setListingToDelete] = useState<PGListing | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 text-slate-900 dark:text-slate-100">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign in to view your vacancies</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please log in to your account to view, manage, and edit your posted PG accommodations.
        </p>
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  const userListings = listings.filter((l) => l.postedBy === currentUser.id);

  const activeCount = userListings.filter((l) => l.isAvailable).length;
  const occupiedCount = userListings.filter((l) => !l.isAvailable).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Accommodation Dashboard
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">My Posted Vacancies</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Managing posts for {currentUser.name} ({currentUser.email})
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Postings</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{userListings.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Vacancies</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{activeCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Occupied / Filled</div>
          <div className="text-2xl font-bold text-slate-500 dark:text-slate-400 mt-1">{occupiedCount}</div>
        </div>
      </div>

      {/* Postings List */}
      {userListings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              You haven't posted any room vacancies yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              If you have an empty room or bed in your flat or PG near NMIET, post it now to connect with fellow students.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userListings.map((post) => {
            const isBoys = post.type === 'boys';
            const isGirls = post.type === 'girls';
            const cardBorder = isBoys
              ? 'border-blue-200 dark:border-blue-900/60'
              : isGirls
              ? 'border-pink-200 dark:border-pink-900/60'
              : 'border-slate-200 dark:border-slate-800';
            const badgeBg = isBoys
              ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
              : isGirls
              ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            return (
              <div
                key={post.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border ${cardBorder} p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-sm transition-all`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${badgeBg}`}>
                      {post.type === 'boys' ? 'Boys PG' : post.type === 'girls' ? 'Girls PG' : 'Co-ed'}
                    </span>
                    {post.roomType && (
                      <span className="px-2 py-0.5 rounded-md font-semibold text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {post.roomType}
                      </span>
                    )}
                    <span className="text-slate-500 dark:text-slate-400 capitalize">
                      {typeof post.sharing === 'number' || (!isNaN(Number(post.sharing)) && typeof post.sharing === 'string' && post.sharing.trim() !== '')
                        ? Number(post.sharing) === 1
                          ? 'Single Room'
                          : `${post.sharing}-Sharing`
                        : `${post.sharing} sharing`}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {post.postedDate}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedListing(post)}
                    className="font-bold text-slate-900 dark:text-white text-base hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>
                      {post.distanceMeters}m from NMIET · {post.landmark}
                    </span>
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      ₹{post.rent.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Deposit: ₹{post.deposit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => toggleAvailability(post.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      post.isAvailable
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/90'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {post.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Occupied</span>
                      </>
                    )}
                  </button>

                  {/* Edit, View, Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const query = `${post.title}, ${post.landmark ? post.landmark + ', ' : ''}${post.address}`;
                        const hasRegion = /talegaon|pune/i.test(query);
                        const destination = hasRegion ? query : `${query}, Talegaon Dabhade, Pune`;
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer group/navbtn"
                      title="Get directions in Google Maps"
                      aria-label="Directions in Google Maps"
                    >
                      <Navigation className="w-4 h-4 group-hover/navbtn:-translate-y-0.5 group-hover/navbtn:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => setSelectedListing(post)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="View public listing"
                      aria-label="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingListing(post)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit vacancy details"
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setListingToDelete(post)}
                      className="p-2 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete listing"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {listingToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setListingToDelete(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Vacancy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{listingToDelete.title}"</strong>? This listing will be permanently removed from PG Finder.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setListingToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteListing(listingToDelete.id);
                  setListingToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
