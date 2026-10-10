# Implementation Plan - Fixing Product Deletion Persistence & Official Reference Pricing Mismatch

## User Issues Addressed
1. **Deleted Products Reappearing After Hours:** Cloud sync (`forcePullFromCloud` / background sync) re-downloads products from Firestore if tombstones are bypassed or if local backups/states merge unarchived/deleted items back.
2. **Official Reference Pricing Mismatch:** Discrepancy between backend (`server.ts`) and frontend (`src/utils/pricing.ts`) when evaluating whether an account or visitor is under the official reference code (`TAWZOON9516`), causing incorrect prices (extra markup or wrong discounts) to be shown.

---

## Proposed Changes

### 1. Unified Official Reference Detection (`src/utils/pricing.ts` & `server.ts`)
- Ensure both backend and frontend use an identical, strict helper function `isOfficialReferenceCode()` and `isOfficialEmployee()` / `isOfficialReferenceActive()`.
- Official reference `TAWZOON9516` (and variations like `TAWZOON`, `9516`, `OFFICIAL`) must guarantee 0 markup and exact Admin Base Selling and Regular Prices.

### 2. Bulletproof Product Deletion & Tombstone Enforcement (`server/db.ts`)
- In `forcePullFromCloud()`, strictly load `_deletions` tombstones first.
- Filter out any incoming cloud product whose ID exists in `deletedProductIds` or `deletedItemIds['products']`.
- Permanently delete matching Firestore documents and prevent local store backup restoration from resurrecting deleted items.

---

## Verification Plan
1. Compile applet & run linter.
2. Delete a product in Admin Panel, run Cloud Sync, and verify it does not reappear.
3. Test official reference user pricing to ensure base selling & regular prices match admin panel exactly without markup.
