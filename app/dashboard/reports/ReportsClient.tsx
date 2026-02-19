"use client";

import React from "react";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    FileText,
    Calendar,
    ArrowUpRight,
    Filter,
    Activity,
    ChevronRight,
    Clock,
    Shield,
} from "lucide-react";
import { Report, Profile } from "@/lib/supabase/data-service";

interface ReportsClientProps {
    reports: Report[];
    profile: Profile | null;
}

const IconMap: Record<string, any> = {
    BarChart3: BarChart3,
    PieChart: PieChart,
    TrendingUp: TrendingUp,
    Activity: Activity,
    Clock: Clock,
    Shield: Shield,
};

export function ReportsClient({ reports, profile }: ReportsClientProps) {
    const category = profile?.category || "accounting";

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Reports & Analytics</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {category === "law-firm" ? "Access case analytics and practice management reports." : "Generate and access comprehensive financial reports for your accounting clients."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Schedule Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <FileText className="h-4 w-4" />
                        Generate New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reports.map((cat) => {
                    const Icon = IconMap[cat.icon_name] || BarChart3;
                    return (
                        <div key={cat.id} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:border-primary/50 transition-all cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-lg bg-muted ${cat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <h3 className="font-bold text-sm text-foreground/90">{cat.name}</h3>
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground tracking-tight uppercase">{cat.count} Available</span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                        </div>
                    );
                })}
                {reports.length === 0 && (
                    <div className="col-span-4 py-12 text-center text-muted-foreground bg-card border border-dashed border-border rounded-xl">
                        No report templates configured.
                    </div>
                )}
            </div>

            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20 px-6">
                    <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Recent Generation History</h2>
                    <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Filter by type</span>
                    </div>
                </div>
                <div className="overflow-x-auto p-4 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                    <div className="p-3 rounded-full bg-muted text-muted-foreground/40">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">No Recent Reports</p>
                        <p className="text-xs text-muted-foreground">Generated reports will appear here for download.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
