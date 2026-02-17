"use client";

import React from "react";
import { Briefcase, Search, Filter, Plus, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const cases = [
    { id: "CAS-2024-001", client: "John Smith", type: "Family Law", solicitor: "Sarah J.", status: "Active", opened: "2024-02-10" },
    { id: "CAS-2024-002", client: "Alice Brown", type: "Conveyancing", solicitor: "Mark T.", status: "Pending", opened: "2024-02-12" },
    { id: "CAS-2024-003", client: "Robert Wilson", type: "Litigation", solicitor: "Elena R.", status: "Urgent", opened: "2024-02-14" },
    { id: "CAS-2024-004", client: "Tech Corp", type: "Corporate", solicitor: "David W.", status: "Closed", opened: "2024-01-20" },
];

export default function CasesPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">Track and manage all active legal cases.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Sort & Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        New Case
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active", count: 124, icon: Briefcase, color: "text-blue-500" },
                    { label: "Urgent", count: 15, icon: AlertCircle, color: "text-red-500" },
                    { label: "Completed", count: 842, icon: CheckCircle2, color: "text-green-500" },
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
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {cases.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">{item.id}</td>
                                    <td className="px-6 py-4 font-medium">{item.client}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.type}</td>
                                    <td className="px-6 py-4 font-medium">{item.solicitor}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.opened}</td>
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
