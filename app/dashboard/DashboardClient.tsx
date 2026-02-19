"use client";

import React from "react";
import {
    MessageSquare,
    Clock,
    AlertTriangle,
    TrendingUp,
    CheckCircle2,
    Briefcase,
    Plus,
    Filter,
    Activity,
    Users,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    ComposedChart,
    LineChart,
    Line,
    Legend,
} from "recharts";
import { Profile, Client, Enquiry, Deadline, Case } from "@/lib/supabase/types";

interface DashboardClientProps {
    profile: Profile | null;
    clients: Client[];
    enquiries: Enquiry[];
    deadlines: Deadline[];
    cases: Case[];
    stats: {
        serviceDistribution: any[];
        enquiriesTrend: any[];
        caseStageCounts: Record<string, number>;
        practiceAreas: any[];
    };
}

// Legal charts are now dynamic based on stats prop
const conversionData = [
    { month: "Sep", responseTime: 3.2, conversion: 6.5 },
    { month: "Oct", responseTime: 2.8, conversion: 7.2 },
    { month: "Nov", responseTime: 2.5, conversion: 7.8 },
    { month: "Dec", responseTime: 2.1, conversion: 8.1 },
    { month: "Jan", responseTime: 1.9, conversion: 8.3 },
    { month: "Feb", responseTime: 1.8, conversion: 8.4 },
];

export function DashboardClient({ profile, clients, enquiries, deadlines, cases, stats }: DashboardClientProps) {
    const category = profile?.category || "accounting";

    if (category === "law-firm") {
        return (
            <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Law Firm Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Hello, {profile?.full_name || 'Solicitor'}. Practice analytics and legal engagement overview.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                            <Plus className="h-4 w-4" />
                            New Case
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: "Total Enquiries", value: enquiries.length.toString(), change: "+14%", trend: "up", icon: MessageSquare },
                        { label: "% Converted", value: "32%", change: "+2.5%", trend: "up", icon: TrendingUp },
                        { label: "Avg Response Time", value: "2.4h", change: "-10%", trend: "up", icon: Clock },
                        { label: "Escalations", value: "15", change: "Action required", trend: "down", icon: AlertTriangle },
                        {
                            label: "Admin hours saved(this month)",
                            value: "42.5hrs",
                            subValue: "Estimate value: £722.5 (avg rate)",
                            change: "+18%",
                            trend: "up",
                            icon: Clock
                        },
                        { label: "Active Cases", value: cases.length.toString(), change: "+5%", trend: "up", icon: Briefcase },
                    ].map((kpi) => (
                        <div key={kpi.label} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <kpi.icon className="h-4 w-4" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                    kpi.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}>
                                    {kpi.change}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{kpi.label}</p>
                                <h3 className="text-xl font-bold tracking-tight">{kpi.value}</h3>
                                {kpi.subValue && (
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1 whitespace-pre-line">{kpi.subValue}</p>
                                )}
                            </div>
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
                                <p className="text-xs text-muted-foreground mt-0.5">Distribution of legal enquiries over the past week.</p>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.enquiriesTrend}>
                                    <defs>
                                        <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="count" name="Enquiries" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnquiries)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cases by Stage */}
                    <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-foreground/90">Cases by Stage</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Operational case progression tracking.</p>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.enquiriesTrend} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                                    <Line type="monotone" dataKey="count" name="Daily Enquiries" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3, fill: 'var(--primary)' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Practice Area Distribution */}
                    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground/90 mb-8">Practice Areas</h3>
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
                                <p className="text-xs text-muted-foreground text-center py-8">No case data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default: Accounting Dashboard
    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, {profile?.full_name || 'Accountant'}. Real-time overview of accounting operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        New Entry
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: "Total Enquiries", value: enquiries.length.toString(), change: "+12%", trend: "up", icon: MessageSquare },
                    { label: "Active Clients", value: clients.length.toString(), change: "+2%", trend: "up", icon: Users },
                    { label: "Avg Response Time", value: "1.8h", change: "-15%", trend: "up", icon: Clock },
                    {
                        label: "Document chase Frequency",
                        value: "18",
                        subValue: "Outstanding requests: 18 | Avg pending: 4.2d",
                        change: "+5%",
                        trend: "down",
                        icon: Activity
                    },
                    {
                        label: "Deadline compliance rate",
                        value: "93.7%",
                        subValue: "Total due: 48 | Met on time: 45",
                        change: "+2.4%",
                        trend: "up",
                        icon: CheckCircle2
                    },
                    {
                        label: "Admin hours saved(this month)",
                        value: "33.7hrs",
                        subValue: "Estimate value: £572.9 (based on avg billable rate)",
                        change: "+24%",
                        trend: "up",
                        icon: Clock
                    },
                ].map((kpi) => (
                    <div key={kpi.label} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <kpi.icon className="h-4 w-4" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                kpi.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}>
                                {kpi.change}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                            <h3 className="text-xl font-bold tracking-tight">{kpi.value}</h3>
                            {kpi.subValue && (
                                <p className="text-[10px] text-muted-foreground font-medium mt-1 whitespace-pre-line">{kpi.subValue}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <h3 className="text-lg font-bold mb-8">Enquiries Over Time</h3>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.enquiriesTrend}>
                                <defs>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnquiries)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <h3 className="text-lg font-bold mb-8">Requested Services</h3>
                    <div className="h-[240px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.serviceDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 11 }} width={100} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                                    {stats.serviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {stats.serviceDistribution.map((service) => (
                            <div key={service.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: service.color }} />
                                    {service.name}
                                </div>
                                <span className="font-bold">{service.value} users</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
