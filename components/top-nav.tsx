"use client";

import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Bell, Search, User, Menu } from "lucide-react";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-md md:hidden hover:bg-muted transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="hidden sm:flex items-center flex-1 max-w-md bg-muted/50 rounded-lg px-3 py-1.5 gap-2 border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search analytics, reports..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                </button>
                <ThemeToggle />
                <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-all">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold leading-none">John Doe</p>
                        <p className="text-[10px] text-muted-foreground">Premium Client</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
