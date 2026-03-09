"use client";

import React from "react";
import {
    MessageSquare,
    Clock,
    AlertTriangle,
    TrendingUp,
    CheckCircle2,
    Briefcase,
    Filter,
    Users,
    X,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
} from "recharts";
import { Profile, Company, Enquiry, Deadline, Case, Staff } from "@/lib/supabase/types";

interface DashboardClientProps {
    profile: Profile | null;
    companies: Company[];
    enquiries: Enquiry[];
    deadlines: Deadline[];
    cases: Case[];
    staff: Staff[];
    stats: {
        serviceDistribution: { name: string; value: number; color: string }[];
        enquiriesTrend: { day: string; count: number; items?: { id: string; title: string }[] }[];
        casesTrend: { day: string; count: number; items?: { id: string; title: string; solicitor?: string; stage?: string }[] }[];
        caseStageCounts: Record<string, number>;
        practiceAreas: { name: string; value: number; color: string }[];
    };
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border border-border shadow-xl rounded-xl p-4 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Total Enquiries</span>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {data.count}
                    </span>
                </div>
                {data.items && data.items.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                        {data.items.slice(0, 5).map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex flex-col gap-0.5 group/item transition-colors">
                                <div className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <p className="text-[11px] leading-relaxed text-foreground/90 line-clamp-2">
                                        {item.title}
                                    </p>
                                </div>
                                {(item.solicitor || item.stage) && (
                                    <div className="pl-3.5 flex items-center gap-2 text-[9px] text-muted-foreground font-medium uppercase tracking-tight">
                                        {item.solicitor && <span>• {item.solicitor}</span>}
                                        {item.stage && <span>• {item.stage.replace(/_/g, ' ')}</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                        {data.items.length > 5 && (
                            <p className="text-[10px] text-muted-foreground italic pl-3.5 pt-1">
                                + {data.items.length - 5} more...
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function DashboardClient({ profile, companies, enquiries, deadlines, cases, staff, stats }: DashboardClientProps) {
    const [showEscalations, setShowEscalations] = React.useState(false);
    const category = profile?.category || "accounting";

    const recentEscalations = [
        ...cases.filter(c => c.status === "Overdue" || c.stage === "Escalated").map(c => {
            const staffMember = staff.find(s => s.full_name === c.solicitor || s.id === c.assigned_staff_id);
            return {
                title: `Case: ${c.company_name}`,
                staffName: staffMember?.full_name || c.solicitor || "Unassigned",
                staffRole: staffMember?.role || "Staff",
                resolved: c.stage === "Resolved" || c.status === "Completed",
                date: c.opened_date
            };
        }),
        ...deadlines.filter(d => d.escalated || d.status === "Overdue" || d.priority === "Critical").map(d => {
            const staffMember = staff.find(s => s.id === d.assigned_staff_id);
            return {
                title: `Deadline: ${d.task}`,
                staffName: staffMember?.full_name || "System Alert",
                staffRole: staffMember?.role || "Automated",
                resolved: d.status === "Completed",
                date: d.due_date
            };
        })
    ].slice(0, 4);

    const escalationsCount = recentEscalations.length > 0 ? recentEscalations.length.toString() : "0";

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Hello, {profile?.full_name || "Company"}. Real-time analytics and engagement overview.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: "Total Enquiries", value: enquiries.length.toString(), change: "+14%", trend: "up", icon: MessageSquare },
                    { label: "% Converted", value: "32%", change: "+2.5%", trend: "up", icon: TrendingUp },
                    { label: "Avg Response Time", value: "2.4h", change: "-10%", trend: "up", icon: Clock },
                    { label: "Escalations", value: escalationsCount, change: "Action required", trend: "down", icon: AlertTriangle },
                    {
                        label: "Admin hours saved(this month)",
                        value: "42.5hrs",
                        subValue: "Estimate value: £722.5 (avg rate)",
                        change: "+18%",
                        trend: "up",
                        icon: Clock,
                    },
                    { label: "Active Cases", value: cases.length.toString(), change: "+5%", trend: "up", icon: Briefcase },
                ].map((kpi) => (
                    <div key={kpi.label} className="relative p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <kpi.icon className="h-4 w-4" />
                            </div>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : kpi.trend === "down"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}
                            >
                                {kpi.change}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                                {kpi.label}
                            </p>
                            <h3 className="text-xl font-bold tracking-tight">{kpi.value}</h3>
                            {kpi.subValue && (
                                <p className="text-[10px] text-muted-foreground font-medium mt-1 whitespace-pre-line">
                                    {kpi.subValue}
                                </p>
                            )}
                        </div>

                        {kpi.label === "Escalations" && recentEscalations.length > 0 && (
                            <button
                                onClick={() => setShowEscalations(true)}
                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                aria-label="View escalations"
                            />
                        )}

                        {kpi.label === "Escalations" && recentEscalations.length > 0 && showEscalations && (
                            <div className="fixed z-[100] inset-0 flex items-center justify-center p-4">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300"
                                    onClick={() => setShowEscalations(false)}
                                />

                                <div className="relative p-6 rounded-2xl border border-border/50 bg-card shadow-2xl flex flex-col gap-4 w-[450px] max-w-full animate-in zoom-in-95 fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                        <div className="flex flex-col gap-0.5">
                                            <h4 className="text-lg font-bold">Recent Escalations</h4>
                                            <p className="text-xs text-muted-foreground">{recentEscalations.length} items requiring attention</p>
                                        </div>
                                        <button
                                            onClick={() => setShowEscalations(false)}
                                            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                                        {recentEscalations.map((esc, i) => (
                                            <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-muted/40 border border-border/40 hover:border-border/80 transition-all group/item">
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-sm font-semibold text-foreground/90 leading-snug line-clamp-2">{esc.title}</span>
                                                    <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${esc.resolved ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-destructive/15 text-destructive'}`}>
                                                        {esc.resolved ? 'Resolved' : 'Action Req'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground mt-1 bg-background/60 p-2 rounded-lg border border-border/30">
                                                    <span className="flex items-center gap-2 w-full">
                                                        <Users className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="font-medium truncate">{esc.staffName}</span>
                                                        <span className="opacity-50 font-bold text-[10px] truncate uppercase tracking-tighter ml-auto">{esc.staffRole}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enquiry Trends */}
                <div className="lg:col-span-3 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-foreground/90">Enquiry Trends</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Distribution of enquiries over the past week.</p>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={stats.enquiriesTrend}>
                                <defs>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="count" name="Enquiries" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnquiries)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cases by Stage */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-foreground/90">Cases by Stage</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Operational case progression tracking.</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={stats.casesTrend} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Line type="monotone" dataKey="count" name="Daily Cases" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3, fill: "var(--primary)" }} />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Practice Area Distribution */}
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground/90 mb-8">
                        {category === "law-firm" ? "Practice Areas" : "Service Categories"}
                    </h3>
                    <div className="space-y-5">
                        {stats.practiceAreas.map((area) => (
                            <div key={area.name} className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold">{area.name}</span>
                                    <span className="font-bold">{area.value}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${area.value}%`, backgroundColor: area.color }} />
                                </div>
                            </div>
                        ))}
                        {stats.practiceAreas.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-8">
                                {category === "law-firm" ? "No case data available." : "No service data available."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
