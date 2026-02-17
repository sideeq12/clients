"use client";

import React from "react";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    FileText,
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
    FileSpreadsheet,
    Activity,
    ChevronRight,
    Clock,
    Shield,
} from "lucide-react";

const accountingReports = [
    { name: "Profit & Loss", description: "Summary of revenues, costs, and expenses.", count: 12, icon: BarChart3, color: "text-blue-500" },
    { name: "Balance Sheet", description: "Statement of assets, liabilities, and capital.", count: 4, icon: PieChart, color: "text-purple-500" },
    { name: "Tax Estimator", description: "Projected tax liabilities for current period.", count: 8, icon: TrendingUp, color: "text-green-500" },
    { name: "Payroll Summary", description: "Overview of employee compensation and taxes.", count: 24, icon: Activity, color: "text-orange-500" },
];

const lawReports = [
    { name: "Case Outcomes", description: "Success rates and resolution summaries.", count: 8, icon: BarChart3, color: "text-purple-500" },
    { name: "Billable Hours", description: "Summary of solicitor time tracking.", count: 15, icon: Clock, color: "text-blue-500" },
    { name: "Compliance Audit", description: "Risk assessment and SRA compliance status.", count: 5, icon: Shield, color: "text-red-500" },
    { name: "Practice Revenue", description: "Financial performance across practice areas.", count: 12, icon: TrendingUp, color: "text-teal-500" },
];

export default function ReportsPage() {
    const [category, setCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem("portal_category");
        setCategory(stored);
    }, []);

    const categories = category === "law-firm" ? lawReports : accountingReports;

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
                {categories.map((cat) => (
                    <div key={cat.name} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-muted ${cat.color}`}>
                                <cat.icon className="h-5 w-5" />
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
                ))}
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
