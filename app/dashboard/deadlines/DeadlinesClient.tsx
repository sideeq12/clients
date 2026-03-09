"use client";

import React from "react";
import {
    Calendar,
    Clock,
    ArrowRight,
    Search,
    Mail,
} from "lucide-react";
import { Deadline, Profile } from "@/lib/supabase/types";
import { formatTimeAgo } from "@/lib/date-utils";

interface DeadlinesClientProps {
    deadlines: Deadline[];
    profile: Profile | null;
}

export function DeadlinesClient({ deadlines, profile }: DeadlinesClientProps) {
    const category = profile?.category || "accounting";

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Upcoming Reminders
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Critical deadlines and tasks requiring attention.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Calendar
                    </button>
                </div>
            </div>

            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20">
                    <h2 className="font-bold text-lg text-foreground/80">Schedule</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none w-48"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Reminder Sent</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3 text-right">Index</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {deadlines.map((dl) => {
                                // Risk logic refined as Urgency Index
                                let riskLevel = 'Standard';
                                const dueDate = new Date(dl.due_date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const diffTime = dueDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                if (dl.escalated || (diffDays < 0)) riskLevel = 'High';
                                else if (diffDays <= 3) riskLevel = 'Medium';

                                return (
                                    <tr key={dl.id} className="hover:bg-muted/10 transition-colors group/row">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/5 text-primary/60 group-hover/row:bg-primary/10 group-hover/row:text-primary transition-colors">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground/90 font-semibold max-w-[400px] truncate">
                                                        {dl.task} <span className="text-muted-foreground font-normal">sent to</span> {dl.client_name || dl.company_name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-bold">
                                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                        {formatTimeAgo(dl.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(dl.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${riskLevel === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-green-500/10 text-green-500'
                                                }`}>
                                                {riskLevel === 'High' ? 'High Urgency' : `${riskLevel} Urgency`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {deadlines.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-muted-foreground italic text-xs">
                                        No upcoming reminders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
