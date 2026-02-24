'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Schedule {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    language: string;
    topic: string | null;
    status: string;
    created_at: string;
}

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAYS_FULL = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

/** Get the start of the week (Monday) for a given date */
function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/** Generate 7 days starting from a date */
function getWeekDays(start: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d;
    });
}

/** Format date to YYYY-MM-DD */
function toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

export default function SchedulePage() {
    const supabase = createClient();
    const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
    const [selectedDate, setSelectedDate] = useState(() => toDateStr(new Date()));
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const weekDays = getWeekDays(weekStart);
    const today = toDateStr(new Date());

    // Fetch schedules for the week
    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        const start = toDateStr(weekDays[0]);
        const end = toDateStr(weekDays[6]);
        const { data } = await supabase
            .from('schedules')
            .select('*')
            .gte('date', start)
            .lte('date', end)
            .order('start_time');
        setSchedules((data as Schedule[]) || []);
        setLoading(false);
    }, [supabase, weekStart]);

    useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

    // Navigate weeks
    const prevWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() - 7);
        setWeekStart(d);
    };
    const nextWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + 7);
        setWeekStart(d);
    };
    const goToday = () => {
        setWeekStart(getWeekStart(new Date()));
        setSelectedDate(today);
    };

    // Add schedule
    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        await supabase.from('schedules').insert({
            date: form.get('date'),
            start_time: form.get('start_time'),
            end_time: form.get('end_time'),
            language: form.get('language'),
            topic: form.get('topic') || null,
            status: 'pending',
        });
        setShowForm(false);
        fetchSchedules();
    };

    // Toggle status
    const toggleStatus = async (id: string, current: string) => {
        const next = current === 'pending' ? 'completed' : current === 'completed' ? 'missed' : 'pending';
        await supabase.from('schedules').update({ status: next }).eq('id', id);
        fetchSchedules();
    };

    // Delete schedule
    const handleDelete = async (id: string) => {
        await supabase.from('schedules').delete().eq('id', id);
        fetchSchedules();
    };

    // Group schedules by date
    const schedulesByDate: Record<string, Schedule[]> = {};
    schedules.forEach((s) => {
        if (!schedulesByDate[s.date]) schedulesByDate[s.date] = [];
        schedulesByDate[s.date].push(s);
    });

    // Selected day schedules
    const daySchedules = schedulesByDate[selectedDate] || [];

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Lịch học</h1>
                    <p className="text-sm text-muted-foreground mt-1">Lên kế hoạch học tập hàng tuần</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                >
                    + Thêm lịch
                </motion.button>
            </div>

            {/* Week navigation */}
            <div className="card-linear p-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={prevWeek} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        ← Tuần trước
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                            {weekDays[0].toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })} — {weekDays[6].toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {toDateStr(weekStart) !== toDateStr(getWeekStart(new Date())) && (
                            <button onClick={goToday} className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                Hôm nay
                            </button>
                        )}
                    </div>
                    <button onClick={nextWeek} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        Tuần sau →
                    </button>
                </div>

                {/* Week day selector */}
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => {
                        const dateStr = toDateStr(day);
                        const isToday = dateStr === today;
                        const isSelected = dateStr === selectedDate;
                        const dayScheduleCount = (schedulesByDate[dateStr] || []).length;
                        const hasCompleted = (schedulesByDate[dateStr] || []).some((s) => s.status === 'completed');

                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`relative flex flex-col items-center py-2 rounded-lg transition-all ${isSelected
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : isToday
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                                    {DAYS_VI[day.getDay()]}
                                </span>
                                <span className="text-lg font-bold">{day.getDate()}</span>
                                {/* Dots showing schedules */}
                                <div className="flex gap-0.5 mt-0.5 h-1.5">
                                    {dayScheduleCount > 0 && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground/70' : hasCompleted ? 'bg-emerald-500' : 'bg-primary/50'
                                            }`} />
                                    )}
                                    {dayScheduleCount > 1 && (
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground/50' : 'bg-muted-foreground/30'
                                            }`} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="card-linear p-5 space-y-3 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-foreground">Thêm lịch học mới</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <input name="date" type="date" required defaultValue={selectedDate}
                                className="h-9 px-3 rounded-lg border border-input bg-background text-sm" />
                            <select name="language" required className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
                                <option value="japanese">🇯🇵 Tiếng Nhật</option>
                                <option value="english">🇬🇧 Tiếng Anh</option>
                            </select>
                            <input name="start_time" type="time" required defaultValue="09:00"
                                className="h-9 px-3 rounded-lg border border-input bg-background text-sm" />
                            <input name="end_time" type="time" required defaultValue="10:00"
                                className="h-9 px-3 rounded-lg border border-input bg-background text-sm" />
                        </div>
                        <input name="topic" placeholder="Chủ đề (tùy chọn)"
                            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Lưu</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">Hủy</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Day's schedule list */}
            <div>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    📋 {DAYS_FULL[new Date(selectedDate + 'T00:00:00').getDay()]}, {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
                    <span className="text-xs text-muted-foreground font-normal">({daySchedules.length} lịch)</span>
                </h2>

                {loading ? (
                    <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-16 shimmer rounded-lg" />)}</div>
                ) : daySchedules.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-3xl mb-2">📭</p>
                        <p className="text-sm text-muted-foreground">Không có lịch học ngày này</p>
                        <button onClick={() => setShowForm(true)}
                            className="mt-3 text-xs text-primary font-medium hover:underline"
                        >
                            + Thêm lịch học
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {daySchedules.map((schedule) => (
                            <motion.div
                                key={schedule.id}
                                layout
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-lg border transition-all group ${schedule.status === 'completed'
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : schedule.status === 'missed'
                                            ? 'bg-destructive/5 border-destructive/20 opacity-60'
                                            : 'card-linear hover:shadow-md'
                                    }`}
                            >
                                {/* Status toggle */}
                                <button
                                    onClick={() => toggleStatus(schedule.id, schedule.status)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${schedule.status === 'completed'
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : schedule.status === 'missed'
                                                ? 'border-destructive bg-destructive text-white'
                                                : 'border-border hover:border-primary'
                                        }`}
                                >
                                    {schedule.status === 'completed' && <span className="text-xs">✓</span>}
                                    {schedule.status === 'missed' && <span className="text-xs">✕</span>}
                                </button>

                                {/* Language dot */}
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${schedule.language === 'japanese' ? 'bg-indigo-500' : 'bg-emerald-500'
                                    }`} />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${schedule.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                                        }`}>
                                        {schedule.topic || (schedule.language === 'japanese' ? '🇯🇵 Tiếng Nhật' : '🇬🇧 Tiếng Anh')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {schedule.start_time?.slice(0, 5)} — {schedule.end_time?.slice(0, 5)}
                                    </p>
                                </div>

                                {/* Status badge */}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${schedule.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                        schedule.status === 'missed' ? 'bg-destructive/10 text-destructive' :
                                            'bg-amber-500/10 text-amber-600'
                                    }`}>
                                    {schedule.status === 'completed' ? 'Xong' : schedule.status === 'missed' ? 'Bỏ lỡ' : 'Chờ'}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all text-xs"
                                >
                                    🗑
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Weekly summary */}
            <div className="card-linear p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">📊 Tổng kết tuần</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
                        <p className="text-xs text-muted-foreground">Tổng lịch</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-500">
                            {schedules.filter(s => s.status === 'completed').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Hoàn thành</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-amber-500">
                            {schedules.filter(s => s.status === 'pending').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Đang chờ</p>
                    </div>
                </div>
                {schedules.length > 0 && (
                    <div className="mt-3 w-full h-2 rounded-full bg-muted overflow-hidden flex">
                        <div
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${(schedules.filter(s => s.status === 'completed').length / schedules.length) * 100}%` }}
                        />
                        <div
                            className="h-full bg-destructive transition-all"
                            style={{ width: `${(schedules.filter(s => s.status === 'missed').length / schedules.length) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
