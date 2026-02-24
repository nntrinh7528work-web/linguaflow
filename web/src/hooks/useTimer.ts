'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerPhase = 'work' | 'break' | 'idle';
export type TimerLanguage = 'japanese' | 'english';

interface UseTimerOptions {
    workMinutes?: number;
    breakMinutes?: number;
}

interface UseTimerReturn {
    seconds: number;
    phase: TimerPhase;
    isRunning: boolean;
    pomodoroCount: number;
    progress: number;
    formattedTime: string;
    start: () => void;
    pause: () => void;
    reset: () => void;
}

/**
 * Lightweight Pomodoro timer hook.
 * Handles ticking, work/break phase transitions.
 */
export function useTimer({ workMinutes = 25, breakMinutes = 5 }: UseTimerOptions = {}): UseTimerReturn {
    const [seconds, setSeconds] = useState(workMinutes * 60);
    const [phase, setPhase] = useState<TimerPhase>('idle');
    const [isRunning, setIsRunning] = useState(false);
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        if (phase === 'idle') {
            setPhase('work');
            setSeconds(workMinutes * 60);
        }
        setIsRunning(true);
    }, [phase, workMinutes]);

    const pause = useCallback(() => setIsRunning(false), []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setPhase('idle');
        setSeconds(workMinutes * 60);
        setPomodoroCount(0);
    }, [workMinutes]);

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    if (phase === 'work') {
                        setPomodoroCount((c) => c + 1);
                        setPhase('break');
                        return breakMinutes * 60;
                    } else {
                        setPhase('work');
                        return workMinutes * 60;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, phase, workMinutes, breakMinutes]);

    const totalSecs = phase === 'break' ? breakMinutes * 60 : workMinutes * 60;
    const progress = 1 - seconds / totalSecs;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return { seconds, phase, isRunning, pomodoroCount, progress, formattedTime, start, pause, reset };
}
