import React from 'react';
import { PGListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Heart,
  Phone,
  MessageCircle,
  ShieldCheck,
  Utensils,
  ChevronRight,
  Clock,
  Navigation,
} from 'lucide-react';
import { Tilt3DCard } from './Tilt3DCard';

interface ListingCardProps {
  listing: PGListing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { setSelectedListing, toggleSave, isSaved } = useApp();
  const saved = isSaved(listing.id);

  const isBoys = listing.type === 'boys';
  const isGirls = listing.type === 'girls';

  // Distinct color themes matching the user specification:
  // Boys: Deep navy blue card (#081026 to #0d1c40), vibrant blue glowing border, royal blue badge
  // Girls: Deep wine/maroon card (#1c0a17 to #2a0e22), vibrant rose/crimson glowing border, deep crimson badge
  // Co-ed / Flat: Deep dark teal card (#051b19 to #092c27), vibrant teal glowing border, deep teal badge
  const theme = isBoys
    ? {
        cardBg:
          'bg-gradient-to-b from-blue-50/90 via-white to-blue-50/30 dark:from-[#0d1c40] dark:via-[#091228] dark:to-[#050b1a]',
        cardBorder:
          'border-blue-200/90 dark:border-blue-500/40 hover:border-blue-400 dark:hover:border-blue-400',
        cardGlow:
          'shadow-xs hover:shadow-xl dark:shadow-[0_4px_24px_rgba(29,78,216,0.18)] dark:hover:shadow-[0_8px_32px_rgba(37,99,235,0.35)]',
        badgeBg: 'bg-blue-600',
        badgeLabel: 'Boys PG',
        roomTypeBadge:
          'bg-blue-100/90 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800/80',
        titleHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-300',
        walkPill:
          'bg-blue-100/70 dark:bg-black/50 border-blue-200/80 dark:border-white/10 text-blue-950 dark:text-slate-200',
        primaryBtn:
          'bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-blue-500/30',
        mapBtn:
          'bg-blue-100/80 hover:bg-blue-200/80 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 dark:text-blue-300 dark:border-blue-500/30',
      }
    : isGirls
    ? {
        cardBg:
          'bg-gradient-to-b from-rose-50/90 via-white to-pink-50/30 dark:from-[#2a0e22] dark:via-[#1e0a17] dark:to-[#12050e]',
        cardBorder:
          'border-rose-200/90 dark:border-rose-500/40 hover:border-rose-400 dark:hover:border-rose-400',
        cardGlow:
          'shadow-xs hover:shadow-xl dark:shadow-[0_4px_24px_rgba(159,18,57,0.18)] dark:hover:shadow-[0_8px_32px_rgba(244,63,94,0.35)]',
        badgeBg: 'bg-[#9f1239]',
        badgeLabel: 'Girls PG',
        roomTypeBadge:
          'bg-rose-100/90 dark:bg-rose-950/70 text-rose-900 dark:text-pink-200 border-rose-200 dark:border-rose-800/80',
        titleHover: 'group-hover:text-rose-600 dark:group-hover:text-pink-300',
        walkPill:
          'bg-rose-100/70 dark:bg-black/50 border-rose-200/80 dark:border-white/10 text-rose-950 dark:text-slate-200',
        primaryBtn:
          'bg-rose-600 hover:bg-rose-500 text-white shadow-xs hover:shadow-rose-500/30',
        mapBtn:
          'bg-rose-100/80 hover:bg-rose-200/80 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30',
      }
    : {
        // Co-ed / Shared Flat
        cardBg:
          'bg-gradient-to-b from-teal-50/90 via-white to-emerald-50/30 dark:from-[#092c27] dark:via-[#061d1a] dark:to-[#031210]',
        cardBorder:
          'border-teal-200/90 dark:border-teal-500/40 hover:border-teal-400 dark:hover:border-teal-400',
        cardGlow:
          'shadow-xs hover:shadow-xl dark:shadow-[0_4px_24px_rgba(15,118,110,0.18)] dark:hover:shadow-[0_8px_32px_rgba(20,184,166,0.35)]',
        badgeBg: 'bg-[#0f766e]',
        badgeLabel: 'Co-ed Flat',
        roomTypeBadge:
          'bg-teal-100/90 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 border-teal-200 dark:border-teal-800/80',
        titleHover: 'group-hover:text-teal-600 dark:group-hover:text-teal-300',
        walkPill:
          'bg-teal-100/70 dark:bg-black/50 border-teal-200/80 dark:border-white/10 text-teal-950 dark:text-slate-200',
        primaryBtn:
          'bg-teal-600 hover:bg-teal-500 text-white shadow-xs hover:shadow-teal-500/30',
        mapBtn:
          'bg-teal-100/80 hover:bg-teal-200/80 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:hover:bg-teal-500/25 dark:text-teal-300 dark:border-teal-500/30',
      };

