'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { formatDate, formatDuration, getGreeting } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
    totalSessions: number;
    totalMinutes: number;
    todaySessions: number;
    todayMinutes: number;
    vocabCount: number;
    grammarCount: number;
    streakDays: number;
}

interface TodaySchedule {
    id: string;
    start_time: string;
    end_time: string;
    language: string;
    topic: string;
    status: string;
}

/** Animation stagger for cards */
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function DashboardPage() {
    const { profile, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalSessions: 0,
        totalMinutes: 0,
        todaySessions: 0,
        todayMinutes: 0,
        vocabCount: 0,
        grammarCount: 0,
        streakDays: 0,
    });
    const [todaySchedules, setTodaySchedules] = useState<TodaySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchDashboardData = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch all data in parallel
            const [sessionsRes, todaySessionsRes, vocabRes, grammarRes, schedulesRes] = await Promise.all([
                supabase.from('study_sessions').select('started_at, ended_at, pomodoro_count', { count: 'exact' }),
                supabase.from('study_sessions').select('started_at, ended_at, pomodoro_count').gte('created_at', `${today}T00:00:00`),
                supabase.from('vocabulary_notes').select('id', { count: 'exact' }),
                supabase.from('grammar_notes').select('id', { count: 'exact' }),
                supabase.from('schedules').select('*').eq('date', today).order('start_time'),
            ]);

            // Calculate total minutes from sessions
            let totalMinutes = 0;
            sessionsRes.data?.forEach((s) => {
                if (s.started_at && s.ended_at) {
                    totalMinutes += (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000;
                } else {
                    totalMinutes += (s.pomodoro_count || 0) * 25;
                }
            });

            let todayMinutes = 0;
            todaySessionsRes.data?.forEach((s) => {
                if (s.started_at && s.ended_at) {
                    todayMinutes += (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000;
                } else {
                    todayMinutes += (s.pomodoro_count || 0) * 25;
                }
            });

            // Calculate streak (simple: count consecutive days with sessions)
            const sessionDates = new Set(
                sessionsRes.data?.map((s) => new Date(s.started_at || s.ended_at || '').toISOString().split('T')[0]) || []
            );
            let streak = 0;
            const d = new Date();
            while (sessionDates.has(d.toISOString().split('T')[0])) {
                streak++;
                d.setDate(d.getDate() - 1);
            }

            setStats({
                totalSessions: sessionsRes.count || 0,
                totalMinutes: Math.round(totalMinutes),
                todaySessions: todaySessionsRes.data?.length || 0,
                todayMinutes: Math.round(todayMinutes),
                vocabCount: vocabRes.count || 0,
                grammarCount: grammarRes.count || 0,
                streakDays: streak,
            });

            setTodaySchedules((schedulesRes.data as TodaySchedule[]) || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        if (!authLoading) {
            fetchDashboardData();
        }
    }, [authLoading, fetchDashboardData]);

    if (authLoading || loading) {
        return <DashboardSkeleton />;
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={item}>
                <h1 className="text-2xl font-bold text-foreground">
                    {getGreeting()}, {profile?.full_name?.split(' ').pop() || 'bạn'} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(new Date())} — Hãy cùng học tốt hôm nay!
                </p>
            </motion.div>

            {/* Quick stats row */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Hôm nay"
                    value={stats.todayMinutes > 0 ? formatDuration(stats.todayMinutes) : '0 phút'}
                    sub={`${stats.todaySessions} phiên`}
                    icon="🔥"
                    accent="from-orange-500/10 to-red-500/10"
                />
                <StatCard
                    label="Tổng thời gian"
                    value={formatDuration(stats.totalMinutes)}
                    sub={`${stats.totalSessions} phiên`}
                    icon="⏱️"
                    accent="from-blue-500/10 to-indigo-500/10"
                />
                <StatCard
                    label="Từ vựng"
                    value={String(stats.vocabCount)}
                    sub={`${stats.grammarCount} ngữ pháp`}
                    icon="📝"
                    accent="from-emerald-500/10 to-teal-500/10"
                />
                <StatCard
                    label="Streak"
                    value={`${stats.streakDays} ngày`}
                    sub="Liên tiếp"
                    icon="🎯"
                    accent="from-purple-500/10 to-pink-500/10"
                />
            </motion.div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Today's schedule */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="card-linear p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                📅 Lịch học hôm nay
                            </h2>
                            <Link
                                href="/schedule"
                                className="text-xs text-primary font-medium hover:underline"
                            >
                                Xem tất cả →
                            </Link>
                        </div>

                        {todaySchedules.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-3xl mb-2">📭</p>
                                <p className="text-sm text-muted-foreground">Chưa có lịch học hôm nay.</p>
                                <Link
                                    href="/schedule"
                                    className="inline-flex items-center gap-1 mt-3 text-xs text-primary font-medium hover:underline"
                                >
                                    + Thêm lịch học
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {todaySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${schedule.status === 'completed'
                                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                                : schedule.status === 'missed'
                                                    ? 'bg-destructive/5 border-destructive/20 opacity-60'
                                                    : 'bg-muted/50 border-border hover:bg-muted'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${schedule.language === 'japanese' ? 'bg-indigo-500' : 'bg-emerald-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {schedule.topic || (schedule.language === 'japanese' ? 'Tiếng Nhật' : 'Tiếng Anh')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {schedule.start_time?.slice(0, 5)} — {schedule.end_time?.slice(0, 5)}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${schedule.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                : schedule.status === 'missed'
                                                    ? 'bg-destructive/10 text-destructive'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {schedule.status === 'completed' ? '✓ Xong' : schedule.status === 'missed' ? 'Bỏ lỡ' : 'Chờ'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div variants={item} className="space-y-4">
                    {/* Quick start */}
                    <div className="card-linear p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            ⚡ Bắt đầu nhanh
                        </h2>
                        <div className="space-y-2">
                            <Link
                                href="/timer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:from-indigo-500/15 hover:to-indigo-500/10 transition-all group"
                            >
                                <span className="text-lg">🇯🇵</span>
                                <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        Học Tiếng Nhật
                                    </p>
                                    <p className="text-xs text-muted-foreground">Pomodoro 25 phút</p>
                                </div>
                            </Link>
                            <Link
                                href="/timer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:from-emerald-500/15 hover:to-emerald-500/10 transition-all group"
                            >
                                <span className="text-lg">🇬🇧</span>
                                <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        Học Tiếng Anh
                                    </p>
                                    <p className="text-xs text-muted-foreground">Pomodoro 25 phút</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent activity hint */}
                    <div className="card-linear p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            📊 Tổng quan
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Từ vựng đã học</span>
                                <span className="text-sm font-semibold text-foreground">{stats.vocabCount}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${Math.min(stats.vocabCount, 100)}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Ngữ pháp đã học</span>
                                <span className="text-sm font-semibold text-foreground">{stats.grammarCount}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                    style={{ width: `${Math.min(stats.grammarCount, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

/** Stat card component */
function StatCard({
    label,
    value,
    sub,
    icon,
    accent,
}: {
    label: string;
    value: string;
    sub: string;
    icon: string;
    accent: string;
}) {
    return (
        <div className={`card-linear p-4 bg-gradient-to-br ${accent}`}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-base">{icon}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
    );
}

/** Loading skeleton */
function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-7 w-48 shimmer mb-2" />
                <div className="h-4 w-32 shimmer" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card-linear p-4">
                        <div className="h-3 w-16 shimmer mb-3" />
                        <div className="h-6 w-20 shimmer mb-1" />
                        <div className="h-3 w-12 shimmer" />
                    </div>
                ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 card-linear p-5">
                    <div className="h-4 w-32 shimmer mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 shimmer rounded-lg" />
                        ))}
                    </div>
                </div>
                <div className="card-linear p-5">
                    <div className="h-4 w-24 shimmer mb-4" />
                    <div className="space-y-3">
                        <div className="h-16 shimmer rounded-lg" />
                        <div className="h-16 shimmer rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
