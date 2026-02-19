"use client";

import React from "react";
import { Activity, Play, Zap, Clock, Shield } from "lucide-react";
import { AutomationWorkflow, AutomationActivity, Profile } from "@/lib/supabase/types";

interface AutomationClientProps {
    workflows: AutomationWorkflow[];
    activity: AutomationActivity[];
    profile: Profile | null;
}

const IconMap: Record<string, any> = {
    Zap: Zap,
    Play: Play,
    Shield: Shield,
    Activity: Activity,
    Clock: Clock,
};

export function AutomationClient({ workflows, activity, profile }: AutomationClientProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {profile?.category === 'law-firm' ? "Legal Automation" : "Accounting Automation"}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Monitor and manage your automated workflows for {profile?.company_name || 'your firm'}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workflows.map((flow) => {
                    const Icon = IconMap[flow.icon_name] || Zap;
                    return (
                        <div key={flow.id} className="p-6 rounded-xl bg-card border border-border/50 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon className="h-24 w-24" />
                            </div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold">{flow.name}</h3>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Status</span>
                                    <span className={`flex items-center gap-1.5 font-bold ${flow.status === 'Running' || flow.status === 'Active' ? 'text-green-500' : 'text-muted-foreground'
                                        }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${flow.status === 'Running' || flow.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
                                            }`} />
                                        {flow.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Uptime</span>
                                    <span className="font-bold">{flow.uptime}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Efficiency Gain</span>
                                    <span className="font-bold text-primary">{flow.efficiency_gain}</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-2 bg-muted text-foreground text-xs font-bold rounded-lg hover:bg-muted/80 transition-colors">
                                Configure Workflow
                            </button>
                        </div>
                    );
                })}
                {workflows.length === 0 && (
                    <div className="col-span-3 py-12 text-center text-muted-foreground bg-card border border-dashed border-border rounded-xl">
                        No automated workflows configured yet.
                    </div>
                )}
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <h3 className="font-bold mb-4">Recent Automation Activity</h3>
                <div className="space-y-4">
                    {activity.map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b border-border/10 last:border-0 font-medium">
                            <span className="text-foreground/80">{log.event_name}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString()}</span>
                                <span className={log.status === 'Success' ? 'text-green-500' : 'text-red-500'}>{log.status}</span>
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <div className="py-4 text-center text-muted-foreground text-xs">
                            No recent activity recorded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
