import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PGListing, GenderType, SharingType, ROOM_TYPE_OPTIONS } from '../types';
import { POPULAR_AMENITIES } from '../data/mockListings';
import { X, Save, Edit3 } from 'lucide-react';

interface EditVacancyModalProps {
  listing: PGListing;
  onClose: () => void;
}

export const EditVacancyModal: React.FC<EditVacancyModalProps> = ({ listing, onClose }) => {
  const { updateListing } = useApp();

  const parseSharingNumber = (s: PGListing['sharing']): number => {
    if (typeof s === 'number') return s;
    if (!isNaN(Number(s))) return Number(s);
    if (s === 'single') return 1;
    if (s === 'double') return 2;
    if (s === 'triple') return 3;
    if (s === 'four') return 4;
    return 2;
  };

  const [title, setTitle] = useState(listing.title);
  const [type, setType] = useState<GenderType>(listing.type);
  const [sharing, setSharing] = useState<number>(() => parseSharingNumber(listing.sharing));
  const [roomType, setRoomType] = useState<string>(listing.roomType || '2 BHK');
  const [rent, setRent] = useState<number>(listing.rent);
  const [deposit, setDeposit] = useState<number>(listing.deposit);
  const [distanceMeters, setDistanceMeters] = useState<number>(listing.distanceMeters);
  const [address, setAddress] = useState(listing.address);
  const [landmark, setLandmark] = useState(listing.landmark);
  const [foodOption, setFoodOption] = useState(listing.foodOption);
  const [amenities, setAmenities] = useState<string[]>(listing.amenities);
  const [contactName, setContactName] = useState(listing.contactName);
  const [contactPhone, setContactPhone] = useState(listing.contactPhone);
  const [contactWhatsapp, setContactWhatsapp] = useState(listing.contactWhatsapp);
  const [description, setDescription] = useState(listing.description);
  const [rules, setRules] = useState<string>(listing.rules ? listing.rules.join('\n') : '');
  const [isAvailable, setIsAvailable] = useState<boolean>(listing.isAvailable);

  const handleAmenityToggle = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const ruleList = rules
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    updateListing({
      ...listing,
      title: title.trim(),
      type,
      sharing,
      roomType,
      rent: Number(rent),
      deposit: Number(deposit),
      distanceMeters: Number(distanceMeters),
      address: address.trim(),
      landmark: landmark.trim(),
      foodOption,
      amenities,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactWhatsapp: contactWhatsapp.trim(),
      description: description.trim(),
      rules: ruleList,
      isAvailable,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Edit Vacancy Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Gender</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GenderType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white pr-32"
                  placeholder="e.g. 2 for 2-sharing"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 pointer-events-none">
                  {sharing === 1 ? '1 Person (Single)' : `${sharing}-Sharing Room`}
                </span>
              </div>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Room Type / Flat Configuration *
              </label>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {roomType}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {ROOM_TYPE_OPTIONS.map((rt) => {
                const isSelected = roomType === rt;
                return (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setRoomType(rt)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 dark:border-emerald-500 dark:bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {rt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Rent (₹/mo)</label>
              <input
                type="number"
                required
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Deposit (₹)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Distance (meters)</label>
              <input
                type="number"
                value={distanceMeters}
                onChange={(e) => setDistanceMeters(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Food / Mess</label>
            <input
              type="text"
              value={foodOption}
              onChange={(e) => setFoodOption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_AMENITIES.map((item) => {
                const checked = amenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`p-2 text-xs text-left rounded-lg border transition-colors cursor-pointer ${
                      checked
                        ? 'border-slate-900 bg-slate-900 dark:border-emerald-600 dark:bg-emerald-600 text-white font-medium'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">WhatsApp</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-900 dark:text-white">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded accent-slate-900 dark:accent-emerald-500"
              />
              <span>Listing is currently Available for booking</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
