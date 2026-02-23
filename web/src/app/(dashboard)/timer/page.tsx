import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pomodoro — LinguaFlow",
    description: "Đồng hồ Pomodoro cho phiên học tập tập trung.",
};

/**
 * Pomodoro Timer page — placeholder for Step 5.
 * Will include: circular progress ring, language selector,
 * topic input, controls, sound notification, and session log.
 */
export default function TimerPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">🍅 Pomodoro Timer</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Tập trung học tập với phương pháp Pomodoro.
                </p>
            </div>

            {/* Timer placeholder */}
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-64 h-64 rounded-full border-8 border-muted flex items-center justify-center mb-8">
                    <span className="text-4xl font-bold text-foreground">25:00</span>
                </div>

                {/* Language toggle */}
                <div className="flex items-center gap-3 mb-6">
                    <button className="h-9 px-4 rounded-lg badge-japanese text-sm font-medium">
                        🇯🇵 Tiếng Nhật
                    </button>
                    <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground">
                        🇬🇧 Tiếng Anh
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button className="h-11 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-150 hover:opacity-90">
                        Bắt đầu
                    </button>
                    <button className="h-11 px-6 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted">
                        Đặt lại
                    </button>
                </div>
            </div>

            {/* Session log */}
            <div className="card-linear p-5 mt-8">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                    📋 Phiên hôm nay
                </h3>
                <p className="text-sm text-muted-foreground">
                    Chưa có phiên nào được hoàn thành hôm nay.
                </p>
            </div>
        </div>
    );
}
