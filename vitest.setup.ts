import { vi } from 'vitest';
import { expect } from 'vitest';

(globalThis as unknown as { expect: typeof expect }).expect = expect;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/store', () => ({
  useStore: () => ({
    user: null,
    cart: [],
    orders: [],
    favorites: [],
    login: vi.fn(),
    logout: vi.fn(),
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    placeOrder: vi.fn(),
    advanceOrder: vi.fn(),
    rateOrder: vi.fn(),
    toggleFavorite: vi.fn(),
    addPoints: vi.fn(),
  }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});