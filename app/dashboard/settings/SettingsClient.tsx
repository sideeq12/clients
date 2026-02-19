"use client";

import React from "react";
import { Settings, User, Shield, CreditCard, Bell, Database } from "lucide-react";
import { Profile, updateProfile } from "@/lib/supabase/data-service";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
    profile: Profile | null;
}

export function SettingsClient({ profile }: SettingsClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState(false);
    const [formData, setFormData] = React.useState({
        full_name: profile?.full_name || "",
        company_name: profile?.company_name || "",
        phone_number: profile?.phone_number || "",
        location: profile?.location || "",
        address: profile?.address || "",
        category: profile?.category || "accounting",
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            router.refresh();
        } catch (error) {
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Portal Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your {profile?.category === 'law-firm' ? 'Law Firm' : 'Accounting'} configurations and user access.</p>
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
                        <h3 className="font-bold border-b border-border/50 pb-2">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                                <div className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground/80">
                                    {formData.full_name || "Not set"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Company Name</label>
                                <div className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground/80">
                                    {formData.company_name || "Not set"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
                                <div className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground/80">
                                    {formData.phone_number || "Not set"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
                                <div className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground/80">
                                    {formData.location || "Not set"}
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Full Address</label>
                                <div className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground/80 min-h-[80px]">
                                    {formData.address || "Not set"}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="font-bold border-b border-border/50 pb-2">Compliance & Data</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                                <div>
                                    <p className="text-sm font-bold">Automation Sync</p>
                                    <p className="text-xs text-muted-foreground">Status updates are automatically synchronized from your firm's database.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase text-green-500">Active</span>
                                    <div className="h-5 w-10 bg-green-500/20 rounded-full relative">
                                        <div className="h-4 w-4 bg-green-500 rounded-full absolute top-0.5 right-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
