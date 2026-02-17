"use client";

import React from "react";
import {
    MessageSquare,
    Clock,
    AlertTriangle,
    TrendingUp,
    Users,
    FileText,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Bell,
    CheckCircle2,
    Briefcase,
    Plus,
    Filter,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    ComposedChart,
    Line,
    Legend,
} from "recharts";

// Data for charts
const enquiriesData = [
    { day: "01 Feb", count: 12 },
    { day: "05 Feb", count: 18 },
    { day: "10 Feb", count: 15 },
    { day: "15 Feb", count: 22 },
    { day: "20 Feb", count: 30 },
    { day: "25 Feb", count: 28 },
    { day: "28 Feb", count: 35 },
];

const serviceDistribution = [
    { name: "VAT", value: 35, color: "#3b82f6" },
    { name: "Payroll", value: 25, color: "#6366f1" },
    { name: "Self-assessment", value: 20, color: "#8b5cf6" },
    { name: "Corp Tax", value: 15, color: "#a855f7" },
    { name: "Bookkeeping", value: 5, color: "#d946ef" },
];

const conversionData = [
    { month: "Sep", responseTime: 3.2, conversion: 6.5 },
    { month: "Oct", responseTime: 2.8, conversion: 7.2 },
    { month: "Nov", responseTime: 2.5, conversion: 7.8 },
    { month: "Dec", responseTime: 2.1, conversion: 8.1 },
    { month: "Jan", responseTime: 1.9, conversion: 8.3 },
    { month: "Feb", responseTime: 1.8, conversion: 8.4 },
];

const lateSubmissions = [
    { client: "Acme Corp", missing: "VAT Q4", frequency: "3 times", status: "High Risk" },
    { client: "Global Tech", missing: "Payroll Jan", frequency: "2 times", status: "Warning" },
    { client: "Stark Ind", missing: "Corp Tax 2023", frequency: "4 times", status: "Critical" },
    { client: "Wayne Ent", missing: "Self-assessment", frequency: "2 times", status: "Warning" },
];

const commonQuestions = [
    { question: "How to upload VAT receipts?", category: "Documents", frequency: 45 },
    { question: "When is my next deadline?", category: "Deadlines", frequency: 38 },
    { question: "How to export payroll reports?", category: "Reports", frequency: 32 },
    { question: "Update business address?", category: "Settings", frequency: 28 },
];

const nearMissDeadlines = [
    { task: "VAT Return Submission", client: "Acme Corp", due: "In 2 days", urgency: "critical" },
    { task: "Payroll Processing", client: "Global Tech", due: "In 3 hours", urgency: "high" },
    { task: "Self Assessment Form", client: "John Doe", due: "Tomorrow", urgency: "high" },
];

// Law Firm Data
const lawEnquiriesData = [
    { day: "Mon", family: 5, divorce: 3, immigration: 6, criminal: 2 },
    { day: "Tue", family: 8, divorce: 5, immigration: 7, criminal: 4 },
    { day: "Wed", family: 6, divorce: 4, immigration: 8, criminal: 3 },
    { day: "Thu", family: 10, divorce: 7, immigration: 12, criminal: 6 },
    { day: "Fri", family: 9, divorce: 6, immigration: 10, criminal: 5 },
    { day: "Sat", family: 4, divorce: 2, immigration: 5, criminal: 2 },
    { day: "Sun", family: 3, divorce: 1, immigration: 4, criminal: 1 },
];

const practiceAreas = [
    { name: "Family", value: 30, color: "#8b5cf6" },
    { name: "Conveyancing", value: 25, color: "#6366f1" },
    { name: "Litigation", value: 25, color: "#3b82f6" },
    { name: "Immigration", value: 20, color: "#2dd4bf" },
];

const staffWorkload = [
    { solicitor: "Sarah J.", cases: 24 },
    { solicitor: "Mark T.", cases: 18 },
    { solicitor: "Elena R.", cases: 21 },
    { solicitor: "David W.", cases: 15 },
    { solicitor: "James L.", cases: 12 },
];

