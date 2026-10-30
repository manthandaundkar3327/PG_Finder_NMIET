import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
import { BrandIcon } from './BrandIcon';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center p-1">
                <BrandIcon className="w-5 h-5" />
              </div>
              <span>PG Finder NMIET</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              CampusNest student accommodation portal for Nutan Maharashtra Institute of Engineering &
              Technology (NMIET), Talegaon Dabhade, Pune.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Brokerage · Direct Contact</span><br/>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Navigation
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="hover:text-white transition-colors"
                >
                  Explore Accommodations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('find')}
                  className="hover:text-white transition-colors"
                >
                  Find PG & Roommates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('create')}
                  className="hover:text-white transition-colors"
                >
                  Post a Free Vacancy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my-posts')}
                  className="hover:text-white transition-colors"
                >
                  Manage My Vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('saved')}
                  className="hover:text-white transition-colors"
                >
                  Saved Shortlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Safety Advisory */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Student Advisory
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Always visit the PG / room personally with a friend before paying token advances. Verify
              mess quality, water availability, and electricity billing terms upfront.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              <span className="text-slate-300">NMIET Campus:</span> Samarth Vidya Sankul, Vishnupuri,
              Talegaon Dabhade, Pune - 410507
            </div>
          </div>
        </div>

          {/* Col 4: Student Neighborhoods */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[15px] font-medium pt-1">
              <span>For any Issue or HELP · Contact Admin</span>
            </div>
            <ul className="flex items-center gap-1.5 text-emerald-400 text-[15px] font-medium pt-1">
              Manthan Daundkar · +91 9226556138 <br/>
              Sanskar Anbhule · +91 9028176408 <br/>
            </ul>
          </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} PG Finder NMIET · Community student initiative for NMIET Talegaon.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for engineering students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
