import { Product, Employee, BrandSettings } from '../types/index.js';

export function isOfficialReferenceCode(code?: string | null): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase().replace(/[\s\-_]/g, '');
  return (
    clean === 'TAWZOON9516' ||
    clean === 'TAUZON9516' ||
    clean === 'TAWZOON' ||
    clean === 'TAUZON' ||
    clean === '9516' ||
    clean === '1095' ||
    clean === 'OFFICIAL' ||
    clean === 'OFFICIALTAWZOON' ||
    clean === 'TAWZOONOFFICIAL'
  );
}

export function isOfficialReferenceActive(
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): boolean {
  const officialCode = (brandSettings?.officialReferralCode || 'TAWZOON9516').toUpperCase().trim();

  // 1. Logged in reseller / employee check
  if (employee) {
    if (employee.isOfficialReferral === true) return true;
    if (employee.referralOwnerId === 'OFFICIAL_TAWZOON') return true;
    const empRef = (employee.reference || (employee as any).referredBy || '').toUpperCase().trim();
    const empCode = (employee.referenceCode || '').toUpperCase().trim();
    if (empRef === officialCode || isOfficialReferenceCode(empRef)) return true;
    if (empCode === officialCode || isOfficialReferenceCode(empCode)) return true;
    return false;
  }

  // 2. Browser active URL check (?ref=... or ?referral=...)
  if (typeof window !== 'undefined') {
    try {
      const search = new URLSearchParams(window.location.search);
      const refParam = search.get('ref') || search.get('referral');
      if (refParam) {
        const cleanRef = refParam.toUpperCase().trim();
        sessionStorage.setItem('tawzoon_invite_ref', cleanRef);
        return cleanRef === officialCode || isOfficialReferenceCode(cleanRef);
      }

      // 3. Browser session storage check
      const storedRef = sessionStorage.getItem('tawzoon_invite_ref');
      if (storedRef) {
        const cleanStored = storedRef.toUpperCase().trim();
        return cleanStored === officialCode || isOfficialReferenceCode(cleanStored);
      }
    } catch {}
  }

  // 4. Default visitor (no referral code): NOT official
  return false;
}

/**
 * Returns the effective Reseller Margin (in TK):
 * - Official Reference: 0 Tk (Strictly zero markup)
 * - Admin Overridden Reseller: Admin Defined Margin (e.g., 8 Tk, 20 Tk)
 * - Default Reseller / Visitor: 10 Tk
 */
export function getEffectiveResellerMargin(
  product?: Partial<Product> | null,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  if (isOfficialReferenceActive(employee, brandSettings) || (product as any)?.isOfficialReferral === true) {
    return 0;
  }

  // 1. Admin manual margin override set on the specific logged-in reseller
  if (employee && employee.resellerMargin !== undefined && employee.resellerMargin !== null) {
    return Number(employee.resellerMargin);
  }

  // 2. Margin already stamped by backend for this referral session
  if (product && (product as any).referralMarkup !== undefined && (product as any).referralMarkup !== null) {
    return Number((product as any).referralMarkup);
  }

  // 3. Default fallback
  return Number(brandSettings?.nonOfficialMarkup ?? 10);
}

/**
 * Module 1, Rule 1 & 2:
 * User_Display_Price = Admin_Base_Price + Reseller_Margin
 * - Official: Exactly Admin Base Price (0 Tk added)
 * - Referral / Default: Admin Base Price + Margin (default +10 Tk, or custom admin override)
 */
export function getAdjustedSellingPrice(
  product: Product,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  // Pure Admin Base Price
  const adminBasePrice = (product as any).baseSellingPrice !== undefined
    ? Number((product as any).baseSellingPrice)
    : Number(product.sellingPrice || 0);

  const margin = getEffectiveResellerMargin(product, employee, brandSettings);
  return adminBasePrice + margin;
}

/**
 * Module 1, Rule 1 & 2:
 * Regular Price:
 * - Official: Exactly Admin Regular Price
 * - Referral / Default: Admin Regular Price + Margin
 */
export function getAdjustedRegularPrice(
  product: Product,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  const adminBaseSelling = (product as any).baseSellingPrice !== undefined
    ? Number((product as any).baseSellingPrice)
    : Number(product.sellingPrice || 0);

  const rawRegular = (product as any).baseRegularPrice !== undefined
    ? Number((product as any).baseRegularPrice)
    : (product.regularPrice && product.regularPrice > adminBaseSelling ? Number(product.regularPrice) : adminBaseSelling);

  const margin = getEffectiveResellerMargin(product, employee, brandSettings);
  return rawRegular + margin;
}

/**
 * Module 1, Rule 3: Fixed Payout Engine
 * Reseller profit must NOT be calculated proportionally; it must follow a FIXED rate logic set by the admin margin.
 * Scenario Example:
 * If Admin Margin for Reseller A is set to 20 Tk:
 * If reseller sells making 100 Tk total profit, Reseller A receives EXACTLY 20 Tk.
 * If total profit is 101, 120, or 200 Tk, Reseller A STILL receives EXACTLY 20 Tk.
 */
export function getResellerProfitPerUnit(
  product: Product,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  if (!employee) return 0;

  const isOfficial = isOfficialReferenceActive(employee, brandSettings) || (product as any)?.isOfficialReferral === true;

  if (isOfficial) {
    if (employee.customCommissionRate && employee.customCommissionRate > 0) {
      return Math.round((Number(product.sellingPrice || 0) * employee.customCommissionRate) / 100);
    }
    if (product.commissionType === 'percentage') {
      return Math.round((Number(product.sellingPrice || 0) * (product.commissionRate || 10)) / 100);
    }
    return product.commissionRate || Math.round(Number(product.sellingPrice || 0) * 0.1);
  }

  // Non-official reseller: strictly FIXED payout equal to admin defined margin
  if (employee.resellerMargin !== undefined && employee.resellerMargin !== null) {
    return Number(employee.resellerMargin);
  }

  return Number(brandSettings?.nonOfficialMarkup ?? 10);
}
