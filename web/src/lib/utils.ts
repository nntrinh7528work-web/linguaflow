import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conflicts and conditional classes gracefully.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date string for display in Vietnamese locale.
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

/**
 * Format time from seconds to MM:SS display.
 */
export function formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format duration in minutes to human-readable Vietnamese string.
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (remainingMins === 0) return `${hours} giờ`;
    return `${hours} giờ ${remainingMins} phút`;
}

/**
 * Get the language display name and emoji.
 */
export function getLanguageLabel(language: 'japanese' | 'english'): { label: string; emoji: string; color: string } {
    return language === 'japanese'
        ? { label: 'Tiếng Nhật', emoji: '🇯🇵', color: 'indigo' }
        : { label: 'Tiếng Anh', emoji: '🇬🇧', color: 'emerald' };
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a greeting based on the current time of day (Vietnamese).
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
}

/**
 * Delay execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
