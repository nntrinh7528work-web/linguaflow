import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lịch học — LinguaFlow",
    description: "Quản lý lịch học tập hàng tuần.",
};

/**
 * Schedule page — placeholder for Step 7.
 * Will include: weekly calendar view, session blocks,
 * create/edit modals, and Telegram integration.
 */
export default function SchedulePage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">📅 Lịch học</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Lên lịch và theo dõi phiên học của bạn.
                    </p>
                </div>
                <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-150 hover:opacity-90">
                    + Thêm phiên học
                </button>
            </div>

            {/* Week navigation */}
            <div className="flex items-center justify-between mb-6">
                <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all duration-150">
                    ←
                </button>
                <span className="text-sm font-medium text-foreground">
                    Tuần 24/02 — 02/03/2026
                </span>
                <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all duration-150">
                    →
                </button>
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-2">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <div key={day} className="text-center">
                        <div className="text-xs text-muted-foreground font-medium mb-2">{day}</div>
                        <div className="card-linear p-3 min-h-[120px]">
                            <p className="text-xs text-muted-foreground">Trống</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
