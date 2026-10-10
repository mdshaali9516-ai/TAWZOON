import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import { Download, Smartphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { lang } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 font-medium rounded-md transition-all shadow-xs ${
          compact
            ? 'px-2.5 py-1 text-[11px] bg-slate-900 text-white hover:bg-slate-800'
            : 'px-3 py-1.5 text-xs bg-slate-900 text-white hover:bg-slate-800'
        }`}
        title={lang === 'bn' ? 'অ্যান্ড্রয়েড ফোনে অ্যাপটি ইনস্টল করুন' : 'Install app on your device'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 font-medium rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all ${
            compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'iOS ইনস্টল' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === 'bn' ? 'আইফোন / আইপ্যাডে ইনস্টল করার নিয়ম' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {lang === 'bn' ? (
                  <>
                    ১. সাফারি ব্রাউজারের নিচে <strong>শেয়ার (Share)</strong> বাটনে ট্যাপ করুন।<br />
                    ২. নিচে স্ক্রোল করে <strong>হোম স্ক্রিনে যোগ করুন (Add to Home Screen)</strong> চাপুন।
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in Safari's toolbar.<br />
                    2. Scroll down and select <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
