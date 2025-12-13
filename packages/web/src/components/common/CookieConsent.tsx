'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: false,
  marketing: false,
};

export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  const consent = localStorage.getItem('cookie-consent');
  if (consent) {
    try {
      return JSON.parse(consent);
    } catch {
      return null;
    }
  }
  return null;
}

export function setCookieConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('cookie-consent', JSON.stringify(preferences));
  localStorage.setItem('cookie-consent-date', new Date().toISOString());

  // Also set a cookie for server-side access
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `cookie-consent=${JSON.stringify(preferences)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: preferences }));
}

export function hasConsentFor(type: keyof CookiePreferences): boolean {
  const consent = getCookieConsent();
  if (!consent) return type === 'essential';
  return consent[type];
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = getCookieConsent();
    if (!existingConsent) {
      // Small delay to avoid flash on initial load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setPreferences(existingConsent);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCookieConsent(allAccepted);
    setPreferences(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setCookieConsent(essentialOnly);
    setPreferences(essentialOnly);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Can't toggle essential
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-4xl mx-auto bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden">
          {!showPreferences ? (
            // Simple consent view
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🍪</span>
                    <h3 className="text-lg font-semibold">쿠키 사용 안내</h3>
                  </div>
                  <p className="text-dark-300 text-sm">
                    저희는 서비스 제공과 개선을 위해 쿠키를 사용합니다.
                    &quot;모두 허용&quot;을 클릭하면 쿠키 사용에 동의하게 됩니다.{' '}
                    <Link href="/cookies" className="text-primary-400 hover:underline">
                      쿠키 정책
                    </Link>
                    에서 자세히 알아보세요.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-4 py-2 text-sm text-dark-300 hover:text-white border border-dark-600 rounded-lg transition-colors"
                  >
                    설정 관리
                  </button>
                  <button
                    onClick={handleAcceptEssential}
                    className="px-4 py-2 text-sm text-dark-300 hover:text-white border border-dark-600 rounded-lg transition-colors"
                  >
                    필수만 허용
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    모두 허용
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Detailed preferences view
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">쿠키 설정</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-dark-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <p className="text-dark-300 text-sm mb-6">
                아래에서 쿠키 카테고리별로 동의 여부를 선택할 수 있습니다.
                필수 쿠키는 서비스 제공에 필요하므로 비활성화할 수 없습니다.
              </p>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">●</span>
                      <h4 className="font-medium">필수 쿠키</h4>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        항상 활성
                      </span>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">
                      로그인, 보안, 기본 기능에 필요한 쿠키입니다.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-green-600 rounded-full cursor-not-allowed relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={preferences.functional ? 'text-blue-400' : 'text-dark-500'}>●</span>
                      <h4 className="font-medium">기능 쿠키</h4>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">
                      테마, 언어 등 사용자 설정을 기억합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('functional')}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.functional ? 'bg-blue-600' : 'bg-dark-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.functional ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={preferences.analytics ? 'text-yellow-400' : 'text-dark-500'}>●</span>
                      <h4 className="font-medium">분석 쿠키</h4>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">
                      서비스 개선을 위해 사용 통계를 수집합니다.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.analytics ? 'bg-yellow-600' : 'bg-dark-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={preferences.marketing ? 'text-purple-400' : 'text-dark-500'}>●</span>
                      <h4 className="font-medium">마케팅 쿠키</h4>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">
                      관련성 있는 광고를 제공하는 데 사용됩니다.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.marketing ? 'bg-purple-600' : 'bg-dark-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 px-4 py-2 text-sm text-dark-300 hover:text-white border border-dark-600 rounded-lg transition-colors"
                >
                  필수만 허용
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  선택 저장
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  모두 허용
                </button>
              </div>

              <p className="text-dark-500 text-xs mt-4 text-center">
                자세한 내용은{' '}
                <Link href="/cookies" className="text-primary-400 hover:underline">
                  쿠키 정책
                </Link>
                을 참조하세요.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
