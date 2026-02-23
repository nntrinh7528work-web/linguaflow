import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trang chủ — LinguaFlow",
    description: "Tổng quan hoạt động học tập của bạn.",
};

/**
 * Dashboard home page — placeholder for Step 5+.
 * Will include: greeting, today's schedule, study streak heatmap,
 * daily review card, quick start button, and stats row.
 */
export default function DashboardPage() {
    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Chào buổi tối 👋</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Hôm nay bạn đã sẵn sàng học chưa?
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Thời gian hôm nay", value: "0 phút", icon: "⏱️" },
                    { label: "Từ vựng tuần này", value: "0 từ", icon: "📚" },
                    { label: "Phiên trong tháng", value: "0 phiên", icon: "🍅" },
                ].map((stat) => (
                    <div key={stat.label} className="card-linear p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Today's schedule */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        📅 Lịch học hôm nay
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Chưa có lịch học nào cho hôm nay. Hãy tạo lịch mới!
                    </p>
                </div>

                {/* Quick start */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        🚀 Bắt đầu nhanh
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Khởi động phiên Pomodoro ngay bây giờ.
                    </p>
                    <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]">
                        Bắt đầu học
                    </button>
                </div>
            </div>

            {/* Streak heatmap placeholder */}
            <div className="mt-6 card-linear p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    🔥 Chuỗi học tập
                </h3>
                <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                    Biểu đồ heatmap sẽ hiển thị ở đây khi có dữ liệu.
                </div>
            </div>
        </div>
    );
}
