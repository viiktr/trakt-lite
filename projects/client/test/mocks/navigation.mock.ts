import { vi } from 'vitest';

vi.mock('$app/navigation', () => ({
  goto: vi.fn(() => Promise.resolve()),
  beforeNavigate: vi.fn(() => {}),
}));
