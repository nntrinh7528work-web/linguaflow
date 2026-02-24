'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimer, getLanguageLabel } from '@/lib/utils';

type Phase = 'idle' | 'work' | 'break';
type Language = 'japanese' | 'english';

interface SessionLog {
    id: string;
    language: string;
    topic: string | null;
    pomodoro_count: number;
    started_at: string;
    ended_at: string;
}

export default function TimerPage() {
    const { profile } = useAuth();
    const supabase = createClient();

    // Timer settings
    const workMinutes = profile?.pomodoro_work_minutes || 25;
    const breakMinutes = profile?.pomodoro_break_minutes || 5;

    // Timer state
    const [seconds, setSeconds] = useState(workMinutes * 60);
    const [phase, setPhase] = useState<Phase>('idle');
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState<Language>('japanese');
    const [topic, setTopic] = useState('');
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
    const [recentSessions, setRecentSessions] = useState<SessionLog[]>([]);

    // Fetch recent sessions
    useEffect(() => {
        async function fetchSessions() {
            const { data } = await supabase
                .from('study_sessions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            if (data) setRecentSessions(data as SessionLog[]);
        }
        fetchSessions();
    }, [supabase, pomodoroCount]);

    // Timer tick
    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    // Phase done
                    if (phase === 'work') {
                        setPomodoroCount((c) => c + 1);
                        setPhase('break');
                        // Notification
                        if (Notification.permission === 'granted') {
                            new Notification('🍅 Pomodoro hoàn tất!', {
                                body: `Nghỉ ngơi ${breakMinutes} phút!`,
                            });
                        }
                        return breakMinutes * 60;
                    } else {
                        setPhase('work');
                        if (Notification.permission === 'granted') {
                            new Notification('⏱️ Hết giờ nghỉ!', { body: 'Tiếp tục học thôi! 💪' });
                        }
                        return workMinutes * 60;
                    }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, phase, workMinutes, breakMinutes]);

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    /** Start timer */
    const handleStart = () => {
        if (phase === 'idle') {
            setPhase('work');
            setSeconds(workMinutes * 60);
            setSessionStartedAt(new Date().toISOString());
            setPomodoroCount(0);
        }
        setIsRunning(true);
    };

    /** Pause timer */
    const handlePause = () => setIsRunning(false);

    /** Reset timer */
    const handleReset = () => {
        setIsRunning(false);
        setPhase('idle');
        setSeconds(workMinutes * 60);
        setSessionStartedAt(null);
        setPomodoroCount(0);
    };

    /** Finish session & save to DB */
    const handleFinish = useCallback(async () => {
        if (pomodoroCount > 0 && sessionStartedAt) {
            await supabase.from('study_sessions').insert({
                language,
                topic: topic || null,
                started_at: sessionStartedAt,
                ended_at: new Date().toISOString(),
                pomodoro_count: pomodoroCount,
                status: 'completed',
            });
        }
        handleReset();
        // Refresh sessions list
        const { data } = await supabase
            .from('study_sessions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) setRecentSessions(data as SessionLog[]);
    }, [pomodoroCount, sessionStartedAt, language, topic, supabase]);

    // Calculate progress
    const totalSeconds = phase === 'break' ? breakMinutes * 60 : workMinutes * 60;
    const progress = 1 - seconds / totalSeconds;
    const circumference = 2 * Math.PI * 120; // radius = 120
    const strokeDashoffset = circumference * (1 - progress);

    const langInfo = getLanguageLabel(language);
    const phaseLabel = phase === 'work' ? 'Đang học' : phase === 'break' ? 'Nghỉ ngơi' : 'Sẵn sàng';
    const phaseColor = phase === 'work'
        ? language === 'japanese' ? 'text-indigo-500' : 'text-emerald-500'
        : phase === 'break' ? 'text-amber-500' : 'text-muted-foreground';
    const strokeColor = phase === 'work'
        ? language === 'japanese' ? '#6366f1' : '#10b981'
        : phase === 'break' ? '#f59e0b' : '#6b7280';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Pomodoro Timer</h1>
                <p className="text-sm text-muted-foreground mt-1">Tập trung học với kỹ thuật Pomodoro</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Timer area */}
                <div className="lg:col-span-2">
                    <div className="card-linear p-6">
                        {/* Language toggle */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <button
                                onClick={() => !isRunning && setLanguage('japanese')}
                                disabled={isRunning}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${language === 'japanese'
                                        ? 'badge-japanese shadow-sm'
                                        : 'text-muted-foreground hover:bg-muted'
                                    } disabled:cursor-not-allowed`}
                            >
                                🇯🇵 Tiếng Nhật
                            </button>
                            <button
                                onClick={() => !isRunning && setLanguage('english')}
                                disabled={isRunning}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${language === 'english'
                                        ? 'badge-english shadow-sm'
                                        : 'text-muted-foreground hover:bg-muted'
                                    } disabled:cursor-not-allowed`}
                            >
                                🇬🇧 Tiếng Anh
                            </button>
                        </div>

                        {/* Topic input */}
                        <div className="max-w-xs mx-auto mb-6">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Chủ đề học (tùy chọn)..."
                                disabled={isRunning}
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
                            />
                        </div>

                        {/* Circular timer */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-64 h-64 mb-6">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                                    {/* Background circle */}
                                    <circle
                                        cx="130"
                                        cy="130"
                                        r="120"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        className="text-muted/50"
                                    />
                                    {/* Progress circle */}
                                    <motion.circle
                                        cx="130"
                                        cy="130"
                                        r="120"
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </svg>

                                {/* Time display */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={phase}
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 4 }}
                                            className={`text-xs font-medium uppercase tracking-widest ${phaseColor}`}
                                        >
                                            {phaseLabel}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="text-5xl font-bold text-foreground tracking-tight tabular-nums mt-1">
                                        {formatTimer(seconds)}
                                    </span>
                                    {phase !== 'idle' && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {Array.from({ length: Math.min(pomodoroCount + 1, 8) }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full transition-all ${i < pomodoroCount
                                                            ? 'bg-primary scale-100'
                                                            : 'bg-muted scale-75'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3">
                                {!isRunning ? (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleStart}
                                        className={`px-8 py-3 rounded-xl font-semibold text-sm text-white shadow-lg transition-all ${language === 'japanese'
                                                ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25'
                                                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
                                            }`}
                                    >
                                        {phase === 'idle' ? '▶ Bắt đầu' : '▶ Tiếp tục'}
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handlePause}
                                        className="px-8 py-3 rounded-xl font-semibold text-sm bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600 transition-all"
                                    >
                                        ⏸ Tạm dừng
                                    </motion.button>
                                )}

                                {phase !== 'idle' && (
                                    <>
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                                        >
                                            ↺ Reset
                                        </button>
                                        {pomodoroCount > 0 && (
                                            <button
                                                onClick={handleFinish}
                                                className="px-4 py-3 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-500/10 transition-all"
                                            >
                                                ✓ Kết thúc
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Current session info */}
                            {phase !== 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 text-center"
                                >
                                    <p className="text-xs text-muted-foreground">
                                        {langInfo.emoji} {langInfo.label}
                                        {topic && ` • ${topic}`}
                                        {' • '}{pomodoroCount} 🍅 hoàn thành
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Session log */}
                <div className="space-y-4">
                    {/* Timer settings */}
                    <div className="card-linear p-5">
                        <h3 className="text-sm font-semibold text-foreground mb-3">⚙️ Cài đặt</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Thời gian học</span>
                                <div className="flex items-center gap-1">
                                    {[15, 25, 30, 45].map((m) => (
                                        <button
                                            key={m}
                                            disabled={isRunning}
                                            onClick={() => {
                                                if (!isRunning && phase === 'idle') {
                                                    setSeconds(m * 60);
                                                }
                                            }}
                                            className={`px-2 py-0.5 rounded text-xs font-medium transition-all disabled:cursor-not-allowed ${Math.round(seconds / 60) === m && phase !== 'break'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-primary/10'
                                                }`}
                                        >
                                            {m}m
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent sessions */}
                    <div className="card-linear p-5">
                        <h3 className="text-sm font-semibold text-foreground mb-3">📋 Phiên gần đây</h3>
                        {recentSessions.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-4">
                                Chưa có phiên học nào. Bắt đầu ngay! 🚀
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentSessions.map((session) => {
                                    const lang = getLanguageLabel(session.language as Language);
                                    const startDate = new Date(session.started_at);
                                    const endDate = new Date(session.ended_at);
                                    const durationMin = Math.round(
                                        (endDate.getTime() - startDate.getTime()) / 60000
                                    );
                                    return (
                                        <div
                                            key={session.id}
                                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                                        >
                                            <span className="text-sm">{lang.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-foreground truncate">
                                                    {session.topic || lang.label}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {startDate.toLocaleDateString('vi-VN')} • {durationMin} phút • {session.pomodoro_count} 🍅
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
