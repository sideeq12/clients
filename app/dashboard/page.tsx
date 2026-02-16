"use client";

import React from "react";
import {
    Users,
    TrendingUp,
    Target,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Calendar
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const performanceData = [
    { name: "Jan", visits: 4000, leads: 240 },
    { name: "Feb", visits: 3000, leads: 198 },
    { name: "Mar", visits: 2000, leads: 980 },
    { name: "Apr", visits: 2780, leads: 390 },
    { name: "May", visits: 1890, leads: 480 },
    { name: "Jun", visits: 2390, leads: 380 },
    { name: "Jul", visits: 3490, leads: 430 },
];



const stats = [
    { name: "Total Clients", value: "1,284", change: "+12.5%", trend: "up", icon: Users },
    { name: "Active Ads", value: "42", change: "+5.2%", trend: "up", icon: Target },
    { name: "Avg. ROI", value: "4.8x", change: "-2.1%", trend: "down", icon: TrendingUp },
    { name: "Monthly Spend", value: "£12,450", change: "+8.4%", trend: "up", icon: DollarSign },
];

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-foreground/60">Performance overview for your campaigns.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border text-sm font-medium hover:bg-foreground/5 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 rounded-lg bg-card border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-primary/5">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <button className="p-1 rounded-md hover:bg-foreground/5 transition-all">
                                <MoreVertical className="h-4 w-4 text-foreground/40" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground/60">{stat.name}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <span className={`text-xs font-semibold flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                                    }`}>
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    )}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                {/* Main Performance Chart */}
                <div className="p-6 rounded-lg bg-card border border-border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold">Conversion Growth</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5 font-medium">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                Leads
                            </div>
                            <div className="flex items-center gap-1.5 font-medium text-foreground/40">
                                <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                                Visits
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.4, fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.4, fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="leads"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorLeads)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
