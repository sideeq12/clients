"use client";

import React, { useMemo } from "react";
import { Briefcase, Search, Filter, Plus, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Case, Profile } from "@/lib/supabase/types";

interface CasesClientProps {
    cases: Case[];
    profile: Profile | null;
}

export function CasesClient({ cases, profile }: CasesClientProps) {
    // Generate trend data for the chart (Cases opened per day over the last 7 days)
    const trendData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        return last7Days.map(date => {
            return {
                day: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                count: cases.filter(c => c.opened_date && c.opened_date.startsWith(date)).length
            };
        });
    }, [cases]);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">Track and manage all active cases for {profile?.company_name || 'your firm'}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Sort & Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active", count: cases.filter(c => c.status === 'Active').length, icon: Briefcase, color: "text-blue-500" },
                    { label: "Urgent", count: cases.filter(c => c.status === 'Urgent').length, icon: AlertCircle, color: "text-red-500" },
                    { label: "Completed", count: cases.filter(c => c.status === 'Closed').length, icon: CheckCircle2, color: "text-green-500" },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                            <h3 className="text-xl font-bold">{stat.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cases Trend Chart */}
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground/90">Case Volume Trend</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">New cases opened over the past 7 days.</p>
                    </div>
                </div>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                            <Line type="monotone" dataKey="count" name="New Cases" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search cases, clients or solicitors..."
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Case ID</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Practice Area</th>
                                <th className="px-6 py-4">Solicitor</th>
                                <th className="px-6 py-4">Opened</th>
                                <th className="px-6 py-4">Stage</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {cases.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">{item.case_id_string}</td>
                                    <td className="px-6 py-4 font-medium">{item.client_name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.case_type}</td>
                                    <td className="px-6 py-4 font-medium">{item.solicitor}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{new Date(item.opened_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold capitalize text-foreground/80 bg-muted/50 px-2 py-1 rounded-md">
                                            {(item.stage || 'Intake').replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.status === 'Urgent' ? 'bg-red-500/10 text-red-500' :
                                            item.status === 'Active' ? 'bg-blue-500/10 text-blue-500' :
                                                item.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-green-500/10 text-green-500'
                                            }`}>
                                            {item.status}
                                        </span>
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
