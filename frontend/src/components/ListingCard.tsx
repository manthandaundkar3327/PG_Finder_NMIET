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

  // Dynamic theme colors based on gender
  const cardBorder = isBoys
    ? 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-50/50 dark:hover:shadow-blue-950/30'
    : isGirls
    ? 'border-pink-200 dark:border-pink-900/60 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-pink-50/50 dark:hover:shadow-pink-950/30'
    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600';

  const headerBg = isBoys
    ? 'bg-blue-50/80 dark:bg-blue-950/50 border-b border-blue-100 dark:border-blue-900/50'
    : isGirls
    ? 'bg-pink-50/80 dark:bg-pink-950/50 border-b border-pink-100 dark:border-pink-900/50'
    : 'bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800';

  const badgeTheme = isBoys
    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
    : isGirls
    ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-900 dark:text-pink-200 border border-pink-200 dark:border-pink-800'
    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700';

  const titleHover = isBoys
    ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
    : isGirls
    ? 'group-hover:text-pink-600 dark:group-hover:text-pink-400'
    : 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400';

  const ctaBtn = isBoys
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : isGirls
    ? 'bg-pink-600 hover:bg-pink-700 text-white'
    : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white';

  const getGenderLabel = (type: PGListing['type']) => {
    switch (type) {
      case 'boys':
        return 'Boys PG';
      case 'girls':
        return 'Girls PG';
      case 'unisex':
        return 'Co-ed / Shared Flat';
    }
  };

  const getSharingLabel = (sharing: PGListing['sharing']) => {
    if (typeof sharing === 'number' || (!isNaN(Number(sharing)) && typeof sharing === 'string' && sharing.trim() !== '')) {
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

  const distanceText =
    listing.distanceMeters < 1000
      ? `${listing.distanceMeters}m from NMIET`
      : `${(listing.distanceMeters / 1000).toFixed(1)} km from NMIET`;

  const walkingMinutes = Math.max(1, Math.round(listing.distanceMeters / 80));

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
        className={`group h-full bg-white dark:bg-slate-900 rounded-2xl border ${cardBorder} shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden text-slate-900 dark:text-slate-100`}
      >
        {/* Card Header Strip (Colored by Gender: Blue for Boys, Pink for Girls) */}
        <div className={`px-4 py-3 ${headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {/* Gender Badge */}
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${badgeTheme}`}>
              {getGenderLabel(listing.type)}
            </span>
            {listing.roomType && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                {listing.roomType}
              </span>
            )}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {getSharingLabel(listing.sharing)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Dot */}
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  listing.isAvailable ? 'bg-emerald-500' : 'bg-rose-400'
                }`}
              />
              <span>{listing.isAvailable ? 'Available' : 'Occupied'}</span>
            </span>

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(listing.id);
              }}
              aria-label={saved ? 'Remove from saved' : 'Save to favorites'}
              className={`p-1.5 rounded-lg transition-colors ${
                saved
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-white/80 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className={`font-bold text-slate-900 dark:text-white text-base leading-snug transition-colors line-clamp-1 ${titleHover}`}
            >
              {listing.title}
            </h3>
            {listing.isVerified && (
              <span
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5"
                title="Verified Accommodation near NMIET"
              >
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Location & Walking Distance */}
          <div className="flex items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1.5 min-w-0 pr-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="line-clamp-1 font-medium">{listing.landmark}</span>
            </div>
            <button
              type="button"
              onClick={handleDirections}
              title="Get directions in Google Maps"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 shrink-0 transition-colors cursor-pointer group/dir"
            >
              <Navigation className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover/dir:-translate-y-0.5 group-hover/dir:translate-x-0.5 transition-transform" />
              <span>Map</span>
            </button>
          </div>

          {/* Distance Banner */}
          <div
            className={`flex items-center justify-between text-xs px-2.5 py-1 rounded-lg mb-3 ${
              isBoys
                ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-100/60 dark:border-blue-900/40'
                : isGirls
                ? 'bg-pink-50/70 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 border border-pink-100/60 dark:border-pink-900/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="font-semibold">{distanceText}</span>
            <span className="flex items-center gap-1 text-[11px] opacity-80">
              <Clock className="w-3 h-3" /> ~{walkingMinutes} min walk
            </span>
          </div>

          {/* Food / Mess arrangement */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{listing.foodOption}</span>
          </div>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 text-xs mb-4">
            {listing.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Footer: Price and Actions */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">₹</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {listing.rent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/mo</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Deposit: ₹{listing.deposit.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDirections}
                title="Get directions in Google Maps"
                className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer group/navbtn"
                aria-label="Directions in Google Maps"
              >
                <Navigation className="w-4 h-4 group-hover/navbtn:-translate-y-0.5 group-hover/navbtn:translate-x-0.5 transition-transform" />
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                title="Chat on WhatsApp"
                className="p-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCall}
                title="Call Contact"
                className="p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedListing(listing)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-0.5 cursor-pointer ${ctaBtn}`}
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
};