const missedResponses = [
    { client: "John Smith", type: "Family Law", delayedBy: "4h 12m", priority: "High" },
    { client: "Alice Brown", type: "Conveyancing", delayedBy: "6h 45m", priority: "Medium" },
    { client: "Robert Wilson", type: "Litigation", delayedBy: "2h 30m", priority: "Urgent" },
];

const urgentEscalations = [
    { id: "ESC-102", client: "Tech Corp", reason: "Court Filing Issue", status: "Active" },
    { id: "ESC-105", client: "Family Estate", reason: "Document Breach", status: "Review" },
    { id: "ESC-109", client: "Visa App", reason: "Deadline Miss", status: "Critical" },
];

const legalFAQs = [
    { question: "What are your conveyancing fees?", category: "Fees", count: 82 },
    { question: "How long does a divorce take?", category: "Family", count: 64 },
    { question: "Can I appeal a court decision?", category: "Litigation", count: 45 },
];

export default function DashboardPage() {
    const [category, setCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem("portal_category");
        setCategory(stored);
    }, []);

    if (category === "law-firm") {
        return (
            <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Law Firm Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Practice analytics and legal engagement overview.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                            <Plus className="h-4 w-4" />
                            New Case
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: "Total Enquiries", value: "284", change: "+14%", trend: "up", icon: MessageSquare },
                        { label: "% Converted", value: "32%", change: "+2.5%", trend: "up", icon: TrendingUp },
                        { label: "Avg Response Time", value: "2.4h", change: "-10%", trend: "up", icon: Clock },
                        { label: "Escalations", value: "15", change: "Action required", trend: "down", icon: AlertTriangle },
                        { label: "Missed Responses", value: "8", change: "Last 24h", trend: "down", icon: Activity },
                        { label: "Active Cases", value: "1,240", change: "+5%", trend: "up", icon: Briefcase },
                    ].map((kpi) => (
                        <div key={kpi.label} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <kpi.icon className="h-4 w-4" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                    kpi.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}>
                                    {kpi.change}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{kpi.label}</p>
                                <h3 className="text-xl font-bold tracking-tight">{kpi.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enquiry Trends */}
                    <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-foreground/90">Enquiry Trends</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Distribution of legal enquiries over the past week.</p>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lawEnquiriesData}>
                                    <defs>
                                        <linearGradient id="colorFamily" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDivorce" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorImmigration" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCriminal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                                    <Area type="monotone" dataKey="family" name="Family" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFamily)" />
                                    <Area type="monotone" dataKey="divorce" name="Divorce" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDivorce)" />
                                    <Area type="monotone" dataKey="immigration" name="Immigration" stroke="#2dd4bf" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImmigration)" />
                                    <Area type="monotone" dataKey="criminal" name="Criminal" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCriminal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Staff Workload */}
                    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground/90 mb-6">Staff Workload</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={staffWorkload} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="solicitor" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }} width={80} />
                                    <Bar dataKey="cases" radius={[0, 4, 4, 0]} barSize={16} fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Practice Area Distribution */}
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-foreground/90">Practice Area Distribution</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Breakdown of active cases by legal specialization.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {practiceAreas.map((area) => (
                            <div key={area.name} className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/30 border border-border/20 space-y-2">
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${area.value}%`, backgroundColor: area.color }} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-semibold">{area.name}</span>
                                    <span className="text-sm font-bold">{area.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Missed Responses */}
                    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground/90 mb-6">Missed Responses</h3>
                        <div className="space-y-4">
                            {missedResponses.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                    <div>
                                        <p className="text-sm font-bold">{item.client}</p>
                                        <p className="text-xs text-muted-foreground">{item.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-orange-600">{item.delayedBy}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{item.priority}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Urgent Escalations */}
                    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground/90 mb-6">Urgent Escalations</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="text-muted-foreground font-medium border-b border-border/30">
                                        <th className="pb-3 px-1">Case ID</th>
                                        <th className="pb-3 px-1">Reason</th>
                                        <th className="pb-3 px-1 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {urgentEscalations.map((row, i) => (
                                        <tr key={i} className="border-b border-border/10 last:border-0 hover:bg-muted/10 transition-colors">
                                            <td className="py-3 px-1 font-bold text-primary">{row.id}</td>
                                            <td className="py-3 px-1 text-xs">{row.reason}</td>
                                            <td className="py-3 px-1 text-right">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Common Legal Questions */}
                    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground/90 mb-6">Repeat Legal Queries</h3>
                        <div className="space-y-5">
                            {legalFAQs.map((faq, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">{faq.question}</p>
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{faq.category}</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted text-center min-w-[3rem]">
                                        <p className="text-sm font-bold leading-none">{faq.count}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase mt-1">freq</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Real-time overview of accounting operations and client engagement.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        New Entry
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: "Total Enquiries", value: "156", change: "+12%", trend: "up", icon: MessageSquare },
                    { label: "Conversion Rate", value: "8.4%", change: "+1.2%", trend: "up", icon: TrendingUp },
                    { label: "Avg Response Time", value: "1.8h", change: "-15%", trend: "up", icon: Clock },
                    { label: "Upcoming Deadlines", value: "12", change: "Next 7 days", trend: "neutral", icon: FileText },
                    { label: "Late Submissions", value: "3", change: "Requires action", trend: "down", icon: AlertTriangle },
                    { label: "Revenue Opportunities", value: "£45.2k", change: "+8%", trend: "up", icon: Briefcase },
                ].map((kpi) => (
                    <div key={kpi.label} className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <kpi.icon className="h-4 w-4" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                kpi.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}>
                                {kpi.change}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                            <h3 className="text-xl font-bold tracking-tight">{kpi.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enquiries Trend */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Enquiries Over Time</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Daily volume of incoming client enquiries.</p>
                        </div>
                        <Activity className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={enquiriesData}>
                                <defs>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnquiries)" animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution */}
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Requested Services</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Top 5 service categories this month.</p>
                        </div>
                    </div>
                    <div className="h-[240px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 11 }} width={100} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {serviceDistribution.map((service) => (
                            <div key={service.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: service.color }} />
                                    {service.name}
                                </div>
                                <span className="font-bold">{service.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dual-axis Chart */}
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold">Performance Matrix</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Response Time(h) vs Conversion Rate(%) correlation.</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={conversionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                            />
                            <Bar yAxisId="right" dataKey="conversion" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} fillOpacity={0.8} />
                            <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="h-3 w-3 rounded-sm bg-blue-500 opacity-80" />
                        Conversion Rate (%)
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="h-0.5 w-4 bg-rose-500" />
                        Response Time (h)
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Late Submissions Table */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Persistent Late Submissions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="text-muted-foreground font-medium border-b border-border/50">
                                    <th className="pb-4 px-2">Client Name</th>
                                    <th className="pb-4 px-2">Missing Item</th>
                                    <th className="pb-4 px-2">Frequency</th>
                                    <th className="pb-4 px-2">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {lateSubmissions.map((row, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-2 font-semibold">{row.client}</td>
                                        <td className="py-4 px-2 text-muted-foreground">{row.missing}</td>
                                        <td className="py-4 px-2 text-muted-foreground">{row.frequency}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${row.status === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                                row.status === 'High Risk' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Common Questions */}
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Common Client Queries</h3>
                    <div className="space-y-5">
                        {commonQuestions.map((q, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-help">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{q.question}</p>
                                    <p className="text-xs text-muted-foreground">{q.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">{q.frequency}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">Ask freq</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg border border-primary/20 transition-all">
                        View Training Dataset
                    </button>
                </div>
            </div>

            {/* Alert Panel */}
            <div className="p-6 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-800/30">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="text-lg font-bold">Near-Miss Deadline Alerts</h3>
                    </div>
                    <span className="text-[11px] font-bold text-orange-600/70 border border-orange-200 px-2 py-0.5 rounded-full uppercase">Action Required</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nearMissDeadlines.map((deadline, i) => (
                        <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-orange-100 dark:border-orange-800/20 shadow-sm flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{deadline.task}</p>
                                <p className="text-xs text-muted-foreground">{deadline.client}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded flex items-center gap-1 ${deadline.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    <Clock className="h-3 w-3" />
                                    {deadline.due}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
