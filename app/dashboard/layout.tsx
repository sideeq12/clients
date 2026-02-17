"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
}
