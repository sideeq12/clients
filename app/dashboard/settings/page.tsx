"use client";

import React from "react";
import { Settings, User, Shield, CreditCard, Bell, Database } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Portal Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage Law Firm configurations and user access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border-r border-border/50 pr-6 space-y-1">
                    {[
                        { label: "General", icon: Settings, active: true },
                        { label: "Team Management", icon: User, active: false },
                        { label: "Security & Permissions", icon: Shield, active: false },
                        { label: "Billing & Subscription", icon: CreditCard, active: false },
                        { label: "Notifications", icon: Bell, active: false },
                        { label: "App Integrations", icon: Database, active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h3 className="font-bold border-b border-border/50 pb-2">Firm Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Firm Name</label>
                                <input type="text" defaultValue="Lovissa Legal Ltd" className="w-full p-2 bg-muted border border-border/50 rounded-lg text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Practice Type</label>
                                <input type="text" defaultValue="Full-Service Law Firm" className="w-full p-2 bg-muted border border-border/50 rounded-lg text-sm" />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="font-bold border-b border-border/50 pb-2">Compliance & Data</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                                <div>
                                    <p className="text-sm font-bold">Solicitors Regulation Authority (SRA) Sync</p>
                                    <p className="text-xs text-muted-foreground">Automatically update solicitor status from SRA database.</p>
                                </div>
                                <div className="h-5 w-10 bg-primary/20 rounded-full relative cursor-pointer">
                                    <div className="h-4 w-4 bg-primary rounded-full absolute top-0.5 right-0.5" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pt-4">
                        <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80">Cancel</button>
                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
