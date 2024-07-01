import Layout from '../components/Layout';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { vi, describe, it, expect } from 'vitest';

vi.mock('next-auth/react', async importOriginal => {
  const actual = await importOriginal();
  const useSession = vi.fn();
  return { ...actual, useSession };
});

global.fetch = vi.fn();

function createFetchResponse(data) {
  return { json: () => new Promise(resolve => resolve(data)) };
}

fetch.mockResolvedValue(createFetchResponse({}));

describe('Layout', () => {
  it('renders correctly when signed out', () => {
    useSession.mockResolvedValue({ data: null, status: 'unauthenticated' });

    render(<Layout />);
    expect(screen.getByText('Sign In'));
  });

  it('renders correctly when signed in', () => {
    useSession.mockReturnValueOnce({
      data: { user: { email: 'foo@bar.com', name: 'John Doe' } },
      status: 'authenticated',
    });

    render(<Layout />);
    expect(screen.getByText('Dashboard'));
  });
});
