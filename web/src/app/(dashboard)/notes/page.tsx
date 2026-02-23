import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ghi chú — LinguaFlow",
    description: "Quản lý từ vựng, ngữ pháp, và ghi chú tự do.",
};

/**
 * Notes page — placeholder for Step 6.
 * Will include: tab bar (Vocabulary/Grammar/Free Notes),
 * search, filter chips, cards grid, and add forms.
 */
export default function NotesPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">📓 Ghi chú</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Quản lý từ vựng, ngữ pháp, và ghi chú của bạn.
                </p>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
                {["Từ vựng", "Ngữ pháp", "Ghi chú tự do"].map((tab, i) => (
                    <button
                        key={tab}
                        className={`h-8 px-4 rounded-md text-sm font-medium transition-all duration-150 ${i === 0
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm từ vựng..."
                    className="w-full max-w-md h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 mb-6">
                <span className="h-7 px-3 rounded-full badge-japanese text-xs font-medium cursor-pointer">
                    🇯🇵 Tiếng Nhật
                </span>
                <span className="h-7 px-3 rounded-full badge-english text-xs font-medium cursor-pointer">
                    🇬🇧 Tiếng Anh
                </span>
            </div>

            {/* Empty state */}
            <div className="card-linear p-12 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                    Chưa có ghi chú nào
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Bắt đầu thêm từ vựng và ngữ pháp mới.
                </p>
                <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-150 hover:opacity-90">
                    + Thêm ghi chú
                </button>
            </div>
        </div>
    );
}
