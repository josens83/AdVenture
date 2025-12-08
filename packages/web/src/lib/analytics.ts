// Analytics utility for tracking game events

// Google Analytics 4 tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
}

// Track page view
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Generate session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  let sessionId = sessionStorage.getItem('adventure_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('adventure_session_id', sessionId);
  }
  return sessionId;
}

// Get device type
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'server';

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

// Get platform
function getPlatform(): string {
  if (typeof window === 'undefined') return 'server';
  return 'web';
}

// Analytics event types
export type AnalyticsEventType =
  | 'game_started'
  | 'game_loaded'
  | 'client_selected'
  | 'strategy_set'
  | 'execution_started'
  | 'execution_step'
  | 'project_completed'
  | 'project_success'
  | 'project_failed'
  | 'level_up'
  | 'achievement_unlocked'
  | 'game_over'
  | 'game_saved'
  | 'game_loaded'
  | 'subscription_viewed'
  | 'subscription_started'
  | 'subscription_completed'
  | 'error_occurred';

interface EventData {
  [key: string]: any;
}

// Track event to both GA and custom backend
export async function trackEvent(
  eventType: AnalyticsEventType,
  eventData?: EventData,
  gameContext?: {
    gameState?: string;
    playerLevel?: number;
    clientId?: string;
  }
) {
  // Track to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventType, {
      ...eventData,
      ...gameContext,
    });
  }

  // Track to custom backend
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        eventData,
        sessionId: getSessionId(),
        deviceType: getDeviceType(),
        platform: getPlatform(),
        appVersion: '1.0.0',
        ...gameContext,
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.warn('Analytics tracking failed:', error);
  }
}

// Convenience methods for common events
export const analytics = {
  // Game lifecycle
  gameStarted: (playerName: string) =>
    trackEvent('game_started', { playerName }),

  gameLoaded: (slotNumber: number, playerLevel: number) =>
    trackEvent('game_loaded', { slotNumber, playerLevel }),

  gameSaved: (slotNumber: number, playerLevel: number) =>
    trackEvent('game_saved', { slotNumber, playerLevel }),

  gameOver: (
    reason: 'reputation' | 'money',
    finalStats: {
      level: number;
      completedProjects: number;
      totalEarnings: number;
    }
  ) => trackEvent('game_over', { reason, ...finalStats }),

  // Project lifecycle
  clientSelected: (clientId: string, difficulty: string) =>
    trackEvent('client_selected', { clientId, difficulty }),

  strategySet: (strategy: Record<string, number>, totalAllocation: number) =>
    trackEvent('strategy_set', { strategy, totalAllocation }),

  executionStarted: (clientId: string, duration: number) =>
    trackEvent('execution_started', { clientId, duration }),

  projectCompleted: (
    success: boolean,
    clientId: string,
    stats: {
      visitors: number;
      conversion: number;
      payment: number;
    }
  ) =>
    trackEvent(success ? 'project_success' : 'project_failed', {
      clientId,
      ...stats,
    }),

  // Progress events
  levelUp: (newLevel: number, totalExperience: number) =>
    trackEvent('level_up', { newLevel, totalExperience }),

  achievementUnlocked: (achievementId: string, achievementName: string) =>
    trackEvent('achievement_unlocked', { achievementId, achievementName }),

  // Subscription events
  subscriptionViewed: (currentTier: string) =>
    trackEvent('subscription_viewed', { currentTier }),

  subscriptionStarted: (tier: string, billingPeriod: string, price: number) =>
    trackEvent('subscription_started', { tier, billingPeriod, price }),

  subscriptionCompleted: (tier: string) =>
    trackEvent('subscription_completed', { tier }),

  // Error tracking
  error: (errorType: string, errorMessage: string, context?: any) =>
    trackEvent('error_occurred', { errorType, errorMessage, context }),
};

export default analytics;
