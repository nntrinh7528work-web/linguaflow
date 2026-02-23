import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cài đặt — LinguaFlow",
    description: "Tùy chỉnh hồ sơ, Pomodoro, Telegram, và API keys.",
};

/**
 * Settings page — placeholder for Step 10+.
 * Will include: profile, pomodoro config, Telegram bot setup,
 * notifications, theme, API keys, and data management.
 */
export default function SettingsPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">⚙️ Cài đặt</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Tùy chỉnh ứng dụng theo nhu cầu của bạn.
                </p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Profile */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">👤 Hồ sơ</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Họ và tên</label>
                            <input
                                type="text"
                                placeholder="Tên của bạn"
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                    </div>
                </div>

                {/* Pomodoro */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">🍅 Pomodoro</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Thời gian làm việc (phút)</label>
                            <input
                                type="number"
                                defaultValue={25}
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Thời gian nghỉ (phút)</label>
                            <input
                                type="number"
                                defaultValue={5}
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                    </div>
                </div>

                {/* Telegram */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">📱 Telegram Bot</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                        Kết nối với Telegram để nhận nhắc nhở học tập.
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Bot Token</label>
                            <input
                                type="password"
                                placeholder="Nhập bot token từ @BotFather"
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Chat ID</label>
                            <input
                                type="text"
                                placeholder="Nhập chat ID của bạn"
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-150">
                            Kiểm tra kết nối
                        </button>
                    </div>
                </div>

                {/* Theme */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">🎨 Giao diện</h3>
                    <div className="flex items-center gap-3">
                        {["Sáng", "Tối", "Hệ thống"].map((theme, i) => (
                            <button
                                key={theme}
                                className={`h-9 px-4 rounded-lg text-sm font-medium transition-all duration-150 ${i === 0
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Keys */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">🔑 API Keys</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">OpenAI API Key</label>
                            <input
                                type="password"
                                placeholder="sk-..."
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Gemini API Key</label>
                            <input
                                type="password"
                                placeholder="AI..."
                                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                    </div>
                </div>

                {/* Data */}
                <div className="card-linear p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">💾 Dữ liệu</h3>
                    <div className="flex items-center gap-3">
                        <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-150">
                            Xuất JSON
                        </button>
                        <button className="h-9 px-4 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-all duration-150">
                            Xóa tất cả dữ liệu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
