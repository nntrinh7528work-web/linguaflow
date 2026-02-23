import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ôn tập AI — LinguaFlow",
    description: "Ôn tập với trợ lý AI: tóm tắt, quiz, và hội thoại.",
};

/**
 * AI Review page — placeholder for Step 11.
 * Will include 3 tabs: Summary, Quiz, Conversation.
 */
export default function ReviewPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">🔁 Ôn tập AI</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Ôn tập thông minh với GPT-4o.
                </p>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
                {["📄 Tóm tắt", "🧩 Quiz", "💬 Hội thoại"].map((tab, i) => (
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

            {/* Summary tab content */}
            <div className="card-linear p-8 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                    AI Summary
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    AI sẽ tóm tắt các ghi chú của bạn từ ngày hôm qua.
                </p>
                <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-150 hover:opacity-90">
                    Tạo tóm tắt
                </button>
            </div>
        </div>
    );
}
