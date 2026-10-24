import React from 'react';
import { PGListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Heart,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Share2,
  Building,
  Utensils,
  Check,
  Navigation,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: PGListing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const { toggleSave, isSaved, showToast } = useApp();
  const saved = isSaved(listing.id);

  const isBoys = listing.type === 'boys';
  const isGirls = listing.type === 'girls';

  const modalHeaderBg = isBoys
    ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-100 dark:border-blue-900/50 text-blue-950 dark:text-blue-100'
    : isGirls
    ? 'bg-pink-50/90 dark:bg-pink-950/70 border-pink-100 dark:border-pink-900/50 text-pink-950 dark:text-pink-100'
    : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100';

  const badgeBg = isBoys
    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
    : isGirls
    ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800'
    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

  const proximityCardBg = isBoys
    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/40 text-blue-950 dark:text-blue-100'
    : isGirls
    ? 'bg-pink-50/80 dark:bg-pink-950/40 border-pink-200/80 dark:border-pink-900/40 text-pink-950 dark:text-pink-100'
    : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100';

  const walkingMinutes = Math.max(1, Math.round(listing.distanceMeters / 80));
  const cyclingMinutes = Math.max(1, Math.round(listing.distanceMeters / 250));

  const handleWhatsApp = () => {
    const cleanNumber = listing.contactWhatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${listing.contactName}, I found your accommodation "${listing.title}" on PG Finder NMIET. I am interested and would like to know if it is currently vacant for admission.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${listing.title} - PG Finder NMIET`,
          text: `Check out ${listing.title} near NMIET campus (${listing.distanceMeters}m away). Rent ₹${listing.rent}/mo.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${listing.title} near NMIET Talegaon (Rent: ₹${listing.rent}/mo, Contact: ${listing.contactPhone})`
      );
      showToast('Listing details copied to clipboard!', 'info');
    }
  };

  const handleDirections = () => {
    const query = `${listing.title}, ${listing.landmark ? listing.landmark + ', ' : ''}${listing.address}`;
    const hasRegion = /talegaon|pune/i.test(query);
    const destination = hasRegion ? query : `${query}, Talegaon Dabhade, Pune`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Box */}
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${modalHeaderBg}`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-0.5 rounded-md border text-xs font-bold capitalize ${badgeBg}`}>
              {listing.type === 'boys' ? 'Boys PG' : listing.type === 'girls' ? 'Girls PG' : 'Co-ed / Shared Flat'}
            </span>
            {listing.roomType && (
              <span className="px-2.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                {listing.roomType}
              </span>
            )}
            <span className="capitalize">
              {typeof listing.sharing === 'number' || (!isNaN(Number(listing.sharing)) && typeof listing.sharing === 'string' && listing.sharing.trim() !== '')
                ? Number(listing.sharing) === 1
                  ? 'Single Room'
                  : `${listing.sharing}-Sharing`
                : `${listing.sharing} sharing`}
            </span>
            {listing.isVerified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> NMIET Verified
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Share listing"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSave(listing.id)}
              className={`p-2 rounded-lg transition-colors ${
                saved
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title="Save listing"
              aria-label="Save"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Title & Key Pricing Grid */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{listing.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <p className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{listing.address}</span>
                </p>
                <button
                  type="button"
                  onClick={handleDirections}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer group/dir"
                  title="Open directions in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover/dir:-translate-y-0.5 group-hover/dir:translate-x-0.5 transition-transform" />
                  <span>Google Maps Directions</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-5">Landmark: {listing.landmark}</p>
            </div>

            {/* Rent & Deposit block */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 min-w-[200px] shrink-0 text-left">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Rent</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">₹</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {listing.rent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ bed / month</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Security Deposit:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{listing.deposit.toLocaleString('en-IN')}</span>
              </div>
              {listing.roomType && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span>Room / Flat Type:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{listing.roomType}</span>
                </div>
              )}
              {listing.electricityCharges && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Electricity: {listing.electricityCharges}
                </div>
              )}
            </div>
          </div>

          {/* Proximity to NMIET Campus Banner */}
          <div className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${proximityCardBg}`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                NMIET Campus Proximity
              </div>
              <p className="text-sm font-semibold mt-0.5">
                {listing.distanceMeters < 1000
                  ? `Only ${listing.distanceMeters} meters away from NMIET college gate`
                  : `${(listing.distanceMeters / 1000).toFixed(1)} km from NMIET main campus`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>~{walkingMinutes} min walk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>~{cyclingMinutes} min cycle</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              About This Accommodation
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{listing.description}</p>
          </div>

          {/* Food & Dining Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">
                Food & Mess Arrangements
              </h4>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{listing.foodOption}</p>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Included Amenities & Facilities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {listing.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          {listing.rules && listing.rules.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Host Rules & Policies
              </h4>
              <ul className="space-y-2">
                {listing.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Host Contact Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Host / Student Coordinator
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">
                  {listing.contactName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Posted by {listing.postedByName} · Active on PG Finder
                </div>
              </div>
              <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                {listing.contactPhone}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:block">
            <div className="text-xs text-slate-500 dark:text-slate-400">Zero Commission · Direct Student Contact</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              NMIET Engineering Student Community
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDirections}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer group/navbtn"
              title="Get directions in Google Maps"
            >
              <Navigation className="w-4 h-4 group-hover/navbtn:-translate-y-0.5 group-hover/navbtn:translate-x-0.5 transition-transform" />
              <span>Directions</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquire</span>
            </button>
            <a
              href={`tel:${listing.contactPhone}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border dark:border-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Host</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
