"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    BarChart3,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Settings,
    HelpCircle,
    Menu
} from "lucide-react";

const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Reports", icon: FileText, href: "/dashboard/reports" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Events", icon: CalendarDays, href: "/dashboard/events" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div
            className={`hidden md:flex flex-col h-screen border-r border-border bg-card transition-all duration-300 relative ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            <div className="flex h-16 items-center px-6 border-b border-border">
                {!isCollapsed && <span className="text-xl font-extrabold tracking-tight text-primary">Lovissa</span>}
                {isCollapsed && <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xs uppercase">L</div>}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                </Link>
                <Link
                    href="/dashboard/help"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                    <HelpCircle className="h-5 w-5" />
                    {!isCollapsed && <span className="font-medium text-sm">Help Center</span>}
                </Link>
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute bottom-10 -right-3 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>
        </div>
    );
}
