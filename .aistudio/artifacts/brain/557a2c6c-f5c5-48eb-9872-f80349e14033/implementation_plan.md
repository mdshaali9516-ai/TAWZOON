# Implementation Plan - Upline Referral Limit Propagation to Downlines

## Goal
When a reseller (or admin on behalf of a reseller) updates the **Referral Max Bonus Limit** (রেফারেন্স সর্বোচ্চ বোনাস লিমিটেড) in their dashboard (e.g., Shah Ali A updating their bonus limit to 12 or 15), automatically propagate this new rate to all their direct downline reseller accounts (e.g., Ali B) so their wholesale prices update instantly.

## Steps

### 1. Update Backend Propagation Logic (`server.ts`)
- In `app.put('/api/admin/employees/:id')`, when `referralCommissionRate` is updated:
  - Find all direct downline members where `e.referralOwnerId === emp.id` or `e.referredBy === emp.referenceCode` / `emp.id` or `e.reference === emp.referenceCode`.
  - For each downline member, check if a custom override exists (`emp.downlineCustomRates?.[member.id]`).
  - If no custom override exists, update `member.referralCommissionRate = newRate` and `member.resellerMargin = newRate`.
  - Sync each updated downline member via `db.syncEntityDirect`.

### 2. Real-time Broadcast
- Ensure `RESELLER_MARGIN_UPDATED` and `STATE_UPDATED` SSE events broadcast successfully so all connected client dashboards refresh and show updated prices instantly.

### 3. Verification
- Test changing the Referral Max Bonus Limit in the Admin Portal for Shah Ali (A).
- Verify that Ali (B) and other downline accounts automatically reflect the new margin and updated wholesale prices.
- Verify page refresh persistence and isolation from unrelated reseller chains.
