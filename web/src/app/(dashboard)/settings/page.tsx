'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth-actions';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const supabase = createClient();
    const { user, profile, loading: authLoading } = useAuth();

    // Profile
    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Pomodoro
    const [workMin, setWorkMin] = useState(25);
    const [breakMin, setBreakMin] = useState(5);

    // Theme
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // Stats
    const [stats, setStats] = useState({ sessions: 0, vocab: 0, grammar: 0, notes: 0 });

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setWorkMin(profile.pomodoro_work_minutes || 25);
            setBreakMin(profile.pomodoro_break_minutes || 5);
        }
    }, [profile]);

    // Load theme from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (stored) {
            setTheme(stored);
            applyTheme(stored);
        }
    }, []);

    // Fetch stats
    useEffect(() => {
        async function fetchStats() {
            const [s, v, g, n] = await Promise.all([
                supabase.from('study_sessions').select('id', { count: 'exact', head: true }),
                supabase.from('vocabulary_notes').select('id', { count: 'exact', head: true }),
                supabase.from('grammar_notes').select('id', { count: 'exact', head: true }),
                supabase.from('free_notes').select('id', { count: 'exact', head: true }),
            ]);
            setStats({
                sessions: s.count || 0,
                vocab: v.count || 0,
                grammar: g.count || 0,
                notes: n.count || 0,
            });
        }
        fetchStats();
    }, [supabase]);

    // Apply theme
    function applyTheme(t: 'light' | 'dark' | 'system') {
        const root = document.documentElement;
        if (t === 'dark') {
            root.classList.add('dark');
        } else if (t === 'light') {
            root.classList.remove('dark');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
        localStorage.setItem('theme', t);
    }

    function handleThemeChange(t: 'light' | 'dark' | 'system') {
        setTheme(t);
        applyTheme(t);
    }

    // Save profile
    async function handleSaveProfile() {
        if (!user) return;
        setSaving(true);
        setSaved(false);
        await supabase.from('profiles').update({
            full_name: fullName,
            pomodoro_work_minutes: workMin,
            pomodoro_break_minutes: breakMin,
            updated_at: new Date().toISOString(),
        }).eq('id', user.id);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    if (authLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-32 shimmer" />
                {[1, 2, 3].map(i => <div key={i} className="h-32 shimmer rounded-lg" />)}
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Cài đặt</h1>
                <p className="text-sm text-muted-foreground mt-1">Tùy chỉnh ứng dụng theo ý bạn</p>
            </div>

            {/* Profile section */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-linear p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">👤 Hồ sơ</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5">Tên hiển thị</label>
                        <input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Tên của bạn"
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                        <div className="h-10 px-3 rounded-lg border border-input bg-muted flex items-center text-sm text-muted-foreground">
                            {user?.email}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Pomodoro settings */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-linear p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">⏱️ Pomodoro</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Thời gian học (phút)</label>
                        <div className="flex gap-1">
                            {[15, 25, 30, 45, 60].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setWorkMin(m)}
                                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${workMin === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-primary/10'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Thời gian nghỉ (phút)</label>
                        <div className="flex gap-1">
                            {[3, 5, 10, 15].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setBreakMin(m)}
                                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${breakMin === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-primary/10'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Theme */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-linear p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">🎨 Giao diện</h2>
                <div className="flex gap-2">
                    {([
                        { key: 'light' as const, label: '☀️ Sáng', desc: 'Giao diện sáng' },
                        { key: 'dark' as const, label: '🌙 Tối', desc: 'Giao diện tối' },
                        { key: 'system' as const, label: '💻 Hệ thống', desc: 'Theo hệ điều hành' },
                    ]).map((t) => (
                        <button
                            key={t.key}
                            onClick={() => handleThemeChange(t.key)}
                            className={`flex-1 p-3 rounded-lg border text-center transition-all ${theme === t.key
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                    : 'border-border hover:border-primary/30'
                                }`}
                        >
                            <p className="text-sm font-medium text-foreground">{t.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Save button */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Đang lưu...
                        </>
                    ) : saved ? (
                        '✅ Đã lưu!'
                    ) : (
                        '💾 Lưu thay đổi'
                    )}
                </button>
            </motion.div>

            {/* Account stats */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-linear p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">📊 Thống kê tài khoản</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold text-foreground">{stats.sessions}</p>
                        <p className="text-[10px] text-muted-foreground">Phiên học</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold text-foreground">{stats.vocab}</p>
                        <p className="text-[10px] text-muted-foreground">Từ vựng</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold text-foreground">{stats.grammar}</p>
                        <p className="text-[10px] text-muted-foreground">Ngữ pháp</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-xl font-bold text-foreground">{stats.notes}</p>
                        <p className="text-[10px] text-muted-foreground">Ghi chú</p>
                    </div>
                </div>
            </motion.div>

            {/* Account actions */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-linear p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">🔐 Tài khoản</h2>
                <div className="space-y-2">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full text-left px-4 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-3"
                        >
                            🚪 <span>Đăng xuất</span>
                        </button>
                    </form>
                    <p className="text-[10px] text-muted-foreground mt-3 px-1">
                        Phiên bản: LinguaFlow v1.0.0 • Powered by Next.js, Supabase & Gemini AI
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
