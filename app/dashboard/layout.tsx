"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "#", icon: Users },
    { name: "Analytics", href: "#", icon: BarChart3 },
    { name: "Settings", href: "#", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } border-r border-border bg-card transition-all duration-300 flex flex-col hidden md:flex`}
            >
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-primary shrink-0 flex items-center justify-center">
                            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-lg truncate">Lovissa</span>}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            <link.icon className="h-5 w-5 shrink-0" />
                            {isSidebarOpen && <span className="font-medium">{link.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
                    <button
                        className="p-2 -ml-2 rounded-lg hover:bg-foreground/5 md:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 max-w-md ml-4 hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search analytics..."
                                className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <button className="relative p-2 rounded-xl hover:bg-foreground/5 transition-all">
                            <Bell className="h-5 w-5 text-foreground/60" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-card"></span>
                        </button>
                        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">Alex Thompson</p>
                                <p className="text-xs text-foreground/60">Administrator</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                                AT
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
