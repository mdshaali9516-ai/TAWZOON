import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext.js';
import { Product } from '../types/index.js';
import { ProductCard } from './ProductCard.js';
import { getAdjustedSellingPrice, getAdjustedRegularPrice } from '../utils/pricing.js';
import { bdDistrictsAndThanas, isSearchTextMatch } from '../data/bdLocations.js';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minus,
  Plus,
  ShoppingCart,
  Home,
  X,
  Star,
  Download,
  Copy,
  Check,
  Link2,
  CheckCircle2,
  ChevronDown,
  Truck,
  ShieldCheck,
  Search,
  FileText,
  MessageCircle,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  categoryProducts?: Product[];
  relatedProducts?: Product[];
  onSelectRelated?: (product: Product) => void;
  isPreview?: boolean;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  categoryProducts = [],
  relatedProducts = [],
  onSelectRelated,
  isPreview = false,
}) => {
  const {
    lang,
    t,
    showToast,
    employee,
    addToCart,
    brandSettings,
    autoOpenCheckoutModal,
    setAutoOpenCheckoutModal,
    wishlistItems,
    toggleWishlist,
    cartItems,
    openCheckoutModal,
  } = useApp();

  const publicWhatsapp = brandSettings?.whatsappNumber || employee?.phone || '01700000000';
  const publicHelpline = brandSettings?.helplinePhone || employee?.phone || '01700000000';
  const publicNotice = brandSettings?.publicNoticeText || 'অনুরোধ করা হচ্ছে: আপনি প্রোডাক্টটির ছবি ডাউনলোড করে বা লিংক কপি করে, আপনি যার পোস্টে বা লিংকে ক্লিক করে কিনতে এসেছেন তার সাথে কন্টাক্ট করে এগুলো তাকে পাঠিয়ে বলুন যে "এই পণ্যগুলো নেব"। তাহলে আপনার অর্ডারটি কনফার্ম হবে।';

  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomMode, setZoomMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const isWishlisted = wishlistItems.some(p => p.id === currentProduct.id);

  useEffect(() => {
    if (autoOpenCheckoutModal) {
      setAutoOpenCheckoutModal(false);
      openCheckoutModal([{
        product: currentProduct,
        size: selectedSize || 'M',
        quantity: quantity,
      }]);
    }
  }, [autoOpenCheckoutModal, currentProduct, selectedSize, quantity, openCheckoutModal, setAutoOpenCheckoutModal]);

  // States for copy & download feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Quick order modal state (Reseller Delivery Order Sheet Style)
  const [checkoutSource, setCheckoutSource] = useState<'single' | 'cart'>('single');
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');

  // Checkout items list for this order
  const [checkoutItems, setCheckoutItems] = useState<Array<{
    product: Product;
    size: string;
    quantity: number;
  }>>([]);

  // Location Combobox States (Districts & Thanas)
  const [selectedDistrict, setSelectedDistrict] = useState('ঢাকা');
  const [districtQuery, setDistrictSearchQuery] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const [selectedThana, setSelectedThana] = useState('ধানমন্ডি');
  const [thanaQuery, setThanaSearchQuery] = useState('');
  const [isThanaDropdownOpen, setIsThanaDropdownOpen] = useState(false);

  const [specificAddress, setSpecificAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Delivery Fee Advance Toggle: 'no' = ৳120 COD, 'yes' = ৳0
  const [isDeliveryPaidAdvance, setIsDeliveryPaidAdvance] = useState<'yes' | 'no'>('no');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Filter Districts & Thanas
  const allDistricts = useMemo(() => Object.keys(bdDistrictsAndThanas), []);
  const matchingDistricts = useMemo(() => {
    return allDistricts.filter(dist => isSearchTextMatch(dist, districtQuery));
  }, [allDistricts, districtQuery]);

  const availableThanas = useMemo(() => {
    return bdDistrictsAndThanas[selectedDistrict] || ['সদর'];
  }, [selectedDistrict]);

  const matchingThanas = useMemo(() => {
    return availableThanas.filter(thana => isSearchTextMatch(thana, thanaQuery));
  }, [availableThanas, thanaQuery]);

  // Open Order Modal Handler
  const handleOpenOrderModal = () => {
    if (!selectedSize) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে প্রথমে একটি সাইজ সিলেক্ট করুন!' : 'Please select a size first!', 'error');
      return;
    }
    setCheckoutItems([{
      product: currentProduct,
      size: selectedSize,
      quantity: quantity
    }]);
    setIsQuickOrderOpen(true);
  };

  useEffect(() => {
    setCurrentProduct(product);
    setActiveImageIndex(0);
    setZoomMode(false);
    setSelectedSize(null);
    setQuantity(1);
    setIsQuickOrderOpen(false);
  }, [product]);

  // Source list of products in the current category/series
  const categoryList = useMemo(() => {
    if (categoryProducts && categoryProducts.length > 0) {
      return categoryProducts;
    }
    if (relatedProducts && relatedProducts.length > 0) {
      return relatedProducts;
    }
    return [];
  }, [categoryProducts, relatedProducts]);

  // Find index of clicked product in the category sequence
  const currentIndex = useMemo(() => {
    return categoryList.findIndex(
      (p) => p.id === currentProduct.id || p.productCode === currentProduct.productCode
    );
  }, [categoryList, currentProduct.id, currentProduct.productCode]);

  // Only show subsequent products (index > currentIndex) from the same category
  const subsequentProducts = useMemo(() => {
    if (currentIndex !== -1) {
      return categoryList.slice(currentIndex + 1);
    }
    return [];
  }, [categoryList, currentIndex]);

  const handleSelectRelated = (item: Product) => {
    setCurrentProduct(item);
    setActiveImageIndex(0);
    setSelectedSize(null);
    setQuantity(1);
    if (onSelectRelated) {
      onSelectRelated(item);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = lang === 'bn' ? (currentProduct.nameBn || 'Stylish Product') : (currentProduct.nameEn || currentProduct.nameBn);
  const subcat = lang === 'bn' ? currentProduct.subcategoryBn : currentProduct.subcategoryEn;
  const shortDesc = lang === 'bn' ? currentProduct.shortDescBn : currentProduct.shortDescEn;
  const fullDesc = lang === 'bn' ? currentProduct.fullDescBn : currentProduct.fullDescEn;

  // Filter images only (exclude video URLs)
  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images.filter((img) => img.url && !img.url.endsWith('.mp4')).map((img) => img.url)
      : [currentProduct.imageUrl || '/images/product_shop_dress_1790244714775.jpg'];

  const activeImage = images[activeImageIndex] || images[0];

  // Category name formatting
  const rawCategoryName = subcat || currentProduct.categorySlug || 'কাতুয়া';
  const getFormattedCategoryBadge = (name: string): string => {
    if (!name) return 'কাতুয়া';
    const words = name.trim().split(/\s+/);
    if (words.length <= 2) {
      if (name.length <= 14) return name;
      return name.slice(0, 12) + '...';
    }
    return words.slice(0, 2).join(' ') + '...';
  };
  const displayCategoryBadge = getFormattedCategoryBadge(rawCategoryName);

  // Adjusted pricing based on official reference rule
  const sellingPrice = getAdjustedSellingPrice(currentProduct, employee, brandSettings);
  const regularPrice = getAdjustedRegularPrice(currentProduct, employee, brandSettings);
  const discountPercent = regularPrice > sellingPrice
    ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
    : 0;
  const ratingVal = currentProduct.starRating ? Number(currentProduct.starRating).toFixed(1) : '5.0';

  // Available sizes
  const availableSizes = currentProduct.colors?.length
    ? currentProduct.colors
    : ['M', 'L', 'XL', 'XXL'];

  // Referral / Product URL
  const referralUrl = employee
    ? `${window.location.origin}/?ref=${employee.id}&product=${currentProduct.productCode}`
    : `${window.location.origin}/?product=${currentProduct.productCode}`;

  const showInModalNotice = (msg: string, duration = 2200) => {
    setDownloadNotice(msg);
    setTimeout(() => setDownloadNotice(null), duration);
  };

  // Copy Product Link
  const handleCopyShareableLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    showToast(lang === 'bn' ? 'প্রোডাক্ট লিংক কপি হয়েছে!' : 'Product link copied!');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Copy Product Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentProduct.productCode);
    setCopiedCode(true);
    showToast(lang === 'bn' ? 'কোড কপি হয়েছে!' : 'Code copied!');
    setTimeout(() => setCopiedCode(false), 2200);
  };

  // Copy Marketing Post
  const handleCopyMarketingPost = () => {
    const customCaption = lang === 'bn' ? currentProduct.marketingCaptionBn : currentProduct.marketingCaptionEn;
    const caption =
      customCaption ||
      `🔥 ${title} 🔥\n\n${shortDesc || ''}\n\n📌 পণ্যের কোড: ${currentProduct.productCode}\n💰 বিশেষ অফার মূল্য: ৳${sellingPrice.toLocaleString()}\n📦 ডেলিভারি: সমগ্র বাংলাদেশে ক্যাশ অন হোম ডেলিভারি।\n\nঅর্ডার করতে এখনই বুক করুন!`;

    navigator.clipboard.writeText(caption);
    setCopiedPost(true);
    showToast(lang === 'bn' ? 'পোস্ট কপি সম্পন্ন হয়েছে!' : 'Post copied!');
    setTimeout(() => setCopiedPost(false), 2200);
  };

  // Download Single Image
  const handleDownloadSingle = async (imgUrl: string, idx: number) => {
    try {
      showInModalNotice('ছবি ডাউনলোড শুরু হচ্ছে...', 1500);
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeName = (currentProduct.nameBn || 'product').replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
      link.download = `${currentProduct.productCode || 'TNX'}_${safeName}_${idx + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showInModalNotice('ছবি ডাউনলোড সম্পন্ন হয়েছে✓', 2200);
    } catch {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.target = '_blank';
      link.download = `${currentProduct.productCode || 'TNX'}_${idx + 1}.jpg`;
      link.click();
      showInModalNotice('ছবি ডাউনলোড সম্পন্ন হয়েছে✓', 2200);
    }
  };

  // Download All Images
  const handleDownloadAllImages = async () => {
    setIsDownloadingAll(true);
    showInModalNotice(`সবগুলো (${images.length}টি) ছবি ডাউনলোড হচ্ছে...`, 2000);

    for (let i = 0; i < images.length; i++) {
      try {
        const imgUrl = images[i];
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const safeName = (currentProduct.nameBn || 'product').replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
        link.download = `${currentProduct.productCode || 'TNX'}_${safeName}_photo_${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        const link = document.createElement('a');
        link.href = images[i];
        link.target = '_blank';
        link.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsDownloadingAll(false);
    showInModalNotice('সবগুলো ছবি সফলভাবে ডাউনলোড হয়েছে✓', 2500);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const sizeToUse = selectedSize || availableSizes[0] || 'M';
    const productWithSize: Product = {
      ...currentProduct,
      sizes: [sizeToUse],
      quantity: quantity,
    };
    addToCart(productWithSize);
  };

  // Quick Order Submit
  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName || !quickPhone || quickPhone.length < 11) {
      showToast(lang === 'bn' ? 'সঠিক নাম এবং ১১ ডিজিট ফোন নম্বর দিন' : 'Enter valid name & 11-digit phone', 'error');
      return;
    }
    setIsSubmittingOrder(true);
    setTimeout(() => {
      setIsSubmittingOrder(false);
      setIsQuickOrderOpen(false);
      showToast(lang === 'bn' ? 'আপনার অর্ডার সফলভাবে বুক করা হয়েছে! শীঘ্রই কল করা হবে।' : 'Order placed successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans pb-16 relative">
      
      {/* Floating Notice */}
      {downloadNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-emerald-400/30 animate-in fade-in slide-in-from-top-2 duration-200">
          {downloadNotice}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-2 sm:px-6 lg:px-8 pt-0.5 sm:pt-1 pb-4 space-y-2.5 sm:space-y-3.5">
        
        {/* ------------------------------------------------------------- */}
        {/* TOP BAR: Back Button + Home > SHOP > Category > Title Breadcrumb */}
        {/* ------------------------------------------------------------- */}
        {!isPreview && (
          <div className="bg-white py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-xl shadow-2xs border border-slate-200/90 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Back Button */}
              <button
                type="button"
                onClick={onBack}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 transition-colors shadow-2xs cursor-pointer shrink-0 active:scale-95"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{lang === 'bn' ? 'ফিরে যান' : 'Back'}</span>
              </button>

              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                <button
                  type="button"
                  onClick={onBack}
                  className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-600"
                >
                  <Home className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
                </button>
                <ChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                <button type="button" onClick={onBack} className="hover:text-slate-900 transition-colors uppercase font-bold text-slate-600">
                  SHOP
                </button>
                <ChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                <span className="text-slate-700 font-bold">{displayCategoryBadge}</span>
                <ChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                <span className="text-[#009245] font-black max-w-[100px] sm:max-w-[160px] truncate">{title}</span>
              </nav>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[10px] sm:text-[11px] text-slate-600 font-mono font-bold hover:text-[#009245] transition-colors cursor-pointer bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap shrink-0 hidden sm:inline-block"
                title="কোড কপি করতে ক্লিক করুন"
              >
                {copiedCode ? '✓ কোড কপি' : `Code: #${currentProduct.productCode}`}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MAIN PRODUCT UI SHOWCASE CONTAINER (Solid White Card)           */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2.5 sm:p-5 shadow-xs space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
            
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Gallery & Marketing actions (6 cols)             */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-6 space-y-2.5">
              {/* গ্যালারি (উলম্ব থাম্বনেইল + বড় ডিসপ্লে) */}
              <div className="flex gap-2 items-stretch">
                {/* থাম্বনেইল কলাম */}
                <div className="flex flex-col items-center gap-1.5 w-[44px] sm:w-[52px] shrink-0">
                  <div
                    className="flex flex-col gap-1.5 overflow-y-auto max-h-[320px] md:max-h-[400px] w-full p-0.5"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-lg sm:rounded-xl overflow-hidden border-2 p-0.5 transition-all cursor-pointer bg-slate-50 shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-[#009245] ring-2 ring-[#009245]/20 shadow-xs scale-105'
                            : 'border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md" />
                      </button>
                    ))}
                  </div>

                  {images.length > 5 && (
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* মূল ডিসপ্লে */}
                <div className="flex-1 min-w-0">
                  <div
                    onMouseMove={(e) => {
                      if (!zoomMode) return;
                      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - left) / width) * 100;
                      const y = ((e.clientY - top) / height) * 100;
                      setMousePos({ x, y });
                    }}
                    className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center p-1 group shadow-inner transition-all duration-200"
                  >
                    {/* Discount Badge */}
                    <span className="absolute top-2 left-2 z-10 text-[9.5px] sm:text-xs font-black text-white bg-rose-600 px-1.5 sm:px-2 py-0.5 rounded-md leading-none shadow-xs">
                      {discountPercent}% ছাড়
                    </span>

                    <img
                      src={activeImage}
                      alt={title}
                      className={`w-full h-full object-contain object-center transition-transform duration-150 ${
                        zoomMode ? 'cursor-grab active:cursor-grabbing' : ''
                      }`}
                      style={{
                        transform: zoomMode ? 'scale(2.5)' : 'scale(1)',
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      }}
                    />

                    {/* Single Image Download Floating Icon */}
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(activeImage, activeImageIndex)}
                      className="absolute bottom-2 left-2 p-1.5 text-slate-600 hover:text-[#009245] transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10 focus:outline-none bg-white/90 backdrop-blur-xs rounded-lg shadow-xs border border-slate-200"
                      title="ছবি ডাউনলোড করুন"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Wishlist Heart Icon */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(currentProduct)}
                      className="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-rose-600 transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10 focus:outline-none bg-white/90 backdrop-blur-xs rounded-full shadow-xs border border-slate-200"
                      title="পছন্দের তালিকায় রাখুন"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                    </button>

                    {/* Zoom Toggle Floating Button */}
                    <button
                      type="button"
                      onClick={() => setZoomMode(!zoomMode)}
                      className={`absolute bottom-2 right-2 p-1.5 transition-all cursor-pointer z-10 focus:outline-none rounded-lg shadow-xs border ${
                        zoomMode
                          ? 'bg-[#009245] text-white border-[#009245]'
                          : 'bg-white/95 backdrop-blur-xs text-slate-700 hover:text-[#009245] border-slate-200'
                      }`}
                      title="জুম করুন"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* স্টার রেটিং এবং পোস্ট কপি ও সব ডাউনলোড বাটন (ফিট করা হয়েছে যাতে বর্ডারের বাহিরে না যায়) */}
              <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 flex-wrap">
                {/* স্টার রেটিং ব্যাজ */}
                <div className="flex items-center gap-1 bg-[#fffbeb] border border-[#fef3c7] px-2 py-1 rounded-full shadow-3xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                  <span className="text-[10.5px] sm:text-xs font-black text-[#d97706] font-mono">
                    {ratingVal}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#b45309] font-bold">
                    ({lang === 'bn' ? 'রেটিং' : 'Rating'})
                  </span>
                </div>

                {/* বাটনসমূহ */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyMarketingPost}
                    className="px-2 py-1 rounded-full border border-slate-200 text-[10px] sm:text-xs font-black text-slate-700 hover:border-[#009245] hover:text-[#009245] hover:bg-[#f0faf3] transition-colors inline-flex items-center gap-1 cursor-pointer shadow-3xs shrink-0 whitespace-nowrap"
                  >
                    {copiedPost ? (
                      <Check className="w-3 h-3 text-[#009245]" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{copiedPost ? '✓ কপি' : lang === 'bn' ? 'পোস্ট কপি' : 'Copy Post'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAllImages}
                    disabled={isDownloadingAll}
                    className="px-2 py-1 rounded-full border border-slate-200 text-[10px] sm:text-xs font-black text-slate-700 hover:border-[#009245] hover:text-[#009245] hover:bg-[#f0faf3] transition-colors inline-flex items-center gap-1 cursor-pointer shadow-3xs shrink-0 whitespace-nowrap"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>
                      {isDownloadingAll
                        ? lang === 'bn'
                          ? 'ডাউনলোড...'
                          : 'Down...'
                        : lang === 'bn'
                        ? 'সব ডাউনলোড'
                        : 'All Download'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Title, Public Pricing, Description, Selection, Actions (6 cols)*/}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-6 space-y-2.5">
              {/* ১. প্রোডাক্টের নাম ও স্টকে আছে ব্যাজ */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <h1
                  className="font-black text-slate-900 leading-tight text-base sm:text-lg md:text-xl flex-1 min-w-0"
                  title={title}
                >
                  {title}
                </h1>

                {/* "স্টকে আছে" পালসিং ব্যাজ */}
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#009245] bg-[#eafff3] px-2 py-0.5 rounded-full border border-[#bbf7d0] shadow-2xs shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#009245]"></span>
                  </span>
                  <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
                </div>
              </div>

              {/* ২. কোড নম্বর ও প্রোডাক্ট লিংক বাটন */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[10.5px] sm:text-xs text-slate-700 font-mono font-bold bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  {copiedCode ? (
                    <Check className="w-3 h-3 text-[#009245]" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                  <span>Code: #{currentProduct.productCode}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyShareableLink}
                  className="text-[10.5px] sm:text-xs text-[#009245] font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors inline-flex items-center gap-1"
                >
                  <Link2 className="w-3 h-3 text-[#009245]" />
                  <span>{copiedLink ? '✓ কপি হয়েছে' : lang === 'bn' ? 'প্রোডাক্ট লিংক' : 'Product Link'}</span>
                </button>
              </div>

              {/* ৩. পাবলিক প্রাইসিং কার্ড (বিক্রয়মূল্য) */}
              <div className="p-2.5 sm:p-3 bg-gradient-to-r from-emerald-50/80 via-slate-50/80 to-emerald-50/80 rounded-xl border border-emerald-100 flex items-center justify-between shadow-3xs">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-500 block mb-0.5">
                    {lang === 'bn' ? 'বিক্রয়মূল্য' : 'Price'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono tracking-tight">
                      ৳{(sellingPrice * quantity).toLocaleString()}
                    </span>
                    {regularPrice > sellingPrice && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">
                        ৳{(regularPrice * quantity).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="text-right">
                    <span className="text-[10.5px] sm:text-xs font-black text-[#009245] bg-[#eafff3] border border-[#bbf7d0] px-2 py-0.5 rounded-lg inline-block">
                      {discountPercent}% {lang === 'bn' ? 'ছাড়' : 'Off'}
                    </span>
                  </div>
                )}
              </div>

              {/* ৪. বিবরণ (Description) & বিশেষ বৈশিষ্ট্যসমূহ */}
              {(fullDesc || shortDesc) && (
                <div className="space-y-1 pt-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {lang === 'bn' ? 'পণ্যের বিবরণ:' : 'Product Description:'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    {fullDesc || shortDesc}
                  </p>
                </div>
              )}

              {currentProduct.marketingHighlights && currentProduct.marketingHighlights.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    {lang === 'bn' ? 'বিশেষ বৈশিষ্ট্যসমূহ:' : 'Key Highlights:'}
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    {currentProduct.marketingHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#009245] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ৫. সাইজ সিলেক্টর ও পরিমাণ কাউন্টার */}
              <div className="p-2.5 sm:p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2.5 shadow-3xs">
                {/* সাইজ নির্বাচন (M, L, XL, XXL) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1">
                      <span>{lang === 'bn' ? 'সাইজ সিলেক্ট করুন:' : 'Select Size:'}</span>
                    </label>
                    <span className="text-[10.5px] font-bold font-mono">
                      {lang === 'bn' ? 'সিলেক্টেড:' : 'Selected:'}{' '}
                      <span className="text-[#009245] font-black">{selectedSize || availableSizes[0] || 'M'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#009245] text-white border-[#009245] shadow-xs scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#009245]/50 hover:bg-emerald-50/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* পরিমাণ (Quantity Counter) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'পরিমাণ (পিস):' : 'Quantity:'}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-3xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black font-mono text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ৬. প্রাইমারি একশন বাটন: "কার্ট করুন" ও "এখনই অর্ডার করুন" */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#009245] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-[#009245]" />
                  <span>{lang === 'bn' ? 'কার্ট করুন' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openCheckoutModal([{
                      product: currentProduct,
                      size: selectedSize || availableSizes[0] || 'M',
                      quantity: quantity,
                    }]);
                  }}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#009245] hover:bg-[#007a3a] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>{lang === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUBSEQUENT / RELATED PRODUCTS IN SAME CATEGORY                  */}
        {/* ------------------------------------------------------------- */}
        {subsequentProducts.length > 0 && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-[#009245] rounded-full inline-block" />
              <h3 className="text-lg font-black text-slate-900">
                {lang === 'bn' ? 'এই ক্যাটাগরির অন্যান্য পণ্যসমূহ' : 'More Products in this Category'}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {subsequentProducts.slice(0, 10).map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  onCardClick={() => handleSelectRelated(relProd)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* RESELLER CONTACT NOTICE MODAL                                   */}
      {/* ------------------------------------------------------------- */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-[100001] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden flex flex-col my-auto">
            
            {/* Header Frame */}
            <div className="p-3.5 sm:p-4 bg-[#009245] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-200" />
                <h3 className="text-sm sm:text-base font-black">
                  {lang === 'bn' ? 'রিসেলারের সাথে যোগাযোগ করুন' : 'Contact Reseller'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickOrderOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

             {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 text-center">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-2">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                  {publicNotice}
                </p>
                <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
                  <a
                    href={`tel:${publicHelpline.replace(/[^0-9+]/g, '')}`}
                    className="text-xs sm:text-sm font-black text-white bg-[#009245] hover:bg-[#007a3a] px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>কল দিন: {publicHelpline}</span>
                  </a>
                </div>
              </div>

              {/* Product Media Action Row */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 text-left">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentProduct.images?.[activeImageIndex]?.url || currentProduct.images?.[0]?.url || '/images/product_shop_dress_1790244714775.jpg'}
                    alt={title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {title}
                    </h5>
                    <p className="text-[10.5px] text-slate-500 font-bold font-mono">
                      কোড: #{currentProduct.productCode || 'TNX'} {selectedSize ? `| সাইজ: ${selectedSize}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={async () => {
                      const imgUrl = currentProduct.images?.[activeImageIndex]?.url || currentProduct.images?.[0]?.url || '';
                      if (!imgUrl) return;
                      try {
                        const res = await fetch(imgUrl);
                        const blob = await res.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = objectUrl;
                        a.download = `product-${currentProduct.productCode || 'TNX'}-${activeImageIndex + 1}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(objectUrl);
                        showToast(lang === 'bn' ? 'ছবি ডাউনলোড শুরু হয়েছে!' : 'Image download started!', 'success');
                      } catch {
                        const a = document.createElement('a');
                        a.href = imgUrl;
                        a.target = '_blank';
                        a.download = `product-${currentProduct.productCode || 'TNX'}-${activeImageIndex + 1}.jpg`;
                        a.click();
                        showToast(lang === 'bn' ? 'ছবি ওপেন হয়েছে, ডাউনলোড করুন' : 'Image opened to download', 'info');
                      }
                    }}
                    className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-black rounded-lg border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>ছবি ডাউনলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const refId = employee?.id || '';
                      const link = `${origin}/?ref=${refId}&product=${currentProduct.productCode || ''}`;
                      navigator.clipboard.writeText(link);
                      showToast(lang === 'bn' ? 'লিংক ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Link copied to clipboard!', 'success');
                    }}
                    className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-black rounded-lg border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-[#009245]" />
                    <span>লিংক কপি করুন</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={
                    publicWhatsapp.startsWith('http')
                      ? publicWhatsapp
                      : `https://wa.me/88${publicWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম! আমি "${title}" (কোড: #${currentProduct.productCode}${selectedSize ? `, সাইজ: ${selectedSize}` : ''}) পণ্যটি অর্ডার করতে চাই।`)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#009245] hover:bg-[#007a3a] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ দিন' : 'Message on WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsQuickOrderOpen(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  <span>{lang === 'bn' ? 'ঠিক আছে / স্কিপ' : 'Okay / Skip'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
