import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CookieConsent, {
  getCookieConsent,
  setCookieConsent,
  hasConsentFor,
} from '@/components/common/CookieConsent';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('CookieConsent', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getCookieConsent', () => {
    it('should return null when no consent is stored', () => {
      expect(getCookieConsent()).toBeNull();
    });

    it('should return stored consent', () => {
      const consent = {
        essential: true,
        functional: true,
        analytics: false,
        marketing: false,
      };
      mockLocalStorage.setItem('cookie-consent', JSON.stringify(consent));
      expect(getCookieConsent()).toEqual(consent);
    });

    it('should return null for invalid JSON', () => {
      mockLocalStorage.setItem('cookie-consent', 'invalid-json');
      expect(getCookieConsent()).toBeNull();
    });
  });

  describe('setCookieConsent', () => {
    it('should store consent in localStorage', () => {
      const consent = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: false,
      };
      setCookieConsent(consent);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cookie-consent',
        JSON.stringify(consent)
      );
    });

    it('should set date when consent is given', () => {
      const consent = {
        essential: true,
        functional: true,
        analytics: false,
        marketing: false,
      };
      setCookieConsent(consent);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cookie-consent-date',
        expect.any(String)
      );
    });
  });

  describe('hasConsentFor', () => {
    it('should return true for essential cookies without consent', () => {
      expect(hasConsentFor('essential')).toBe(true);
    });

    it('should return false for non-essential cookies without consent', () => {
      expect(hasConsentFor('analytics')).toBe(false);
      expect(hasConsentFor('marketing')).toBe(false);
    });

    it('should return stored preference when consent exists', () => {
      const consent = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: false,
      };
      mockLocalStorage.setItem('cookie-consent', JSON.stringify(consent));
      expect(hasConsentFor('analytics')).toBe(true);
      expect(hasConsentFor('marketing')).toBe(false);
    });
  });

  describe('CookieConsent Component', () => {
    it('should not render when consent is already given', () => {
      const consent = {
        essential: true,
        functional: true,
        analytics: false,
        marketing: false,
      };
      mockLocalStorage.setItem('cookie-consent', JSON.stringify(consent));

      render(<CookieConsent />);

      expect(screen.queryByText('쿠키 사용 안내')).not.toBeInTheDocument();
    });

    it('should render after delay when no consent', async () => {
      render(<CookieConsent />);

      expect(screen.queryByText('쿠키 사용 안내')).not.toBeInTheDocument();

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('쿠키 사용 안내')).toBeInTheDocument();
      });
    });

    it('should hide when "모두 허용" is clicked', async () => {
      render(<CookieConsent />);

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('쿠키 사용 안내')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('모두 허용'));

      await waitFor(() => {
        expect(screen.queryByText('쿠키 사용 안내')).not.toBeInTheDocument();
      });
    });

    it('should show preferences panel when "설정 관리" is clicked', async () => {
      render(<CookieConsent />);

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('설정 관리')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('설정 관리'));

      await waitFor(() => {
        expect(screen.getByText('쿠키 설정')).toBeInTheDocument();
        expect(screen.getByText('필수 쿠키')).toBeInTheDocument();
        expect(screen.getByText('기능 쿠키')).toBeInTheDocument();
        expect(screen.getByText('분석 쿠키')).toBeInTheDocument();
        expect(screen.getByText('마케팅 쿠키')).toBeInTheDocument();
      });
    });
  });
});
