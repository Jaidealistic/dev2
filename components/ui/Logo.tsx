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
        <div className={`flex items-center gap-2 ${className}`}>
            <img
                src="/image.png"
                alt="LexFix Icon"
                className="h-8 w-auto object-contain"
            />
            <img
                src="/LexFix-Logo.png"
                alt="LexFix"
                className="h-8 w-auto object-contain"
            />
        </div>
    );
}
