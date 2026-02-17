"use client";

import React from "react";
import {
    Users,
    Search,
    Filter,
    Plus,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    CheckCircle2,
    Shield,
    Briefcase,
} from "lucide-react";

const clients = [
    {
        id: "CLT-001",
        name: "Acme Corp Ltd",
        contact: "John Smith",
        email: "john@acmecorp.com",
        phone: "+44 20 7123 4567",
        services: ["VAT", "Payroll", "Corp Tax"],
        status: "Active",
        health: "Good",
    },
    {
        id: "CLT-002",
        name: "Global Tech Solutions",
        contact: "Sarah Williams",
        email: "sarah@globaltech.io",
        phone: "+44 20 8234 5678",
        services: ["Bookkeeping", "Self Assessment"],
        status: "Active",
        health: "Warning",
    },
    {
        id: "CLT-003",
        name: "Stark Industries",
        contact: "Tony Stark",
        email: "tony@stark.com",
        phone: "+44 20 9345 6789",
        services: ["Audit", "Advisory", "Tax"],
        status: "Onboarding",
        health: "Good",
    },
    {
        id: "CLT-004",
        name: "Wayne Enterprises",
        contact: "Bruce Wayne",
        email: "bruce@wayne.com",
        phone: "+44 20 1234 5678",
        services: ["Payroll", "VAT"],
        status: "Active",
        health: "Good",
    },
    {
        id: "CLT-005",
        name: "Nexus Innovations",
        contact: "Jane Doe",
        email: "jane@nexus.com",
        phone: "+44 20 2345 6789",
        services: ["Corp Tax", "Bookkeeping"],
        status: "Inactive",
        health: "Critical",
    },
];

export default function ClientsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Client Directory</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage all accounting firm clients and their active services.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <UserPlus className="h-4 w-4" />
                        Add Client
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Clients", count: 124, icon: Users, color: "text-primary" },
                    { label: "Active", count: 108, icon: CheckCircle2, color: "text-green-500" },
                    { label: "Engagement", count: "94%", icon: Shield, color: "text-blue-500" },
                    { label: "Pending", count: 6, icon: Briefcase, color: "text-amber-500" },
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
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by client name, contact, or service..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="text-muted-foreground font-medium border-b border-border/50 bg-muted/10">
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Key Contact</th>
                                <th className="py-3 px-4">Services</th>
                                <th className="py-3 px-4">Health</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="font-semibold">{client.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono">{client.id}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-foreground">{client.contact}</div>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {client.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                {client.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {client.services.map((s) => (
                                                <span key={s} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${client.health === 'Good' ? 'bg-green-500' :
                                                    client.health === 'Warning' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                }`} />
                                            <span className="text-xs uppercase font-bold tracking-wider">{client.health}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${client.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                client.status === 'Onboarding' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="p-1 rounded hover:bg-muted transition-colors">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </button>
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
