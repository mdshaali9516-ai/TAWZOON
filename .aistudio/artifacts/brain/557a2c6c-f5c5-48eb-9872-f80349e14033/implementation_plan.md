# Implementation Plan - Permanent Reseller Storage & Real-Time Sync

## User Goal
Ensure reseller accounts created by users are saved permanently, preventing them from vanishing or resetting on refresh/restart, and ensure real-time updates of referral bonuses, reseller wholesale pricing margins, and fee deductions across the network.

## Proposed Changes

### 1. Backend Server Database Persistence (`server/db.ts`)
- **Prevent Overwriting Custom Resellers**: Modify `ensureCoreData()` so that default hardcoded test accounts (`emp-shaali`, `emp-ali`, `emp-c`, `emp-d`) are only populated if `this.state.employees` is completely empty or uninitialized, ensuring any custom-created resellers and downline networks are never overwritten or deleted by default data seeding.
- **Robust Firestore & Local Sync (`initCloudSync` & `forcePullFromCloud`)**:
  - Ensure newly registered reseller accounts are immediately persisted to both local `store.json` and Firestore collection `employees`.
  - Add explicit error handling and optimistic local state retention so that if Firestore quota or network issues occur, local records are fully preserved.

### 2. Frontend Reseller Management & Real-Time UI (`src/`)
- **Reseller Registration & Persistence Flow**:
  - Verify API endpoints for reseller creation (`/api/employees` or registration endpoints) correctly save data with `isOfflineCreated` flag and sync to Firestore.
- **Live Bonus & Wholesale Pricing Calculation**:
  - Ensure reseller reference settings (default rate, max cap, non-official markup, official referral code) reflect instantly in real-time pricing and profit breakdowns for each reseller (A, B, C, D, etc.).
  - Display accurate reference codes, referral owner names, and fee deduction statuses in every reseller profile view.

## Status: COMPLETED

All user requirements have been fully implemented and verified:
1. **Unified Reference Account Profile Structure**: Official and personal reseller reference cards now follow the exact same uniform 6-row section (Type, Referrer Name, Mobile Number, Referral Code, Fee Deduction status, and Max Bonus Limit rule).
2. **Dynamic Live Bonus & Profit Sync**: Changing the referral max bonus limit (e.g. 10 TK or 15 TK) instantly reflects as "৳X টাকা প্রতি ১০০ টাকায় (১০০ টাকাতে ৳X প্রফিট, সর্বোচ্চ লিমিট ১০০ টাকায় ৳X লাভ)" across Admin Portal, Reseller Profile, and downline member details modals.
3. **Automatic Wholesale Margin Integration**: Entering a margin (e.g. 15 TK) in admin immediately calculates and adds +15 TK to the reseller's wholesale price (পাইকারি মূল্য) across all product cards and modals (`baseCostPrice = getResellerWholesalePrice`), ensuring accurate unit profits.
4. **Real-time Synchronization & Permanent Storage**: SSE broadcast triggers live updates for all active dashboards without requiring page reload, while preserving all accounts in both local JSON and Firestore.
