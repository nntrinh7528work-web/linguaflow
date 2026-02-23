"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Sidebar navigation items */
const navItems = [
    { href: "/", icon: "🏠", label: "Trang chủ" },
    { href: "/timer", icon: "🍅", label: "Pomodoro" },
    { href: "/notes", icon: "📓", label: "Ghi chú" },
    { href: "/schedule", icon: "📅", label: "Lịch học" },
    { href: "/review", icon: "🔁", label: "Ôn tập AI" },
    { href: "/video", icon: "🎬", label: "Video" },
    { href: "/settings", icon: "⚙️", label: "Cài đặt" },
];

/**
 * Dashboard layout with fixed left sidebar.
 * Sidebar collapses to 64px on toggle and is responsive.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-200 ease-out",
                    collapsed ? "w-16" : "w-[220px]"
                )}
            >
                {/* Logo */}
                <div className="h-14 flex items-center gap-3 px-4 border-b border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">L</span>
                    </div>
                    {!collapsed && (
                        <span className="text-sm font-semibold text-foreground animate-fade-in">
                            LinguaFlow
                        </span>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                {!collapsed && (
                                    <span className="animate-fade-in">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <div className="p-2 border-t border-border">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
                        aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                    >
                        <span className="text-base">{collapsed ? "→" : "←"}</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main
                className={cn(
                    "flex-1 transition-all duration-200 ease-out",
                    collapsed ? "ml-16" : "ml-[220px]"
                )}
            >
                <div className="max-w-6xl mx-auto px-6 py-6">{children}</div>
            </main>
        </div>
    );
}
