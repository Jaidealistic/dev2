/**
 * AUTH LAYOUT
 * 
 * Layout for all authentication pages
 */

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}

