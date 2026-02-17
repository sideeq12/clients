"use client";

import React from "react";
import { Users, Search, Filter, Plus, Briefcase, Star, Clock } from "lucide-react";

const solicitors = [
    { name: "Sarah Jenkins", role: "Senior Partner", specialization: "Family Law", caseload: 24, performance: 4.8, status: "Active" },
    { name: "Mark Thompson", role: "Associate", specialization: "Conveyancing", caseload: 18, performance: 4.5, status: "Active" },
    { name: "Elena Rodriguez", role: "Senior Associate", specialization: "Litigation", caseload: 21, performance: 4.9, status: "Active" },
    { name: "David Wright", role: "Junior Associate", specialization: "Corporate", caseload: 15, performance: 4.2, status: "On Leave" },
];

export default function SolicitorsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Solicitor Directory</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage staff workload and performance metrics.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm transition-all active:scale-[0.98]">
                    <Plus className="h-4 w-4" />
                    Add Solicitor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {solicitors.map((staff) => (
                    <div key={staff.name} className="p-6 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {staff.name.charAt(0)}
                            </div>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${staff.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                                }`}>
                                {staff.status}
                            </span>
                        </div>
                        <div className="space-y-1 mb-4">
                            <h3 className="font-bold text-lg">{staff.name}</h3>
                            <p className="text-sm text-primary font-medium">{staff.role}</p>
                            <p className="text-xs text-muted-foreground">{staff.specialization}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Caseload</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-bold">{staff.caseload}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Rating</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold">{staff.performance}</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-2 py-2 text-xs font-bold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
