import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renders the app header', () => {
    render(<App />);
    expect(screen.getByText(/VisionBoard Diary/)).toBeInTheDocument();
  });

  it('displays theme switcher buttons', () => {
    render(<App />);
    expect(screen.getByText('Classic')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('shows initial sticky notes', () => {
    render(<App />);
    expect(screen.getByText('朝30分の散歩→日光浴')).toBeInTheDocument();
    expect(screen.getByText('毎週日曜に週間レビュー')).toBeInTheDocument();
  });

  it('displays item count in status footer', () => {
    render(<App />);
    expect(screen.getByText(/Items: 2/)).toBeInTheDocument();
  });

  it('shows ready status', () => {
    render(<App />);
    expect(screen.getByText(/Status: Ready/)).toBeInTheDocument();
  });

  it('has add sticky button', () => {
    render(<App />);
    const addButton = screen.getByLabelText('Add Sticky');
    expect(addButton).toBeInTheDocument();
  });

  it('can switch themes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const darkButton = screen.getByText('Dark');
    await user.click(darkButton);

    // Dark theme should be active (has specific styling)
    expect(darkButton.className).toContain('bg-slate-800');
  });

  it('displays usage hint', () => {
    render(<App />);
    expect(screen.getByText(/付箋をドラッグで移動/)).toBeInTheDocument();
  });
});
