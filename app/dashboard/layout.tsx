import React from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const cookieStore = await cookies();
    const category = (cookieStore.get("portal_category")?.value || "accounting-firm") as 'accounting' | 'law-firm';

    return (
        <DashboardLayoutClient category={category}>
            {children}
        </DashboardLayoutClient>
    );
}
