"use client";

import React, { useMemo } from "react";
import { Clock, Video, User, CheckCircle2, AlertCircle, FileText, LineChart as LineChartIcon } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Profile, Appointment } from "@/lib/supabase/types";

interface AppointmentsClientProps {
    profile: Profile | null;
    appointments: Appointment[];
}

export function AppointmentsClient({ profile, appointments }: AppointmentsClientProps) {
    const category = profile?.category || 'accounting';

    // Generate trend data for the chart (Intakes per day over the last 7 days)
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        const countsByDay = appointments.reduce((acc, app) => {
            const day = new Date(app.appointment_date).toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return last7Days.map((date) => {
            return {
                day: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                count: countsByDay[date] || 0
            };
        });
    }, [appointments]);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Intakes & Appointments</h1>
                    <p className="text-muted-foreground text-sm mt-1">Read-only view of your active {category === 'law-firm' ? 'legal intakes' : 'client onboarding workflows'} and upcoming meetings.</p>
                </div>
            </div>

            {/* Workflow KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Upcoming</p>
                        <h3 className="text-xl font-bold">{appointments.filter(d => d.status === 'Upcoming' || d.status === 'Scheduled').length}</h3>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Action Required</p>
                        <h3 className="text-xl font-bold">{appointments.filter(d => d.status === 'Action Required' || d.status === 'Awaiting Documents').length}</h3>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Completed (30d)</p>
                        <h3 className="text-xl font-bold">{appointments.filter(d => d.status === 'Completed').length}</h3>
                    </div>
                </div>
            </div>

            {/* Intake Volume Trend Chart */}
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground/90 flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-primary" />
                            Intake Volume Trend
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">New intakes/appointments created over the past 7 days.</p>
                    </div>
                </div>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                            <Line type="monotone" dataKey="count" name="New Intakes" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Content area */}
            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
                    <h3 className="font-bold text-foreground/90 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Active Workflow List
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Workflow Step</th>
                                <th className="px-6 py-4">Date / Time</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-muted-foreground">
                            {appointments.map((flow) => (
                                <tr key={flow.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">{flow.client_name}</td>
                                    <td className="px-6 py-4 font-medium">
                                        {flow.type}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">
                                            {new Date(flow.appointment_date).toLocaleDateString()} {new Date(flow.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {flow.contact_person}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${flow.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            (flow.status === 'Upcoming' || flow.status === 'Scheduled') ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {flow.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground italic text-xs">
                            No active workflow steps found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
