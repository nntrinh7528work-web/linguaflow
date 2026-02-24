'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth-actions';
import { motion, AnimatePresence } from 'framer-motion';

/** Navigation items */
const navItems = [
    { href: '/timer', label: 'Pomodoro', icon: '⏱️' },
    { href: '/notes', label: 'Ghi chú', icon: '📝' },
    { href: '/schedule', label: 'Lịch học', icon: '📅' },
    { href: '/review', label: 'AI Review', icon: '🤖' },
    { href: '/video', label: 'Video', icon: '🎬' },
    { href: '/settings', label: 'Cài đặt', icon: '⚙️' },
];

/**
 * Dashboard layout — collapsible sidebar with navigation.
 * Shows user profile, logout button, and main content area.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { profile, loading } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-card border-r border-border
          transition-all duration-200 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-56'}
        `}
            >
                {/* Logo */}
                <div className={`flex items-center h-14 px-4 border-b border-border ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">L</span>
                    </div>
                    {!collapsed && (
                        <span className="text-sm font-semibold text-foreground tracking-tight">LinguaFlow</span>
                    )}
                </div>

                {/* User info */}
                {!collapsed && (
                    <div className="px-4 py-3 border-b border-border">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-3 w-24 shimmer" />
                                <div className="h-2 w-16 shimmer" />
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-medium text-foreground truncate">
                                    {profile?.full_name || 'Người dùng'}
                                </p>
                                <p className="text-xs text-muted-foreground">Đang học</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-2 border-t border-border space-y-1">
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
                    >
                        <span className="text-base flex-shrink-0">{collapsed ? '→' : '←'}</span>
                        {!collapsed && <span>Thu gọn</span>}
                    </button>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            type="submit"
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? 'Đăng xuất' : undefined}
                        >
                            <span className="text-base flex-shrink-0">🚪</span>
                            {!collapsed && <span>Đăng xuất</span>}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-card">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">L</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">LinguaFlow</span>
                    </div>
                    <div className="w-8" />
                </header>

                {/* Page content */}
                <div className="p-4 lg:p-6 max-w-5xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