  const getSharingLabel = (sharing: PGListing['sharing']) => {
    if (
      typeof sharing === 'number' ||
      (!isNaN(Number(sharing)) && typeof sharing === 'string' && sharing.trim() !== '')
    ) {
      const num = Number(sharing);
      if (num === 1) return 'Single Room';
      return `${num}-Sharing`;
    }
    switch (sharing) {
      case 'single':
        return 'Single Room';
      case 'double':
        return '2-Sharing';
      case 'triple':
        return '3-Sharing';
      case 'four':
        return '4-Sharing';
      default:
        return `${sharing}-Sharing`;
    }
  };

  const walkingMinutes = Math.max(1, Math.round(listing.distanceMeters / 80));
  const distanceFormatted =
    listing.distanceMeters < 1000
      ? `${listing.distanceMeters}m`
      : `${(listing.distanceMeters / 1000).toFixed(1)} km`;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = listing.contactWhatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${listing.contactName}, I found your listing "${listing.title}" on PG Finder NMIET. Is the room currently available?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${listing.contactPhone}`;
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = `${listing.title}, ${listing.landmark ? listing.landmark + ', ' : ''}${listing.address}`;
    const hasRegion = /talegaon|pune/i.test(query);
    const destination = hasRegion ? query : `${query}, Talegaon Dabhade, Pune`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Tilt3DCard
      maxTilt={8}
      perspective={1000}
      scale={1.02}
      className="h-full rounded-2xl"
      onClick={() => setSelectedListing(listing)}
    >
      <div
        className={`group h-full ${theme.cardBg} rounded-2xl border ${theme.cardBorder} ${theme.cardGlow} transition-all duration-300 cursor-pointer flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 p-4 sm:p-5`}
      >
        {/* Top Header Row: Category Badge + Status & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Pill Badge matching the user design */}
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full text-white tracking-wide shadow-xs ${theme.badgeBg}`}
            >
              {theme.badgeLabel}
            </span>

            {/* Room Type Tag (e.g. 2 BHK, 1 RK) */}
            {listing.roomType && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-2xs ${theme.roomTypeBadge}`}
              >
                {listing.roomType}
              </span>
            )}

            {/* Sharing Info */}
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              {getSharingLabel(listing.sharing)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Dot with Neon Glow Indicator */}
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  listing.isAvailable
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]'
                    : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.85)]'
                }`}
              />
              <span>{listing.isAvailable ? 'Available' : 'Occupied'}</span>
            </span>

            {/* Bookmark Heart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(listing.id);
              }}
              aria-label={saved ? 'Remove from saved' : 'Save to favorites'}
              title={saved ? 'Remove bookmark' : 'Save accommodation'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                saved
                  ? 'text-rose-500 dark:text-rose-400 bg-rose-500/20 border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 bg-white/40 dark:bg-white/5 border-slate-200/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Accommodation Title */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3
            className={`font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug line-clamp-1 transition-colors ${theme.titleHover}`}
          >
            {listing.title}
          </h3>
          {listing.isVerified && (
            <span
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1"
              title="Verified Accommodation near NMIET"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Distance & Walking Pill (Directly formatted like the screenshot: e.g. "350m · ~4 min walk") */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium mb-3 border ${theme.walkPill}`}
        >
          <span className="font-semibold tracking-wide">
            {distanceFormatted} · ~{walkingMinutes} min walk
          </span>
          <span className="flex items-center gap-1 text-[11px] opacity-75">
            <Clock className="w-3 h-3" /> from NMIET
          </span>
        </div>

        {/* Location & Directions Button */}
        <div className="flex items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-300 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
            <span className="truncate font-medium">{listing.landmark || listing.address}</span>
          </div>
          <button
            type="button"
            onClick={handleDirections}
            title="Get directions in Google Maps"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold shrink-0 transition-colors cursor-pointer border ${theme.mapBtn}`}
          >
            <Navigation className="w-3 h-3 transition-transform" />
            <span>Map</span>
          </button>
        </div>

        {/* Food / Mess arrangement */}
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 mb-2.5 bg-white/40 dark:bg-white/5 p-2 rounded-xl border border-slate-200/50 dark:border-white/10">
          <Utensils className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
          <span className="truncate">{listing.foodOption}</span>
        </div>

        {/* Key Amenities Tags */}
        <div className="flex flex-wrap gap-1.5 text-xs mb-3.5">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-md text-[11px] font-medium border border-slate-200/60 dark:border-white/10"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 self-center">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Price and Quick Actions */}
        <div className="mt-auto pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                ₹
              </span>
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                {listing.rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal ml-0.5">
                /mo
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Deposit: ₹{listing.deposit.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWhatsApp}
              title="Chat on WhatsApp"
              className="p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 hover:bg-emerald-200/80 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-200 dark:border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCall}
              title="Call Contact"
              className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedListing(listing)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-0.5 cursor-pointer ${theme.primaryBtn}`}
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
};
