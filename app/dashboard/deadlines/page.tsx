"use client";

import React from "react";
import {
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    CalendarDays,
    ArrowRight,
    Search,
    Filter,
} from "lucide-react";

const accountingDeadlines = [
    { id: "DL-001", task: "VAT Q4 Submission", client: "Acme Corp Ltd", type: "VAT", dueDate: "2024-02-29", priority: "Critical", status: "Action Required" },
    { id: "DL-002", task: "Payroll Jan processing", client: "Global Tech Solutions", type: "PAYE", dueDate: "2024-02-19", priority: "High", status: "In Progress" },
];

const lawDeadlines = [
    { id: "DL-L01", task: "Court Hearing: Smith vs Smith", client: "John Smith", type: "COURT", dueDate: "2024-02-25", priority: "Critical", status: "Action Required" },
    { id: "DL-L02", task: "Filing Deadline: Conveyance Box", client: "Alice Brown", type: "FILE", dueDate: "2024-02-22", priority: "High", status: "In Progress" },
    { id: "DL-L03", task: "Mediation Session", client: "Robert Wilson", type: "MEET", dueDate: "2024-03-05", priority: "Medium", status: "Scheduled" },
];

export default function DeadlinesPage() {
    const [category, setCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem("portal_category");
        setCategory(stored);
    }, []);

    const data = category === "law-firm" ? lawDeadlines : accountingDeadlines;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {category === "law-firm" ? "Legal Deadlines" : "Accounting Deadlines"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {category === "law-firm" ? "Monitor court dates and critical legal filing deadlines." : "Monitor and manage critical filing dates for your accounting clients."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Calendar View
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Clock className="h-4 w-4" />
                        Set Reminder
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Overdue", count: 2, icon: AlertTriangle, color: "text-red-500" },
                    { label: "Next 7 Days", count: 8, icon: CalendarDays, color: "text-amber-500" },
                    { label: "Action Needed", count: 12, icon: Clock, color: "text-blue-500" },
                    { label: "Completed", count: 89, icon: CheckCircle2, color: "text-green-500" },
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

            <div className="rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20">
                    <h2 className="font-bold text-lg text-foreground/80">Upcoming Schedule</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Filter by client..."
                                className="pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                            />
                        </div>
                        <button className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="p-2">
                    <div className="space-y-1">
                        {data.map((dl) => (
                            <div key={dl.id} className="group p-4 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${dl.type === 'COURT' ? 'bg-red-100 text-red-700' :
                                            dl.type === 'FILE' ? 'bg-blue-100 text-blue-700' :
                                                dl.type === 'MEET' ? 'bg-green-100 text-green-700' :
                                                    dl.type === 'VAT' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                        }`}>
                                        {dl.type}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm">{dl.task}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <span>{dl.client}</span>
                                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                            <span className="font-mono">{dl.id}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</p>
                                        <p className={`text-sm font-bold ${dl.priority === 'Critical' ? 'text-red-500' :
                                            dl.priority === 'High' ? 'text-amber-500' :
                                                'text-foreground/80'
                                            }`}>{dl.dueDate}</p>
                                    </div>
                                    <div className="min-w-[120px] text-right">
                                        <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${dl.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                                            dl.status === 'Action Required' ? 'bg-orange-500/10 text-orange-500' :
                                                dl.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-green-500/10 text-green-500'
                                            }`}>
                                            {dl.status}
                                        </span>
                                    </div>
                                    <button className="hidden md:flex p-2 rounded-full opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground transition-all active:scale-90">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
