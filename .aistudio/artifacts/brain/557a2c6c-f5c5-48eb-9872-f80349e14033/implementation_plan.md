# Implementation Plan - Independent Reseller Margin Management

## Goal
Disable automatic propagation of referral commission rate and margin updates across the reseller hierarchy. Ensure each reseller's margin settings are managed independently.

## Changes
1.  **Modify Backend Logic**: 
    - Identify and remove any code responsible for recursively or iteratively updating downline resellers when an upline reseller's commission rate or margin is updated.
    - Ensure that updates to a reseller's margin/commission rate only affect that specific reseller record.
2.  **API/Database Update**:
    - Ensure the API endpoint responsible for updating reseller settings (`/api/admin/employees/:id`) only modifies the targeted employee record.
3.  **Verification**:
    - Test updating an upline reseller's (A) margin and verify that direct downline (B) and indirect downline (C) margins remain unchanged.
    - Test updating a specific downline reseller's (B) margin and verify it remains independent.
