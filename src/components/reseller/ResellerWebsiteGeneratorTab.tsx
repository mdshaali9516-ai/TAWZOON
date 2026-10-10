import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  Copy,
  ExternalLink,
  Save,
  Share2,
  Layout,
  Palette,
  Phone,
  Store,
  Grid,
  Sparkles,
  Clock,
  ShieldCheck,
  CreditCard,
  Crown,
  AlertTriangle,
  Gift,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { calculateResellerTrial } from '../../utils/resellerTrial.js';
import { BkashPaymentModal } from '../common/BkashPaymentModal.js';

export const ResellerWebsiteGeneratorTab: React.FC = () => {
  const { lang, employee, brandSettings, showToast, refreshEmployeeProfile } = useApp();
  
  // Custom Website State
  const [storeName, setStoreName] = useState(employee?.name ? `${employee.name} এক্সপ্রেস শপ` : 'আমার এক্সপ্রেস শপ');
  const [slug, setSlug] = useState(employee?.id ? `shop_${employee.id.substring(0, 6)}` : 'my_reseller_store');
  const [selectedTheme, setSelectedTheme] = useState<'emerald' | 'blue' | 'orange' | 'indigo'>('emerald');
  const [whatsappNumber, setWhatsappNumber] = useState(employee?.phone || '01712345678');
  const [isActive, setIsActive] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [paymentCelebration, setPaymentCelebration] = useState(false);

  // Calculate Trial / Subscription info
  const trial = calculateResellerTrial(employee, brandSettings);
  const subscriptionFee = brandSettings?.resellerSubscriptionFee ?? 999;
  const fullUrl = `https://tawzoonnexus.com/shop/${slug}`;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(lang === 'bn' ? 'আপনার কাস্টম ওয়েবসাইট সফলভাবে আপডেট হয়েছে!✓' : 'Custom website updated successfully!✓');
    }, 800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    showToast(lang === 'bn' ? 'স্টোর লিংক কপি হয়েছে!📋' : 'Store link copied to clipboard!📋');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePaymentSuccess = async (details: { trxId: string; amount: number; senderPhone: string }) => {
    setIsActive(true);
    setPaymentCelebration(true);
    await refreshEmployeeProfile();
    showToast(
      lang === 'bn' 
        ? '🎉 অভিনন্দন! বিকাশ পেমেন্ট সম্পন্ন হয়েছে এবং আপনার ওয়েবসাইট ১ বছরের জন্য রান করা হয়েছে!' 
        : 'Payment successful! Your 1-Year website subscription is live!',
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black rounded-full">
            <Globe className="w-3.5 h-3.5 animate-spin" />
            <span>{lang === 'bn' ? 'রিসেলার ডিজিটাল স্টোর' : 'Reseller Store Builder'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {lang === 'bn' ? 'আপনার নিজস্ব কাস্টম ওয়েবসাইট তৈরি করুন' : 'Launch Your Own E-commerce Website'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
            {lang === 'bn' 
              ? 'টি তাওজুন নেক্সাসের সকল প্রোডাক্ট নিয়ে আপনার নিজের নামে একটি আধুনিক শপ ওয়েবসাইট তৈরি করুন ও সরাসরি কাস্টমারদের অর্ডার নিন।'
              : 'Launch a personalized custom shop with your own branding in 1 click.'}
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* PAYMENT CELEBRATION NOTIFICATION */}
      {paymentCelebration && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg border border-emerald-400/40 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              🎉
            </div>
            <div>
              <h4 className="text-base font-black">
                {lang === 'bn' ? 'অভিনন্দন! ১ বছরের সাবস্ক্রিপশন সক্রিয় হয়েছে' : 'Congratulations! 1-Year Subscription Active'}
              </h4>
              <p className="text-xs text-emerald-100">
                {lang === 'bn' 
                  ? 'আপনার বিকাশ পেমেন্ট যাচাই হয়েছে এবং ওয়েবসাইটটি লাইভ রান করা হয়েছে।' 
                  : 'Your bKash payment is verified and website is live.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaymentCelebration(false)}
            className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      )}

      {/* 2. FREE TRIAL & 1-YEAR SUBSCRIPTION SECTION */}
      <div className="space-y-4">
        
        {/* BOX 1: 7-DAYS FREE TRIAL STATUS */}
        {brandSettings?.resellerTrialEnabled !== false && (
          <div className="bg-white border-2 border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                  trial.isPaid 
                    ? 'bg-amber-100 text-amber-800' 
                    : trial.isExpired 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {trial.isPaid ? '👑' : trial.isExpired ? '⚠️' : '🎁'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {trial.isPaid 
                        ? (lang === 'bn' ? '👑 ১ বছরের প্রিমিয়াম ওয়েবসাইট সাবস্ক্রিপশন সক্রিয়' : '1-Year Premium Website Active')
                        : trial.isExpired
                        ? (lang === 'bn' ? '⚠️ ৭ দিনের ফ্রি ট্রায়াল মেয়াদ সম্পন্ন হয়েছে' : '7-Day Free Trial Expired')
                        : (lang === 'bn' ? `🎁 ${trial.totalTrialDays} দিনের ফ্রি ট্রায়াল সক্রিয় রয়েছে` : `${trial.totalTrialDays}-Day Free Trial Active`)}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-3xs ${
                      trial.isPaid 
                        ? 'bg-amber-500 text-white' 
                        : trial.isExpired 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-[#009245] text-white'
                    }`}>
                      {trial.isPaid 
                        ? '✓ লাইভ ১ বছর' 
                        : trial.isExpired 
                        ? 'মেয়াদোত্তীর্ণ' 
                        : (trial.remainingDays === 0 ? 'আজই শেষ দিন' : `আর ${trial.remainingDays} দিন বাকি`)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {trial.isPaid 
                      ? (lang === 'bn' ? `আপনার ওয়েবসাইটটি পেইড মেম্বারশিপে সচল রয়েছে (মেয়াদ: ${trial.durationText})। সকল ফিচার আনলিমিটেড উপভোগ করুন।` : `Your website is active on 1-year paid membership.`)
                      : trial.isExpired
                      ? (lang === 'bn' ? 'আপনার ৭ দিনের ফ্রি ট্রায়াল শেষ হয়ে গেছে। ওয়েবসাইটটি লাইভ রাখতে এবং অর্ডার পেতে নিচের ১ বছরের সাবস্ক্রিপশন ফি পরিশোধ করুন।' : 'Your 7-day free trial has expired. Subscribe for 1-year to keep your store active.')
                      : (lang === 'bn' ? `প্রথম ${trial.totalTrialDays} দিন একদম বিনামূল্যে ওয়েবসাইট তৈরি ও ব্যবহার করতে পারবেন। ট্রায়াল চলাকালীন আপনার ওয়েবসাইট সম্পূর্ণ লাইভ ও সক্রিয় থাকবে।` : `Enjoy ${trial.totalTrialDays} days free trial. Your website is live and fully active.`)}
                  </p>
                </div>
              </div>

              {!trial.isPaid && (
                <div className="text-left sm:text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{trial.isExpired ? 'ট্রায়াল শেষ' : `বাকি: ${trial.remainingDays} দিন`}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trial Timeline Details */}
            {!trial.isPaid && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      trial.isExpired ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-[#009245]'
                    }`}
                    style={{ width: `${trial.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-medium flex-wrap gap-1">
                  <span>📅 শুরু: {trial.startDateFormattedBn}</span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-150">
                    অতিবাহিত: {trial.elapsedDays} দিন / {trial.totalTrialDays} দিন
                  </span>
                  <span>⌛ মেয়াদ শেষ: {trial.expiryDateFormattedBn}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOX 2: 1-YEAR SUBSCRIPTION PURCHASE BOX */}
        <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-rose-500/10 border-2 border-amber-400/70 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            
            {/* Left: Info & Benefits */}
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  👑
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {lang === 'bn' ? 'সাবস্ক্রিপশন কিনুন ১ বছরের জন্য' : 'Buy 1-Year Website Subscription'}
                </h3>
                <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ১ বছর প্রিমিয়াম
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {lang === 'bn' 
                  ? 'আপনার ওয়েবসাইটটি নিরবচ্ছিন্নভাবে পুরো ১ বছর লাইভ রাখতে, নিজস্ব কাস্টম স্টোর ডোমেন লিংক শেয়ার করতে এবং আনলিমিটেড কাস্টমার অর্ডার পেতে আজই ১ বছরের সাবস্ক্রিপশন চালু করুন।' 
                  : 'Keep your store live 24/7 for 1 full year with custom shop domain, unlimited products and direct WhatsApp customer orders.'}
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  { bn: '✓ আনলিমিটেড প্রোডাক্ট ও লাইভ ক্যাটালগ', en: '✓ Unlimited Product Catalog' },
                  { bn: '✓ কাস্টম শপ ডোমেন সাব-লিঙ্ক', en: '✓ Custom Subdomain Store URL' },
                  { bn: '✓ সরাসরি হোয়াটসঅ্যাপে অর্ডার গ্রহণ', en: '✓ Instant WhatsApp Order Flow' },
                  { bn: '✓ ৩৬৫ দিন সার্বক্ষণিক লাইভ ওয়েবসাইট', en: '✓ 365 Days 24/7 Live Store' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{lang === 'bn' ? item.bn : item.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pricing & bKash Payment Action */}
            <div className="bg-white/90 backdrop-blur-xs border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-center sm:min-w-[240px] space-y-3 shadow-xs shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  {lang === 'bn' ? '১ বছর সাবস্ক্রিপশন ফি' : '1-Year Subscription Fee'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 line-through font-bold">৳১,৫০০</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    ৳{subscriptionFee.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {trial.durationText || '১ বছর মেয়াদ'}
                </span>
              </div>

              {/* bKash Payment CTA Button */}
              <button
                type="button"
                onClick={() => setIsBkashModalOpen(true)}
                className="w-full py-3 px-4 bg-[#E2136E] hover:bg-[#c90f61] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50,5 95,28 80,85 50,95 20,85 5,28" fill="#E2136E" />
                    <polygon points="50,15 85,34 72,78 50,86 28,78 15,34" fill="#FFFFFF" />
                    <polygon points="50,25 75,38 65,70 50,77 35,70 25,38" fill="#E2136E" />
                  </svg>
                </div>
                <span>
                  {trial.isPaid 
                    ? (lang === 'bn' ? 'সাবস্ক্রিপশন রিনিউ করুন' : 'Renew Subscription')
                    : (lang === 'bn' ? 'পেমেন্ট করুন (বিকাশ)' : 'Pay with bKash')}
                </span>
              </button>

              <p className="text-[10px] text-slate-500 font-medium">
                🔒 OTP ও পিন দিয়ে ১ সেকেন্ডে অটোমেটিক ওয়েবসাইট সক্রিয় হবে
              </p>
            </div>

          </div>

          {/* Decorative subtle background accents */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-pink-400/10 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>

      {/* 3. STORE CONFIGURATION & PREVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Generator Form (Takes 2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-50">
              <Store className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'bn' ? 'স্টোর সেটিংস ও কনফিগারেশন' : 'Store Settings'}</span>
            </h3>

            <div className="space-y-4">
              
              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/40">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-indigo-950">
                    {lang === 'bn' ? 'স্টোর স্ট্যাটাস' : 'Store Status'}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-indigo-700 font-semibold">
                    {isActive 
                      ? (lang === 'bn' ? 'আপনার ওয়েবসাইটটি বর্তমানে লাইভ রয়েছে' : 'Your store is active & live') 
                      : (lang === 'bn' ? 'সাময়িকভাবে বন্ধ রয়েছে' : 'Store is offline')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    isActive ? 'bg-[#009245]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    isActive ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Store Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  {lang === 'bn' ? 'স্টোরের নাম (Store Title)' : 'Store Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="যেমন: রাফিক কালেকশন"
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none font-bold"
                  />
                  <Store className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Subdomain/Slug Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  {lang === 'bn' ? 'পছন্দসই ওয়েব এড্রেস / সাব-লিংক' : 'Custom Web Address'}
                </label>
                <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden items-stretch focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-150">
                  <span className="bg-slate-100 border-r border-slate-200 px-3 text-[10px] sm:text-xs text-slate-500 font-mono flex items-center select-none shrink-0">
                    tawzoonnexus.com/shop/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="username"
                    className="w-full px-3 py-2 text-xs bg-transparent outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  {lang === 'bn' ? 'যোগাযোগের হোয়াটসঅ্যাপ নম্বর (অর্ডার রিসিভ করতে)' : 'WhatsApp Contact Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-mono font-bold"
                  />
                  <Phone className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block flex items-center gap-1">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'bn' ? 'ডিজিটাল শপের থিম কালার' : 'Theme Accent Color'}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'emerald' as const, labelBn: 'সবুজ', bg: 'bg-[#009245]', border: 'border-emerald-300' },
                    { key: 'blue' as const, labelBn: 'নীল', bg: 'bg-blue-600', border: 'border-blue-300' },
                    { key: 'orange' as const, labelBn: 'কমলা', bg: 'bg-orange-500', border: 'border-orange-300' },
                    { key: 'indigo' as const, labelBn: 'বেগুনী', bg: 'bg-indigo-600', border: 'border-indigo-300' },
                  ].map((theme) => (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() => setSelectedTheme(theme.key)}
                      className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selectedTheme === theme.key 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs font-black' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${theme.bg} shadow-2xs`} />
                      <span className="text-[10px] text-slate-700">{lang === 'bn' ? theme.labelBn : theme.key}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-55"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'সেভ করুন' : 'Save Changes')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Store Preview & Link actions (Takes 1 col) */}
        <div className="space-y-6">
          
          {/* Live URL Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>{lang === 'bn' ? 'আপনার স্টোর লিংক' : 'Store Link'}</span>
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-600 truncate">
                {fullUrl}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-1.5 px-3 bg-white border border-slate-200 text-slate-800 text-[10px] font-black rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-3xs"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>{copiedLink ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'লিংক কপি করুন' : 'Copy Link')}</span>
                </button>

                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center justify-center cursor-pointer shadow-3xs"
                  title={lang === 'bn' ? 'ওয়েবসাইট ভিজিট করুন' : 'Visit Webstore'}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Sharing Guide */}
            <div className="space-y-2 text-left pt-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {lang === 'bn' ? 'কীভাবে ব্যবহার করবেন?' : 'How to use?'}
              </div>
              <ul className="space-y-1.5">
                {[
                  { textBn: 'লিংকটি আপনার ফেসবুক পেজ ও গ্রুপে শেয়ার করুন।', textEn: 'Share link in Facebook groups.' },
                  { textBn: 'কাস্টমাররা আপনার লিংকে ঢুকে সরাসরি অর্ডার করতে পারবে।', textEn: 'Customers place order via the link.' },
                  { textBn: 'হোয়াটসঅ্যাপে সরাসরি অর্ডার চলে আসবে আপনার কাছে।', textEn: 'Instant order placement via WhatsApp.' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{lang === 'bn' ? item.textBn : item.textEn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-[#fcfcff] border border-indigo-50/80 rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              {lang === 'bn' ? 'স্টোর এনালাইটিক্স' : 'Store Traffic'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white border border-indigo-50 rounded-2xl space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 block">{lang === 'bn' ? 'টোটাল ভিজিটর' : 'Total Visits'}</span>
                <span className="text-sm font-black text-slate-800">145 জন</span>
              </div>
              <div className="p-3 bg-white border border-indigo-50 rounded-2xl space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 block">{lang === 'bn' ? 'সরাসরি সেলস' : 'Direct Orders'}</span>
                <span className="text-sm font-black text-slate-800">12 টি</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* OFFICIAL BKASH GATEWAY PAYMENT MODAL (WITH OTP & PIN FLOW) */}
      <BkashPaymentModal
        isOpen={isBkashModalOpen}
        onClose={() => setIsBkashModalOpen(false)}
        amount={subscriptionFee}
        purposeTitle="ওয়েবসাইট ১ বছর সাবস্ক্রিপশন ফি"
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
