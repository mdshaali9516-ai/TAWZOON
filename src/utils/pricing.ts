import { Product, Employee, BrandSettings } from '../types/index.js';

export function isOfficialReferenceCode(code?: string | null): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase().replace(/[\s\-_]/g, '');
  return (
    clean === 'TAWZOON9516' ||
    clean === 'TAUZON9516' ||
    clean === 'TAWZOON' ||
    clean === 'TAUZON' ||
    clean === 'OFFICIAL' ||
    clean === 'OFFICIALTAWZOON' ||
    clean === 'TAWZOONOFFICIAL' ||
    clean.includes('TAWZOON') ||
    clean.includes('TAUZON')
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

  // 4. Default public store visitor (no reseller reference): Official store pricing
  return true;
}

/**
 * Returns the effective Reseller Margin (in TK):
 * - Official Reference / Public Store: 0 Tk (Strictly zero markup on public retail prices)
 * - Admin Overridden Reseller: Admin Defined Margin (e.g., 8 Tk, 20 Tk)
 * - Default Reseller: 10 Tk
 */
export function getEffectiveResellerMargin(
  product?: Partial<Product> | null,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  if (!employee || isOfficialReferenceActive(employee, brandSettings) || (product as any)?.isOfficialReferral === true) {
    return 0;
  }

  // 1. Admin manual margin override set on the specific logged-in reseller (if strictly > 0)
  if (employee.resellerMargin !== undefined && employee.resellerMargin !== null && Number(employee.resellerMargin) > 0) {
    return Number(employee.resellerMargin);
  }

  // 2. Margin already stamped by backend for this referral session (if strictly > 0)
  if (product && (product as any).referralMarkup !== undefined && (product as any).referralMarkup !== null && Number((product as any).referralMarkup) > 0) {
    return Number((product as any).referralMarkup);
  }

  // 3. Default fallback for non-official reseller (+10 TK)
  return Number(brandSettings?.nonOfficialMarkup || 10);
}

/**
 * Star Rating Discount Mapping (Configured in Admin Panel):
 * 5 Star -> 10%
 * 4 Star -> 15%
 * 3 Star -> 20%
 * 2 Star -> 25%
 * 1 Star -> 30%
 */
export function getStarDiscountPercent(starRating?: number | null): number {
  const stars = Math.round(Number(starRating || 5));
  switch (stars) {
    case 5:
      return 10;
    case 4:
      return 15;
    case 3:
      return 20;
    case 2:
      return 25;
    case 1:
      return 30;
    default:
      return 10;
  }
}

/**
 * Public Store Selling Price:
 * Matches EXACTLY the selling price set in the Admin Panel without any unexpected markups.
 */
export function getAdjustedSellingPrice(
  product: Product,
  _employee?: Partial<Employee> | null,
  _brandSettings?: Partial<BrandSettings> | null
): number {
  if (!product) return 0;
  const adminBasePrice = (product as any).baseSellingPrice !== undefined
    ? Number((product as any).baseSellingPrice)
    : Number(product.sellingPrice || 0);

  return adminBasePrice;
}

/**
 * Regular Price (Crossed-Out / Strike-through Price):
 * Automatically derived from the Admin Star Rating discount percentage rule
 * (e.g. 5 Stars = 10% discount, 4 Stars = 15% discount, etc.)
 * If an explicit regularPrice > sellingPrice was entered, it honors it.
 */
export function getAdjustedRegularPrice(
  product: Product,
  _employee?: Partial<Employee> | null,
  _brandSettings?: Partial<BrandSettings> | null
): number {
  if (!product) return 0;

  const selling = Number(product.sellingPrice || (product as any).baseSellingPrice || 0);
  if (selling <= 0) return 0;

  // 1. Explicit regularPrice from admin if strictly greater than sellingPrice
  const rawRegular = (product as any).baseRegularPrice !== undefined
    ? Number((product as any).baseRegularPrice)
    : (product.regularPrice ? Number(product.regularPrice) : 0);

  if (rawRegular > selling) {
    return rawRegular;
  }

  // 2. Automatically compute from Star Rating discount percentage
  const discountPercent = getStarDiscountPercent(product.starRating);
  const factor = 1 - (discountPercent / 100);
  if (factor > 0) {
    const calculated = Math.round(selling / factor);
    if (calculated > selling) {
      return calculated;
    }
  }

  // Fallback 12% above selling price
  return Math.round(selling * 1.12);
}

/**
 * Computes the discount percentage for badges:
 */
export function getProductDiscountPercent(product: Product): number {
  const selling = getAdjustedSellingPrice(product);
  const regular = getAdjustedRegularPrice(product);
  if (regular > selling && regular > 0) {
    return Math.round(((regular - selling) / regular) * 100);
  }
  return getStarDiscountPercent(product.starRating);
}

/**
 * Reseller Wholesale Cost Price (পাইকারি মূল্য):
 * - Official Reference / Public Store: product.originalPrice (zero markup)
 * - Referral Reseller: product.originalPrice + resellerMargin (e.g. +10, +15, +20 TK)
 */
export function getResellerWholesalePrice(
  product?: Partial<Product> | null,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null
): number {
  if (!product) return 0;
  const isOfficial = isOfficialReferenceActive(employee, brandSettings) || (product as any)?.isOfficialReferral === true;

  const baseCost = product.originalPrice !== undefined && product.originalPrice !== null
    ? Number(product.originalPrice)
    : Number(product.sellingPrice || 0);

  const markup = isOfficial ? 0 : getEffectiveResellerMargin(product, employee, brandSettings);
  return baseCost + ((product as any).referralMarkup !== undefined ? 0 : markup);
}

/**
 * Reseller Profit & Commission Engine:
 * - Profit = Sale Price - Wholesale Cost Price
 * Automatically calculates exact profit per unit (বিক্রয়মূল্য - পাইকারি মূল্য)
 */
export function getResellerProfitPerUnit(
  product: Product,
  employee?: Partial<Employee> | null,
  brandSettings?: Partial<BrandSettings> | null,
  customSalePrice?: number | null
): number {
  if (!product) return 0;

  const effectiveWholesale = getResellerWholesalePrice(product, employee, brandSettings);

  // Selling price (either custom input from reseller or admin default selling price)
  const sellPrice = (customSalePrice !== undefined && customSalePrice !== null && customSalePrice > 0)
    ? Number(customSalePrice)
    : getAdjustedSellingPrice(product, employee, brandSettings);

  const profit = Math.max(0, sellPrice - effectiveWholesale);
  return profit;
}


