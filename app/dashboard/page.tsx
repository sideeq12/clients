"use client";

import React from "react";
import {
    MessageSquare,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    TrendingUp,
    Users,
    MousePointer2
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
    PieChart,
    Pie
} from "recharts";

const responseData = [
    { name: "Mon", responses: 45 },
    { name: "Tue", responses: 52 },
    { name: "Wed", responses: 48 },
    { name: "Thu", responses: 61 },
    { name: "Fri", responses: 55 },
    { name: "Sat", responses: 42 },
    { name: "Sun", responses: 38 },
];

const enquiriesByCategory = [
    { name: "Tax", count: 28, color: "var(--primary)" },
    { name: "Audit", count: 19, color: "#3b82f6" },
    { name: "Advisory", count: 15, color: "#6366f1" },
    { name: "Compliance", count: 12, color: "#a855f7" },
];

const timelineEvents = [
    { id: 1, title: "New inquiry from Acme Corp", time: "2 hours ago", type: "inquiry" },
    { id: 2, title: "Monthly report generated", time: "5 hours ago", type: "report" },
    { id: 3, title: "System audit completed", time: "Yesterday", type: "event" },
    { id: 4, title: "New client onboarding", time: "2 days ago", type: "inquiry" },
];

const stats = [
    {
        name: "Triggered Events",
        value: "1,284",
        change: "+12.5%",
        trend: "up",
        icon: Zap,
        description: "Events captured this month"
    },
    {
        name: "Client Inquiries",
        value: "74",
        change: "+5.2%",
        trend: "up",
        icon: MessageSquare,
        description: "Active support tickets"
    },
    {
        name: "Avg Response Time",
        value: "2.4h",
        change: "-18%",
        trend: "up",
        icon: Clock,
        description: "Down from 2.9h last month"
    },
    {
        name: "Conversion Rate",
        value: "12.4%",
        change: "+2.1%",
        trend: "up",
        icon: TrendingUp,
        description: "Lead to client conversion"
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground text-sm">Welcome back, here's what's happening with your workspace today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center ${stat.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {stat.change}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                            <p className="text-[11px] text-muted-foreground/70">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main performance chart */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="font-bold">Performance Analytics</h3>
                            <p className="text-xs text-muted-foreground">Detailed activity trend over the last 7 days</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                Responses
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={responseData}>
                                <defs>
                                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.5, fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.5, fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="responses"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorResponses)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories & Actions */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <h3 className="font-bold mb-4">Inquiry Categories</h3>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enquiriesByCategory} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--foreground)', opacity: 0.8, fontSize: 11 }}
                                        width={70}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderRadius: '8px',
                                            fontSize: '11px'
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                                        {enquiriesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                            {enquiriesByCategory.map((cat) => (
                                <div key={cat.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className="font-bold">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h3 className="font-bold text-lg leading-tight">Generate custom analytics report</h3>
                            <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-[0.98]">
                                Download Now
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Timeline & Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-6 rounded-xl bg-card border border-border shadow-sm">
                    <h3 className="font-bold mb-6">Recent Events</h3>
                    <div className="space-y-6">
                        {timelineEvents.map((event) => (
                            <div key={event.id} className="flex gap-4 relative last:after:hidden after:absolute after:left-[11px] after:top-[26px] after:bottom-[-26px] after:w-px after:bg-border">
                                <div className={`relative z-10 h-[22px] w-[22px] rounded-full border-2 border-background flex items-center justify-center ${event.type === 'inquiry' ? 'bg-blue-500' : event.type === 'report' ? 'bg-primary' : 'bg-orange-500'
                                    }`}>
                                    <div className="h-1 w-1 rounded-full bg-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold leading-none">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg">
                        View all activity
                    </button>
                </div>

                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Key Performance Indices</h3>
                            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="text-xs font-medium">User Growth</span>
                                </div>
                                <h4 className="text-xl font-bold">14.2%</h4>
                                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[70%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MousePointer2 className="h-4 w-4" />
                                    <span className="text-xs font-medium">Click Through</span>
                                </div>
                                <h4 className="text-xl font-bold">5.8%</h4>
                                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[45%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Zap className="h-4 w-4" />
                                    <span className="text-xs font-medium">Energy Save</span>
                                </div>
                                <h4 className="text-xl font-bold">92%</h4>
                                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[92%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground">Tip:</span> You can now filter clinical reports by region and department. Check the advanced settings to enable specific notifications for your team.
                    </div>
                </div>
            </div>
        </div>
    );
}
