'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderClientProps {
  children: React.ReactNode;
}

export const SessionProviderClient = ({ children }: SessionProviderClientProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
