import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { FindPgView } from './components/FindPgView';
import { CreateVacancyView } from './components/CreateVacancyView';
import { MyPostsView } from './components/MyPostsView';
import { SavedView } from './components/SavedView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { EditVacancyModal } from './components/EditVacancyModal';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { Floating3DBackground } from './components/Floating3DBackground';
import { AdminView } from './components/AdminView';

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedListing,
    setSelectedListing,
    editingListing,
    setEditingListing,
  } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-slate-900 dark:selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* 3D Floating Objects Background */}
      <Floating3DBackground />

      {/* Top Header Navigation */}
      <Header />

      {/* Main View Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'find' && <FindPgView />}
        {activeTab === 'create' && <CreateVacancyView />}
        {activeTab === 'my-posts' && <MyPostsView />}
        {activeTab === 'saved' && <SavedView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Detail Lightbox Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {/* Edit Vacancy Modal */}
      {editingListing && (
        <EditVacancyModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Alert Notifications */}
      <ToastContainer />

      {/* Login & Register Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
      <Analytics />
    </AppProvider>
  );
}
