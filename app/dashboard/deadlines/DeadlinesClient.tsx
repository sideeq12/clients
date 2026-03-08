"use client";

import React from "react";
import {
    Calendar,
    Clock,
    ArrowRight,
    Search,
} from "lucide-react";
import { Deadline, Profile } from "@/lib/supabase/types";

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
                        {category === "law-firm" ? "Legal Deadlines" : "Accounting Deadlines"}
                    </h1>
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
                <div className="p-0">
                    <div>
                        {deadlines.map((dl) => {
                            // Derivative Risk Logic
                            let riskLevel = 'Low';
                            const dueDate = new Date(dl.due_date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Normalize to start of day

                            const diffTime = dueDate.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            // Prevent completed tasks from showing high risk
                            if (dl.status === 'Completed') {
                                riskLevel = 'None';
                            } else if (dl.escalated || (diffDays < 0 && dl.status !== 'Completed')) {
                                riskLevel = 'High';
                            } else if (diffDays >= 0 && diffDays <= 3) {
                                riskLevel = 'Medium';
                            }

                            return (
                                <div key={dl.id} className="group p-4 hover:bg-muted/40 transition-all border-b border-border/20 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
                                            {dl.task}
                                            {riskLevel === 'High' && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500 text-white animate-pulse">
                                                    High Risk
                                                </span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground">{dl.company_name}</p>
                                            <span className="text-[10px] text-muted-foreground/50 px-1 rounded bg-muted/50 border border-border/50">{dl.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Index</p>
                                            <p className={`text-xs font-bold uppercase ${riskLevel === 'High' ? 'text-red-500' :
                                                riskLevel === 'Medium' ? 'text-amber-500' :
                                                    riskLevel === 'None' ? 'text-muted-foreground/50' :
                                                        'text-green-500'
                                                }`}>{riskLevel}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Due</p>
                                            <p className={`text-sm font-bold ${dl.priority === 'Critical' || riskLevel === 'High' ? 'text-red-500' :
                                                dl.priority === 'High' || riskLevel === 'Medium' ? 'text-amber-500' :
                                                    'text-foreground/80'
                                                }`}>{new Date(dl.due_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="min-w-[100px] text-right">
                                            <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${dl.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                                                dl.status === 'Action Required' ? 'bg-orange-500/10 text-orange-500' :
                                                    dl.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-green-500/10 text-green-500'
                                                }`}>
                                                {dl.status}
                                            </span>
                                        </div>
                                        <button className="hidden md:flex p-2 rounded-full opacity-0 group-hover:opacity-100 bg-primary/10 text-primary transition-all active:scale-90">
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {deadlines.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                No upcoming deadlines found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
