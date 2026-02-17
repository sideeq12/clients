"use client";

import React from "react";
import { Activity, Play, Zap, Clock, Shield, CheckCircle2 } from "lucide-react";

const workflows = [
    { name: "Document Intake", status: "Running", uptime: "99.9%", efficiency: "+15%", icon: Zap },
    { name: "Client Onboarding", status: "Idle", uptime: "100%", efficiency: "+22%", icon: Play },
    { name: "Conflict Check", status: "Active", uptime: "98.5%", efficiency: "+10%", icon: Shield },
];

export default function AutomationPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Legal Automation</h1>
                <p className="text-muted-foreground text-sm mt-1">Monitor and manage your automated legal workflows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workflows.map((flow) => (
                    <div key={flow.name} className="p-6 rounded-xl bg-card border border-border/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <flow.icon className="h-24 w-24" />
                        </div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <flow.icon className="h-5 w-5" />
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
                                <span className="font-bold text-primary">{flow.efficiency}</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 bg-muted text-foreground text-xs font-bold rounded-lg hover:bg-muted/80 transition-colors">
                            Configure Workflow
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <h3 className="font-bold mb-4">Recent Automation Activity</h3>
                <div className="space-y-4">
                    {[
                        { event: "Document signed by client", time: "10 mins ago", status: "Success" },
                        { event: "Conflict check completed", time: "45 mins ago", status: "Success" },
                        { event: "Auto-file generation failed", time: "2 hours ago", status: "Error" },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/10 last:border-0 font-medium">
                            <span className="text-foreground/80">{log.event}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-muted-foreground text-xs">{log.time}</span>
                                <span className={log.status === 'Success' ? 'text-green-500' : 'text-red-500'}>{log.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
