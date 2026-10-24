import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_AMENITIES } from '../data/mockListings';
import { GenderType, SharingType, ROOM_TYPE_OPTIONS } from '../types';
import {
  PlusCircle,
  Sparkles,
  LogIn,
  Home,
} from 'lucide-react';

export const CreateVacancyView: React.FC = () => {
  const { addListing, currentUser, openAuthModal, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<GenderType>('boys');
  const [sharing, setSharing] = useState<number>(2);
  const [roomType, setRoomType] = useState<string>('2 BHK');
  const [rent, setRent] = useState<number | ''>(4200);
  const [deposit, setDeposit] = useState<number | ''>(5000);
  const [distanceMeters, setDistanceMeters] = useState<number | ''>(350);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [foodOption, setFoodOption] = useState('Available Optional (Mess Nearby)');
  const [amenities, setAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'Geyser / Hot Water',
    'RO Purified Water',
  ]);
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [contactWhatsapp, setContactWhatsapp] = useState(
    currentUser?.phone.replace(/\D/g, '') || ''
  );
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<string>(
    'Main entry closes at 10:30 PM\nStrictly non-smoking\nStudy silence after 11 PM'
  );
  const [electricityCharges, setElectricityCharges] = useState('Included in rent');

  // Fill sample data for convenience
  const handleFillSample = () => {
    setTitle('Shree Samarth Twin Room Vacancy');
    setType('boys');
    setSharing(2);
    setRoomType('2 BHK');
    setRent(3800);
    setDeposit(4000);
    setDistanceMeters(400);
    setAddress('Samarth Colony, Lane 3, Near NMIET Ground');
    setLandmark('Opp. NMIET Mechanical Lab Gate');
    setFoodOption('Pure Veg Mess within 20m walking distance');
    setAmenities([
      'High-Speed Wi-Fi',
      'Geyser / Hot Water',
      'RO Purified Water',
      'Daily Room Cleaning',
      'Individual Study Table',
      'Lockable Wardrobe',
    ]);
    setDescription(
      'Twin-sharing bed available immediately in a 2BHK flat. Very clean with friendly engineering roommates from NMIET. High-speed 100 Mbps Wi-Fi, solar hot water, and quiet study room.'
    );
    setRules('No loud music after 10 PM\nShare cleaning duties\nSmoking strictly prohibited');
    setElectricityCharges('Divided among flatmates (~₹250/mo)');
    if (!contactName && currentUser) setContactName(currentUser.name);
    if (!contactPhone && currentUser) {
      setContactPhone(currentUser.phone);
      setContactWhatsapp(currentUser.phone.replace(/\D/g, ''));
    }
    showToast('Sample room details filled into form!', 'info');
  };

  const handleAmenityToggle = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter an accommodation title', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please enter the location or address', 'error');
      return;
    }

    if (!contactPhone.trim()) {
      showToast('Please enter a contact phone number', 'error');
      return;
    }

    const ruleList = rules
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    addListing({
      title: title.trim(),
      type,
      sharing,
      roomType,
      rent: Number(rent) || 3500,
      deposit: Number(deposit) || 4000,
      distanceMeters: Number(distanceMeters) || 500,
      address: address.trim(),
      landmark: landmark.trim() || 'Near NMIET Campus',
      foodOption,
      amenities,
      contactName: contactName.trim() || (currentUser?.name ?? 'Host Contact'),
      contactPhone: contactPhone.trim(),
      contactWhatsapp: contactWhatsapp.trim() || contactPhone.trim(),
      isAvailable: true,
      postedBy: currentUser?.id || 'demo-user',
      postedByName: currentUser?.name || contactName.trim(),
      description:
        description.trim() ||
        `Spacious ${roomType} accommodation with ${sharing === 1 ? 'single private' : `${sharing}-sharing`} room for ${type} students near NMIET. Clean premises with essential amenities.`,
      rules: ruleList.length > 0 ? ruleList : ['Maintain cleanliness and discipline'],
      isVerified: true,
      electricityCharges,
      noticePeriodDays: 30,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Auth Prompt if not logged in */}
      {!currentUser && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <strong>Tip:</strong> Log in with your NMIET Student ID to easily track, edit, and manage your posted vacancies later.
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="px-3.5 py-1.5 bg-amber-900 dark:bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            NMIET Student Accommodation Portal
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Post a Vacancy / Roommate Request
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Post an available bed, room, or PG vacancy near Nutan Maharashtra campus.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Auto-fill Sample</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Property & Room Type
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sai Krupa Twin Room Vacancy or 2BHK Roommate Needed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Gender Category *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GenderType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="boys">Boys Only (Blue Card)</option>
                <option value="girls">Girls Only (Pink Card)</option>
                <option value="unisex">Co-ed / Shared Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Room Sharing Type (Number of Persons) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={sharing}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSharing(isNaN(val) ? 1 : Math.max(1, Math.min(10, val)));
                  }}
                  placeholder="e.g. 2 for 2-sharing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-36"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 pointer-events-none">
                  {sharing === 1 ? '1 Person (Single)' : `${sharing}-Sharing Room`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Enter number of persons sharing room (e.g. 1 for Single Room, 2 for Double, 3 for Triple).
              </p>
            </div>
          </div>

          {/* Room Type (1BHK, 2BHK, 3BHK, etc.) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Room Type / Flat Configuration *
              </label>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Selected: {roomType}
              </span>
            </div>

            {/* Clickable Choice Buttons for 1BHK, 2BHK, 3BHK, etc. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ROOM_TYPE_OPTIONS.map((rt) => {
                const isSelected = roomType === rt;
                return (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setRoomType(rt)}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 dark:border-emerald-500 dark:bg-emerald-600 text-white shadow-sm ring-2 ring-slate-900/10 dark:ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span>{rt}</span>
                    {isSelected && <span className="text-[11px]">✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Choose the accommodation configuration: <strong>1BHK</strong>, <strong>2BHK</strong>, <strong>3BHK</strong>, <strong>1RK</strong>, or studio flat.
            </p>
          </div>
        </div>

        {/* Section 2: Rent & Location */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Rent, Deposit & Distance to NMIET
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Monthly Rent (₹/month) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1000"
                  max="50000"
                  value={rent}
                  onChange={(e) => setRent(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Security Deposit (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Distance to NMIET Campus *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="50"
                  max="10000"
                  step="50"
                  placeholder="e.g. 400"
                  value={distanceMeters}
                  onChange={(e) =>
                    setDistanceMeters(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  meters
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Full Address / Area *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Samarth Colony, Near NMIET North Gate"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Nearest Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Behind Sports Ground, or Opp. Talegaon Station"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Food / Mess Arrangement
              </label>
              <select
                value={foodOption}
                onChange={(e) => setFoodOption(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Pure Veg Mess Included (Breakfast & Dinner)">
                  Pure Veg Mess Included in Rent
                </option>
                <option value="Available Optional (Mess Nearby @ ₹2400/mo)">
                  Mess Available Optional
                </option>
                <option value="Self Cooking Kitchen with Gas & Utensils">
                  Self-Cooking Kitchen Allowed
                </option>
                <option value="Multiple Tiffin Services in Walking Distance">
                  Tiffin Services Nearby
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Electricity Charges
              </label>
              <input
                type="text"
                value={electricityCharges}
                onChange={(e) => setElectricityCharges(e.target.value)}
                placeholder="e.g. Included in rent or Sub-metered"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Amenities */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Amenities & Facilities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {POPULAR_AMENITIES.map((amenity) => {
              const active = amenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-2.5 text-xs text-left rounded-xl border transition-colors flex items-center justify-between cursor-pointer ${
                    active
                      ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{amenity}</span>
                  {active && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Description & Rules */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            4. Details & Rules
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Description & Roommate Expectations
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the room, atmosphere, current roommates, cleanliness..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Rules & Guidelines (One per line)
            </label>
            <textarea
              rows={3}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="e.g. Gate closes at 10:30 PM"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* Section 5: Contact Person Details */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            5. Contact Person
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Phone Number (Calls) *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                placeholder="e.g. 919822014589"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
          >
            Publish Vacancy
          </button>
        </div>
      </form>
    </div>
  );
};
