'use client';

import React from 'react';

interface LogoProps {
    className?: string;
}

/**
 * Standard LexFix Logo component
 * 
 * Features:
 * - text-lg font-semibold text-[#2d2d2d] (Dark Gray/Black)
 * - No icons as per user request
 * - Consistent branding across all headers
 */
export default function Logo({ className = '' }: LogoProps) {
    return (
        <span className={`text-lg font-semibold text-[#2d2d2d] tracking-tight ${className}`}>
            LexFix
        </span>
    );
}
