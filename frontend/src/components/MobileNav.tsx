import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Search, PlusCircle, FileText, Bookmark, ShieldCheck } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, savedIds, listings, currentUser, isAdmin } = useApp();
  const myPostsCount = currentUser
    ? listings.filter((l) => l.postedBy === currentUser.id).length
    : 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      <button
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'explore' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="mt-0.5">Explore</span>
      </button>

      <button
        onClick={() => setActiveTab('find')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'find' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Search className={`w-5 h-5 ${activeTab === 'find' ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="mt-0.5">Find PG</span>
      </button>

      <button
        onClick={() => setActiveTab('create')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'create' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-emerald-600 dark:text-emerald-500'
        }`}
      >
        <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span className="mt-0.5">Post</span>
      </button>

      <button
        onClick={() => setActiveTab('my-posts')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
          activeTab === 'my-posts' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <FileText className={`w-5 h-5 ${activeTab === 'my-posts' ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="mt-0.5">My Posts</span>
        {myPostsCount > 0 && (
          <span className="absolute top-0.5 right-2 w-3.5 h-3.5 bg-slate-900 dark:bg-emerald-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {myPostsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('saved')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
          activeTab === 'saved' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="mt-0.5">Saved</span>
        {savedIds.length > 0 && (
          <span className="absolute top-0.5 right-2 w-3.5 h-3.5 bg-emerald-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {savedIds.length}
          </span>
        )}
      </button>

      {isAdmin && (
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'admin' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`} />
          <span className="mt-0.5">Admin</span>
        </button>
      )}
    </div>
  );
};
