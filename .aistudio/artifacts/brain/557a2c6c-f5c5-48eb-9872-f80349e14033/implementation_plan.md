# Repository Installation & Synchronization: SHA-ALI (TAWZOON)

Install and synchronize the latest codebase from `https://github.com/mdshahali9516-code/SHA-ALI` into the current application, incorporating refined order workflow modals, official referral commission handling, clipboard support, and comprehensive automated test suites.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions adopt the recommended defaults following Phase 1:
> - **Sync Scope**: Full synchronization of application logic, admin order modals, pricing calculations, and automated test suites from `mdshahali9516-code/SHA-ALI`.
> - **Data Safety**: Create an immediate timestamped backup of the current active `data/store.json` before syncing to guarantee zero loss of live orders, catalog products, and reseller accounts.
> - **Quality Assurance**: Run the newly added test suites (`tsx test-business-logic.ts`, `tsx test-order-flow.ts`, `tsx test-order-workflow.ts`) and verify TypeScript compilation with `npm run build`.

---

## 1. Overview & Core Concept

- **What It Does**: Synchronizes the upstream updates from the user's GitHub repository into the AI Studio deployment. This updates the backend server logic, reseller pricing rules, admin order confirmation and delivery modals, and test harnesses.
- **Target Audience / Persona**:
  - **Store Admins**: Enhanced order management with explicit confirmation modals, delivery verification modals, and reliable clipboard copy utilities.
  - **Resellers**: Accurate profit margins supporting explicit 0 Tk overrides, configured official referral codes, and transparent earnings calculation.
  - **Public Retail Customers**: Clean shopping experience in Bangladesh with real-time bKash and COD checkout.
- **Key Value**: Guarantees codebase parity between GitHub and the live development environment while preserving existing store data and proving correctness via automated integration tests.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Admin Order Confirmation**: Admin views pending orders, clicks confirmation, sees a dedicated confirmation dialog with itemized details, and advances the order to confirmed/preparing state.
  - **Admin Delivery Finalization**: Admin confirms delivery through a dedicated modal that securely releases reseller earnings and adjusts inventory.
  - **Reseller Commission Display**: Resellers see clean margin breakdowns on product cards and checkout memos without inconsistent rounding or negative profit margins.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined White Minimalist Luxury e-commerce and administration portal.
  - *Color Palette*: Canvas (`#FAFAFA`), pristine white cards (`#FFFFFF`), borders (`#E5E7EB`), text (`#111827`), accents in emerald (`#059669`) and deep indigo/slate.
  - *Typography*: Clean geometric sans (`Plus Jakarta Sans`), tabular figures (`tabular-nums`) for currency amounts in BDT (৳).
  - *Discipline*: Unboxed clean metadata (no decorative pill badge overload), single-elevation card hierarchy, and instant interactive feedback.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Safe Data Migration with Automatic Snapshot**
  - *Chosen Approach*: Back up `data/store.json` to `data/store.pre_github_sync.json` before applying updates. Ensure any new fields or schemas introduced by the repo are reconciled cleanly with existing records.
  - *Why*: Prevents accidental loss of user-created test orders or uploaded products while gaining all repository capabilities.
  - *Alternatives Considered*: Direct overwrite (risks discarding current sessions) vs. complete rejection (leaves bugs unfixed).

- **Decision 2: Automated Integration Testing in `package.json`**
  - *Chosen Approach*: Add the `"test"` command to `package.json` running all three test files: `test-business-logic.ts`, `test-order-flow.ts`, and `test-order-workflow.ts`.
  - *Why*: Enables rapid verification of business logic, commission calculations, and order status transitions directly inside the applet environment.

- **Decision 3: Robust Clipboard Utility**
  - *Chosen Approach*: Adopt the repo's fallback clipboard implementation using `document.execCommand('copy')` when modern `navigator.clipboard` is unavailable in restricted iframe contexts.
  - *Why*: Guarantees invoice and tracking code copying works smoothly across all devices and sandboxes.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────┐
│                      GitHub Upstream                      │
│            mdshahali9516-code/SHA-ALI (main)              │
└─────────────────────────────┬─────────────────────────────┘
                              │
                    [Synchronize & Merge]
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                   TAWZOON Application                    │
├─────────────────────────────┬─────────────────────────────┤
│ Frontend (React + Vite)     │ Backend (Express / Node.js) │
│ - AdminPortal.tsx (Modals)  │ - server.ts (Endpoints)     │
│ - ResellerOrdersTab.tsx     │ - Pricing & Margin Logic    │
│ - pricing.ts (Commission)   │ - Firestore & Local DB sync │
├─────────────────────────────┴─────────────────────────────┤
│ Automated Test Harnesses                                  │
│ - test-business-logic.ts                                  │
│ - test-order-flow.ts                                      │
│ - test-order-workflow.ts                                  │
└───────────────────────────────────────────────────────────┘
```

- **Execution Sequence**:
  1. Create safety snapshot of current `data/store.json`.
  2. Copy updated components and utility files from the repository (`server.ts`, `src/utils/pricing.ts`, `src/components/AdminPortal.tsx`, `src/components/reseller/ResellerOrdersTab.tsx`, `src/services/api.ts`, `src/types/index.ts`).
  3. Install the test runner files (`test-business-logic.ts`, `test-order-flow.ts`, `test-order-workflow.ts`) and update `package.json` scripts.
  4. Run automated test suites to verify order workflows and commission computations.
  5. Compile and build the applet to verify zero syntax or typing errors.
