import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import {
  Search,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Utensils,
  Train,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { listings, setActiveTab, setFilters } = useApp();

  const handleQuickFilter = (type: 'boys' | 'girls' | 'budget' | 'near') => {
    setActiveTab('find');
    if (type === 'boys') {
      setFilters((prev) => ({ ...prev, gender: 'boys' }));
    } else if (type === 'girls') {
      setFilters((prev) => ({ ...prev, gender: 'girls' }));
    } else if (type === 'budget') {
      setFilters((prev) => ({ ...prev, maxRent: 4000 }));
    } else if (type === 'near') {
      setFilters((prev) => ({ ...prev, maxDistanceMeters: 600 }));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    setFilters((prev) => ({ ...prev, searchQuery: query || '' }));
    setActiveTab('find');
  };

  const featuredListings = listings.slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/90 dark:bg-slate-900/95 text-white p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl backdrop-blur-sm">
        {/* Background Subtle Gradient & Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Student Housing Portal · Created by ECE Department students.
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Find verified PGs &amp; flatmates near{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                NMIET
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Zero brokerage, direct contact with fellow engineering students &amp; seniors.
              <br/>  
            </p>
            

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-slate-800/95 p-2 rounded-2xl shadow-xl max-w-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-3 flex-1 text-slate-900 dark:text-white">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="query"
                    placeholder="Search by area or PG (e.g. Samarth Colony, Station)..."
                    className="w-full py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Find Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Interactive Fast Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium mr-1">Quick Browse:</span>
              <button
                onClick={() => handleQuickFilter('boys')}
                className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-xs font-semibold text-blue-200 transition-colors cursor-pointer"
              >
                Boys PG
              </button>
              <button
                onClick={() => handleQuickFilter('girls')}
                className="px-3 py-1.5 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-500/40 text-xs font-semibold text-pink-200 transition-colors cursor-pointer"
              >
                Girls PG
              </button>
              <button
                onClick={() => handleQuickFilter('near')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                &lt; 500m from College
              </button>
              <button
                onClick={() => handleQuickFilter('budget')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                Under ₹4,000/mo
              </button>
            </div>
          </div>

          {/* Right Column: Campus Highlights & Quick Stats */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-slate-800/80 dark:bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">NMIET Student Housing Hub</h3>
                    <p className="text-[11px] text-slate-400">Talegaon Dabhade · Verified PGs</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live
                </span>
              </div>

              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400 font-medium">Starting Rent</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">₹3,000<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                  <p className="text-[10px] text-slate-400">Budget friendly sharing</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400 font-medium">To Campus Gate</div>
                  <div className="text-lg font-bold text-sky-400 mt-0.5">&lt; 500m</div>
                  <p className="text-[10px] text-slate-400">Walking distance</p>
                </div>
              </div>

              {/* Verified Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Zero brokerage fee · 100% Direct peer connect</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Mess &amp; tiffin services right at doorstep</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>WiFi, 24/7 water supply &amp; study environment</span>
                </div>
              </div>

              {/* Action Banner */}
              <button
                type="button"
                onClick={() => setActiveTab('find')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Browse {listings.length} Available PGs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* College Proximity Fact Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus Gate Distance</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">200m – 1.2km</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Average walking distance</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Student Rent</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹3,000 – ₹5,500</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Twin &amp; triple sharing</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Talegaon Local Station</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">1.2 km</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct trains to Pune &amp; Lonavala</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student Brokerage</div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">₹0 (Zero)</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct peer &amp; student connect</p>
        </div>
      </section>

      {/* Verified Listings Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Verified Accommodations
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Popular student rooms near NMIET
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('find')}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
          >
            <span>View all {listings.length} listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* NMIET Campus Guide & Tips */}
      <section className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            NMIET Student Accommodation & Neighborhood Guide
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Essential local advice curated by seniors from Nutan Maharashtra Institute of Engineering & Technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Best Areas to Stay</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Samarth Colony</strong> and <strong>behind sports ground</strong> are closest (&lt;5 mins walk).
              <strong>Station Road</strong> offers more food variety and easy transit for train commuters.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mess & Tiffin Services</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Most PGs include morning tea and 2-time veg meals. Monthly mess charges range from
              <strong> ₹2,000 to ₹2,800</strong> with multiple tiffin providers delivering directly to rooms.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Train className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Station & Commute</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share-autos are readily available at Talegaon Railway Station for ₹15-₹20 to NMIET college gate.
              Bicycle is the most popular mode of transport among students.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action for Roommates */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border dark:border-slate-800">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-bold text-white">Have a vacant bed or room near NMIET?</h3>
          <p className="text-sm text-slate-300">
            List your PG or flatmate vacancy in under 2 minutes. Free and seen by hundreds of incoming students.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shrink-0 transition-colors shadow-sm cursor-pointer"
        >
          Post Free Vacancy
        </button>
      </section>
    </div>
  );
};
