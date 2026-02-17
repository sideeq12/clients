"use client";

import React from "react";
import { Logo } from "./logo";

export function Footer() {
    return (
        <footer className="w-full py-8 px-4 border-t border-border bg-card/50 mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <Logo className="h-8 w-auto" />
                </div>
                <div className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Lovissa Consulting Ltd. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
}
