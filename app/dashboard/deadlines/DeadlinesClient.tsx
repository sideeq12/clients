"use client";

import React from "react";
import {
    Calendar,
    Clock,
    ArrowRight,
    Search,
} from "lucide-react";
import { Deadline, Profile } from "@/lib/supabase/data-service";

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
                        {deadlines.map((dl) => (
                            <div key={dl.id} className="group p-4 hover:bg-muted/40 transition-all border-b border-border/20 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm tracking-tight">{dl.task}</h4>
                                    <p className="text-xs text-muted-foreground">{dl.client_name}</p>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-8">
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Due</p>
                                        <p className={`text-sm font-bold ${dl.priority === 'Critical' ? 'text-red-500' :
                                            dl.priority === 'High' ? 'text-amber-500' :
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
                        ))}
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
