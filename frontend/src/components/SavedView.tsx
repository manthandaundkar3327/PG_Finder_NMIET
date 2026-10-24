import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { Bookmark, Search, ArrowRight } from 'lucide-react';

export const SavedView: React.FC = () => {
  const { listings, savedIds, setActiveTab } = useApp();

  const savedListings = listings.filter((l) => savedIds.includes(l.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            Student Shortlist
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Saved Accommodations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare and contact your shortlisted PGs and student rooms near NMIET.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore More PGs</span>
        </button>
      </div>

      {savedListings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No saved accommodations yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Tap the heart icon on any PG card to bookmark it here for quick comparison before visiting in Talegaon.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('find')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse Accommodations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
