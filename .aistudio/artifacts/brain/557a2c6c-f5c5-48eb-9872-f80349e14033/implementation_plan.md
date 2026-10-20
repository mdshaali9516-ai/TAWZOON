# Full GitHub Repository Sync & Execution — TAWZOON Nexus

Synchronize and run the complete TAWZOON production application from [github.com/shahalinexus-commits/tawzoon](https://github.com/shahalinexus-commits/tawzoon) inside Google AI Studio, matching all latest features, reseller storefronts, product sizing, interactive Telegram notifications, and data fixtures.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped by the user, so the recommended configuration is being adopted:
> - **Full Repository Synchronization**: All updated source files, new components (`ResellerStorefrontView`, `PublicAddingToOrderBanner`), utilities (`productSizes.ts`, pricing logic), and UI assets from the GitHub repository are synchronized.
> - **Database Catalog Sync**: Data files (`data/store.json` and `src/data/store.json`) are synchronized to match the exact live fixtures from the repository while backing up previous files.
> - **Zero-Pill Anti-Slop & Design Constitution Compliance**: Ensuring all layouts maintain clean typography, WCAG AA contrast, and zero broken image paths.

- **Confirmed Decision 1**: Synchronize all code, assets, and database schemas directly from `shahalinexus-commits/tawzoon`.
- **Confirmed Decision 2**: Enable full feature set including Reseller Micro-Storefronts (`/shop/:slug` and `?store=slug`), public order notification banners, multi-photo Telegram integration, and size variant pickers.

---

### 1. Overview & Core Concept

- **What It Does**: TAWZOON is an all-in-one e-commerce and multi-tier reseller ecosystem designed for Bangladeshi commerce. It features a high-conversion public storefront with Cash on Delivery (COD) and bKash workflows, an independent Reseller Portal enabling resellers to create custom-branded micro-shops with custom profit margins, an Employee Portal for fulfillment management, and a unified Admin Management Console with live Telegram bot dispatch and real-time status callbacks.
- **Target Audience**: 
  - Direct retail consumers purchasing fashion, watches, gadgets, and lifestyle products.
  - Independent entrepreneurs and resellers launching digital shops without holding physical inventory.
  - Warehouse and operations staff processing shipments and tracking customer history.
  - Store administrators monitoring margins, profits, payouts, and customer fulfillment.
- **Key Value**: Delivers zero-friction local commerce, immediate reseller business generation with localized pricing, real-time Telegram alerts with interactive order approval buttons, and seamless mobile-first PWA responsiveness.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Public Customer Browsing & Ordering*: Customer explores curated collections, selects product variants (sizes, colors), adds to cart with real-time drawer feedback, views the sticky floating order banner, and checks out with localized Bangladesh address autocomplete and COD/bKash payment.
  2. *Reseller Micro-Storefront (`/shop/:slug`)*: Customers visiting a reseller's custom link encounter the reseller's custom-branded shop banner, curated items, and personalized retail prices with transparent profit margin tracking for the reseller.
  3. *Reseller Dashboard & Tools*: Resellers generate marketing videos, track cash memos, view pending/paid commissions, manage bank/mobile withdrawals, and recruit sub-resellers.
  4. *Admin Management & Telegram Order Dispatch*: When an order is submitted, the Express backend sends order details and high-resolution product photos directly to the administrator's Telegram group/channel. Inline buttons enable instantaneous order confirmation or cancellation with synchronized database updates.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined Swiss-minimalist e-commerce with warm neutral canvas, high-contrast monochrome accents, and editorial typography.
  - *Color Palette & Tokens*:
    - Canvas: `--background: #FAFAFA` / Pure White `#FFFFFF`
    - Structural Surfaces: `--card: #FFFFFF`, `--border: #E2E8F0` / `#F1F5F9`
    - Primary Action: `--primary: #0F172A` (deep slate), hover `--primary-hover: #1E293B`
    - Accent: `--accent: #10B981` (emerald for confirmation/in-stock), `--bKash: #E2136E`
  - *Typography*:
    - Display & Headings: `Plus Jakarta Sans` with balanced headline tracking.
    - Body Prose: `Plus Jakarta Sans` / `Inter` with 1.5–1.6 line-height.
    - Currency & Data: Tabular figures (`tabular-nums font-mono`) for prices in BDT (৳) and metric alignments.
  - *Spatial Layout & Components*: 3-column desktop product grid (`gap-6` to `gap-8`), single-row 3-zone header navigation, contiguous PDP purchase modules, zero pill-badge clutter, and unboxed clean metadata.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express + Vite Architecture**
  - *Chosen Approach*: Maintain the integrated Node.js 22 server (`server.ts`) hosting Express API routes and Telegram webhooks alongside Vite development middleware on port 3000.
  - *Why*: Allows single-process execution compatible with AI Studio runtime constraints while supporting file persistence, Telegram polling, and image proxies.
  - *Alternatives Considered*: Pure client-side mock (fails to support server-side Telegram bot callbacks and secure webhook execution).

- **Decision 2: Local JSON Store with Firestore Synchronization Readiness**
  - *Chosen Approach*: Use `data/store.json` as the primary operational data store synchronized with the repository's current state, paired with `/server/db.ts` file storage and Firestore sync adapters.
  - *Why*: Preserves exact state compatibility with the GitHub repository while allowing instant zero-latency development and persistence.

- **Decision 3: Multi-Photo Telegram Dispatch Delivery**
  - *Chosen Approach*: Send each ordered item's photo individually with captions and inline markdown callback markup as implemented in the latest GitHub commit, ensuring high-reliability mobile Telegram rendering.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TAWZOON Client Layer (React 19)                 │
│                                                                        │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │  Public Storefront  │   │  Reseller Portal  │   │ Admin / Staff│   │
│   │  - Hero & Catalog   │   │  - Custom Shop    │   │ - Orders     │   │
│   │  - Size Selector    │   │  - Margins/Memos  │   │ - Telegram   │   │
│   │  - Cart & Checkout  │   │  - Earnings & Pay │   │ - Products   │   │
│   └──────────┬──────────┘   └─────────┬─────────┘   └──────┬───────┘   │
│              │                        │                    │           │
│              └────────────────────────┼────────────────────┘           │
│                                       ▼                                │
│                           AppContext & Client API                      │
└───────────────────────────────────────┬────────────────────────────────┘
                                        │ HTTP / JSON
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express Backend (Node.js 22)                    │
│                                                                        │
│   ┌──────────────────┐   ┌─────────────────────┐   ┌───────────────┐   │
│   │  API Endpoints   │   │ Telegram Bot Engine │   │ AI Proxy      │   │
│   │  - /api/products │   │ - Multi-photo alert │   │ - GenAI image │   │
│   │  - /api/orders   │   │ - Inline callbacks  │   │ - Video audio │   │
│   │  - /api/reseller │   │ - Status sync       │   │               │   │
│   └────────┬─────────┘   └──────────┬──────────┘   └───────────────┘   │
│            └───────────────┬────────┘                                  │
│                            ▼                                           │
│                 Storage Layer (data/store.json)                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Components & File Synchronization Map
1. **New Components to Sync**:
   - `src/components/public/ResellerStorefrontView.tsx`: Full reseller public storefront view with customized profit margins.
   - `src/components/public/PublicAddingToOrderBanner.tsx`: Floating action toast banner notifying customers when items are added.
   - `src/utils/productSizes.ts`: Apparel and footwear sizing matrix and validator.
   - `src/utils/pricing.test.ts`: Automated pricing and margin unit tests.
2. **Updated Components to Sync**:
   - `server.ts`: Multi-photo Telegram delivery and poller.
   - `src/App.tsx`: Route detection for `/shop/:slug` and `?store=slug`.
   - `src/components/AdminPortal.tsx`: Telegram bot token and chat ID integration.
   - `src/components/common/PublicCartDrawer.tsx` & `src/components/public/PublicOrderCheckoutModal.tsx`: Sizing support and checkout refinements.
   - `src/components/ProductCard.tsx`, `ProductDetailsModal.tsx`, `ProductDetailsPage.tsx`: Interactive size variant buttons and image galleries.
   - `src/components/reseller/ResellerWebsiteGeneratorTab.tsx`: Micro-storefront link generator and live preview.
   - `src/data/store.json` & `data/store.json`: Updated products, categories, and settings.
   - `public/assets/aistudio/*`: All visual assets from the repository.
3. **Execution & Build Verification**:
   - Install dependencies (`package.json`).
   - Run compilation check (`npm run build` / `compile_applet`).
   - Verify dev server starts cleanly on port 3000 (`0.0.0.0`).
