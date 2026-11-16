import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import { wedding } from '../src/content/wedding.js';

vi.mock('../src/api/index.js', () => ({
  api: { getInvitation: vi.fn() },
}));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

import { api } from '../src/api/index.js';

async function openInvitation() {
  fireEvent.click(screen.getByRole('button', { name: 'Open the wedding invitation' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Close calendar reminders' }));
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Open the wedding invitation' })).not.toBeInTheDocument());
}

describe('wedding invitation page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })));
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('Audio asset is not available in tests.'));
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    api.getInvitation.mockResolvedValue(wedding);
    window.history.replaceState({}, '', '/?to=Priya');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the personalized invitation and requested wedding details', async () => {
    render(<App />);
    expect(await screen.findByText('Dear Priya,')).toBeInTheDocument();
    await openInvitation();

    expect(screen.getByRole('heading', { name: 'Diwakar Rao S & Shweta Bai G' })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'Diwakar and Shweta together in wedding attire' }).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Karthik Kalyana Mantapa').length).toBeGreaterThan(0);
    expect(screen.getByText('Rudraswamy Temple Street, Gavipuram, Bengaluru, Karnataka 560019')).toBeInTheDocument();
    expect(screen.getByText('Saturday 28 November 2026')).toBeInTheDocument();
    expect(screen.getByText('6:30 PM onwards')).toBeInTheDocument();
    expect(screen.getByText('Sunday 29 November 2026')).toBeInTheDocument();
    expect(screen.getByText('6:40-7:40 AM IST')).toBeInTheDocument();
    expect(screen.queryByText(/Ajith|Anjana|8 Years|A Day to Remember/)).not.toBeInTheDocument();
  });

  it('defaults to light even when the device prefers dark', async () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)' || query === '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    render(<App />);
    await screen.findByText('Dear Priya,');
    await openInvitation();
    expect(screen.getByRole('button', { name: 'Theme: light. Change theme' })).toBeInTheDocument();
    expect(window.localStorage.getItem('app-theme')).toBe('light');
  });

  it.each(['light', 'dark'])('opens Frames of Love and its photo gallery in %s theme', async (theme) => {
    window.localStorage.setItem('app-theme', theme);
    render(<App />);
    await screen.findByText('Dear Priya,');
    await openInvitation();
    expect(screen.getByRole('button', { name: `Theme: ${theme}. Change theme` })).toBeInTheDocument();

    const storyCard = screen.getByRole('button', { name: 'Read story: Frames of Love 📸' });
    fireEvent.keyDown(storyCard, { key: 'Enter' });

    expect(await screen.findByText('A few favorite moments from our journey, held close in every frame.')).toBeInTheDocument();
    expect(document.querySelectorAll('.moment-gallery img')).toHaveLength(5);
  });

  it('opens the calendar reminder dialog from the invitation action', async () => {
    render(<App />);
    await screen.findByText('Dear Priya,');
    fireEvent.click(screen.getByRole('button', { name: 'Open the wedding invitation' }));
    expect(await screen.findByText('Save a date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close calendar reminders' })).toBeInTheDocument();
  });
});