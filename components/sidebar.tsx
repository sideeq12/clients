"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Clock,
    Files,
    Terminal,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Activity,
    Briefcase,
    Menu,
    LogOut
} from "lucide-react";
import { Logo } from "./logo";
import { signOut } from "@/app/login/actions";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Enquiries", icon: MessageSquare, href: "/dashboard/enquiries" },
    { name: "Cases", icon: Briefcase, href: "/dashboard/cases" },
    { name: "Appointments", icon: Users, href: "/dashboard/appointments" },
    { name: "Reports", icon: BarChart3, href: "/dashboard/reports" },
];

export function Sidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    } ${isCollapsed && !isMobileOpen ? "md:w-20" : "md:w-64"
                    } flex flex-col h-full`}
            >
                <div className={`flex h-16 items-center my-10 border-b border-border ${isCollapsed ? "justify-center" : "px-6"}`}>
                    <Logo
                        className={isCollapsed ? "h-14 w-auto" : "h-14 my-10 w-auto"}
                        collapsed={isCollapsed}
                    />
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

                <div className="p-4 border-t border-border mt-auto space-y-2">
                    <button
                        onClick={async () => {
                            await signOut();
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
                    >
                        <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
                        {!isCollapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                    <div className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground/60">
                        {!isCollapsed && <span>&copy; {new Date().getFullYear()} Lovissa</span>}
                    </div>
                </div>

                {/* Collapse Toggle (Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute bottom-10 -right-3 h-6 w-6 rounded-full border border-border bg-card items-center justify-center hover:bg-muted transition-colors shadow-sm"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            </div>
        </>
    );
}
