"use client";

import React, { useMemo } from "react";
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
    LineChart as LineChartIcon,
    Download
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Report, Profile } from "@/lib/supabase/types";

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

// Static mock data for recent reports history
const recentReports = [
    { id: 'REP-001', name: "Monthly Financial Summary", type: "Financial", date: "Today", generatedBy: "System", size: "2.4 MB" },
    { id: 'REP-002', name: "Client Intake Performance", type: "Analytics", date: "Yesterday", generatedBy: "Admin", size: "1.1 MB" },
    { id: 'REP-003', name: "Q3 Case Resolution Rate", type: "Performance", date: "Last Mon", generatedBy: "Admin", size: "3.8 MB" },
    { id: 'REP-004', name: "Tax Filing Status Report", type: "Compliance", date: "Last Wed", generatedBy: "System", size: "1.5 MB" },
    { id: 'REP-005', name: "Active Workflows Overview", type: "Analytics", date: "Last Thu", generatedBy: "System", size: "0.9 MB" },
];

export function ReportsClient({ reports, profile }: ReportsClientProps) {
    const category = profile?.category || "accounting";

    // Generate trend data for the chart (Reports generated per day over the last 7 days)
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        // Mock a realistic trend line for report generation volume
        const mockTrend = [4, 2, 7, 3, 5, 1, 6];

        return last7Days.map((date, index) => {
            return {
                day: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                count: mockTrend[index]
            };
        });
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Reports & Analytics</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {category === "law-firm" ? "Access read-only case analytics and practice management reports." : "View comprehensive read-only financial reports for your accounting clients."}
                    </p>
                </div>
                {/* Removed Action Buttons for Read-Only Layout */}
            </div>

            {/* Top KPI Grid (Available Reports Overview) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reports
                    .filter(cat => cat.name !== 'Case Outcomes' && cat.name !== 'Profit & Loss')
                    .map((cat) => {
                        const Icon = IconMap[cat.icon_name] || BarChart3;
                        return (
                            <div key={cat.id} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2 rounded-lg bg-muted ${cat.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm text-foreground/90">{cat.name}</h3>
                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground tracking-tight uppercase">{cat.count} Available</span>
                                </div>
                            </div>
                        );
                    })}
                {reports.filter(cat => cat.name !== 'Case Outcomes' && cat.name !== 'Profit & Loss').length === 0 && (
                    <div className="col-span-4 py-8 text-center text-sm text-muted-foreground bg-card border border-dashed border-border/50 rounded-xl">
                        No report templates configured.
                    </div>
                )}
            </div>

            {/* Report Generation Trend Line Chart */}
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground/90 flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-primary" />
                            Report Generation Trend
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Volume of reports generated automatically or by administrators over 7 days.</p>
                    </div>
                </div>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '11px' }}
                            />
                            <Line type="monotone" dataKey="count" name="Reports Generated" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Table for recent history */}
            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20 px-6">
                    <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Recent Generation History
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Report ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Generated By</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-muted-foreground">
                            {recentReports.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary/80">{item.id}</td>
                                    <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">{item.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs">
                                            {item.generatedBy === 'System' ? <Activity className="h-3 w-3 text-blue-500" /> : <Shield className="h-3 w-3 text-amber-500" />}
                                            {item.generatedBy}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted/80 text-foreground transition-colors group">
                                            <Download className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
