import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { POPULAR_AMENITIES } from '../data/mockListings';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Building,
} from 'lucide-react';
import { GenderType, SharingType, FilterState } from '../types';

export const FindPgView: React.FC = () => {
  const { listings, filters, setFilters, resetFilters } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Text search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const compactQuery = query.replace(/\s+/g, '');
        const compactRoomType = item.roomType ? item.roomType.toLowerCase().replace(/\s+/g, '') : '';
        const matchesQuery =
          item.title.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.landmark.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (compactRoomType && compactRoomType.includes(compactQuery)) ||
          (item.roomType && item.roomType.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Gender filter
      if (filters.gender !== 'all' && item.type !== filters.gender) {
        return false;
      }

      // Room Type filter (1BHK, 2BHK, 3BHK, etc.)
      if (filters.roomType && filters.roomType !== 'all') {
        const normalize = (val: string) => val.toLowerCase().replace(/\s+/g, '');
        const selectedNorm = normalize(filters.roomType);
        const itemNorm = item.roomType ? normalize(item.roomType) : '';
        if (itemNorm !== selectedNorm) {
          return false;
        }
      }

      // Sharing filter
      if (filters.sharing !== 'all') {
        const s = item.sharing;
        const itemVal =
          s === 'single' || s === 1
            ? 'single'
            : s === 'double' || s === 2
            ? 'double'
            : s === 'triple' || s === 3
            ? 'triple'
            : 'four';
        if (itemVal !== filters.sharing) {
          return false;
        }
      }

      // Rent filter
      if (item.rent > filters.maxRent) {
        return false;
      }

      // Distance filter
      if (item.distanceMeters > filters.maxDistanceMeters) {
        return false;
      }

      // Food required filter
      if (filters.foodRequired && !item.foodOption.toLowerCase().includes('included')) {
        return false;
      }

      // Selected Amenities
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every((amenity) =>
          item.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'rent-asc':
          return a.rent - b.rent;
        case 'rent-desc':
          return b.rent - a.rent;
        case 'distance-asc':
          return a.distanceMeters - b.distanceMeters;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'recommended':
        default:
          return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || a.distanceMeters - b.distanceMeters;
      }
    });
  }, [listings, filters]);

  const handleGenderChange = (type: GenderType | 'all') => {
    setFilters((prev) => ({ ...prev, gender: type }));
  };

  const handleSharingChange = (sharing: SharingType | 'all') => {
    setFilters((prev) => ({ ...prev, sharing }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter((a) => a !== amenity)
          : [...prev.selectedAmenities, amenity],
      };
    });
  };

  const activeFilterCount =
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.sharing !== 'all' ? 1 : 0) +
    (filters.roomType && filters.roomType !== 'all' ? 1 : 0) +
    (filters.maxRent < 10000 ? 1 : 0) +
    (filters.maxDistanceMeters < 3000 ? 1 : 0) +
    (filters.foodRequired ? 1 : 0) +
    filters.selectedAmenities.length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PG name, landmark or street (e.g. Samarth Colony, Station)..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2 hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="recommended">Recommended & Verified</option>
                <option value="rent-asc">Rent: Low to High</option>
                <option value="rent-desc">Rent: High to Low</option>
                <option value="distance-asc">Distance: Nearest to NMIET</option>
                <option value="rating-desc">Highest Student Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Reset Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Quick Gender Tabs (Segmented control) */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(
              [
                { label: 'All Accommodations', value: 'all', activeClass: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' },
                { label: 'Boys Only', value: 'boys', activeClass: 'bg-blue-600 text-white shadow-xs font-bold' },
                { label: 'Girls Only', value: 'girls', activeClass: 'bg-[#9f1239] text-white shadow-xs font-bold' },
                { label: 'Co-ed / Shared Flat', value: 'unisex', activeClass: 'bg-[#0f766e] text-white shadow-xs font-bold' },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                onClick={() => handleGenderChange(item.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  filters.gender === item.value
                    ? item.activeClass
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredListings.length}</strong> available PGs near NMIET
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Results Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Filter Options</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Room / Flat Type Filter (1BHK, 2BHK, 3BHK, etc.) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Room / Flat Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { label: 'All', value: 'all' },
                  { label: '1 RK', value: '1 RK' },
                  { label: '1 BHK', value: '1 BHK' },
                  { label: '2 BHK', value: '2 BHK' },
                  { label: '3 BHK', value: '3 BHK' },
                  { label: 'Studio', value: 'Studio / Single Room' },
                ] as const
              ).map((rt) => (
                <button
                  key={rt.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      roomType: prev.roomType === rt.value ? 'all' : rt.value,
                    }))
                  }
                  className={`px-2 py-1.5 text-xs text-center rounded-lg border transition-colors cursor-pointer font-medium ${
                    filters.roomType === rt.value
                      ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sharing Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Room Sharing Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { label: 'Any Sharing', value: 'all' },
                  { label: 'Single Room', value: 'single' },
                  { label: '2 Sharing', value: 'double' },
                  { label: '3 Sharing', value: 'triple' },
                  { label: '4+ Sharing', value: 'four' },
                ] as const
              ).map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleSharingChange(s.value)}
                  className={`px-2.5 py-1.5 text-xs text-left rounded-lg border transition-colors cursor-pointer ${
                    filters.sharing === s.value
                      ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Rent Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Max Monthly Rent
              </label>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                ₹{filters.maxRent.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min="2500"
              max="10000"
              step="500"
              value={filters.maxRent}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxRent: Number(e.target.value) }))
              }
              className="w-full accent-slate-900 dark:accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>₹2,500</span>
              <span>₹6,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Distance from NMIET */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Distance to NMIET
              </label>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filters.maxDistanceMeters >= 3000
                  ? 'Any distance'
                  : `Within ${(filters.maxDistanceMeters / 1000).toFixed(1)} km`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: '< 500m', value: 500 },
                { label: '< 1 km', value: 1000 },
                { label: '< 2 km', value: 2000 },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      maxDistanceMeters:
                        prev.maxDistanceMeters === d.value ? 3000 : d.value,
                    }))
                  }
                  className={`py-1.5 px-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                    filters.maxDistanceMeters === d.value
                      ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Option Check */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={filters.foodRequired}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, foodRequired: e.target.checked }))
                }
                className="rounded text-slate-900 dark:text-emerald-500 accent-slate-900 dark:accent-emerald-500 focus:ring-0"
              />
              <span>Mess / Food Included in Rent</span>
            </label>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Must-Have Amenities
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {POPULAR_AMENITIES.map((amenity) => {
                const checked = filters.selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-slate-900 dark:text-emerald-500 accent-slate-900 dark:accent-emerald-500 focus:ring-0"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results Grid Area */}
        <main className="lg:col-span-3">
          {filteredListings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mx-auto flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No accommodations match your current filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try increasing your budget range or unchecking some amenities to see more rooms near NMIET.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 space-y-6 flex flex-col justify-between text-slate-900 dark:text-slate-100 border-l dark:border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Filter Accommodations</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Gender Preference
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { label: 'All', value: 'all' },
                      { label: 'Boys Only', value: 'boys' },
                      { label: 'Girls Only', value: 'girls' },
                      { label: 'Co-ed / Flat', value: 'unisex' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleGenderChange(item.value)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left ${
                        filters.gender === item.value
                          ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room / Flat Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Room / Flat Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { label: 'All', value: 'all' },
                      { label: '1 RK', value: '1 RK' },
                      { label: '1 BHK', value: '1 BHK' },
                      { label: '2 BHK', value: '2 BHK' },
                      { label: '3 BHK', value: '3 BHK' },
                      { label: 'Studio', value: 'Studio / Single Room' },
                    ] as const
                  ).map((rt) => (
                    <button
                      key={rt.value}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          roomType: prev.roomType === rt.value ? 'all' : rt.value,
                        }))
                      }
                      className={`px-2 py-2 text-xs rounded-lg border text-center ${
                        filters.roomType === rt.value
                          ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharing */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sharing
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { label: 'Any', value: 'all' },
                      { label: 'Single', value: 'single' },
                      { label: '2 Sharing', value: 'double' },
                      { label: '3 Sharing', value: 'triple' },
                      { label: '4+ Sharing', value: 'four' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSharingChange(s.value)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left ${
                        filters.sharing === s.value
                          ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Rent */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Max Rent
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    ₹{filters.maxRent}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="10000"
                  step="500"
                  value={filters.maxRent}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxRent: Number(e.target.value) }))
                  }
                  className="w-full accent-slate-900 dark:accent-emerald-500"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Amenities
                </label>
                <div className="space-y-2">
                  {POPULAR_AMENITIES.slice(0, 6).map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={filters.selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-slate-900 dark:text-emerald-500 accent-slate-900 dark:accent-emerald-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 rounded-xl"
              >
                Apply ({filteredListings.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
