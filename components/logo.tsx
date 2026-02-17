"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LogoProps {
    className?: string;
    collapsed?: boolean;
}

export function Logo({ className = "h-8 w-auto", collapsed = false }: LogoProps) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Placeholder during hydration to prevent flash
    if (!mounted) {
        return <div className={className} style={{ width: collapsed ? '1.25rem' : '5rem' }} />;
    }

    const isDark = resolvedTheme === "dark";
    // Based on user request: dark logo in dark mode, white logo in light mode
    const logoSrc = isDark ? "/darklogo.png" : "/whitelogo.png";

    return (
        <img
            src={logoSrc}
            className={className}
            alt="Lovissa Logo"
        />
    );
}
