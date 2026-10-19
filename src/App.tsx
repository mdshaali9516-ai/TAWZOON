/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { PublicStorefront } from './components/PublicStorefront.js';
import { EmployeePortal } from './components/EmployeePortal.js';
import { AdminPortal } from './components/AdminPortal.js';
import { ProductDetailsModal } from './components/ProductDetailsModal.js';
import { VisualSearchModal } from './components/common/VisualSearchModal.js';
import { ToastContainer } from './components/ToastContainer.js';
import { UserBottomNav } from './components/UserBottomNav.js';
import { PublicCartDrawer } from './components/common/PublicCartDrawer.js';
import { AIChatWidget } from './components/common/AIChatWidget.js';
import { PublicOrderCheckoutModal } from './components/public/PublicOrderCheckoutModal.js';

const MainView: React.FC = () => {
  const { activePortal, showPromo } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Dynamic Views */}
      <main className={`flex-1 ${showPromo ? 'pt-[85px] sm:pt-[92px]' : 'pt-[54px] sm:pt-[60px]'} ${activePortal !== 'admin' ? 'pb-20 sm:pb-22' : ''}`}>
        {activePortal === 'public' && <PublicStorefront />}
        {activePortal === 'employee' && <EmployeePortal />}
        {activePortal === 'admin' && <AdminPortal />}
      </main>

      {/* Permanent Bottom Navigation for Normal Users (Excludes Admin) */}
      <UserBottomNav />

      {/* Global Product Details Modal */}
      <ProductDetailsModal />

      {/* Global AI Visual Image Search Modal */}
      <VisualSearchModal />

      {/* Global Public Cart Slide-Over Drawer */}
      <PublicCartDrawer />

      {/* Global Public Order Checkout Modal */}
      <PublicOrderCheckoutModal />

      {/* Global Floating AI Chat Widget (Excludes Admin Portal) */}
      {activePortal !== 'admin' && <AIChatWidget />}

      {/* Global Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
}
