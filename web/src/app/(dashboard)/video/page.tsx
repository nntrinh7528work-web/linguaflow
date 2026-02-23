import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Video Analyzer — LinguaFlow",
    description: "Phân tích video YouTube với AI Gemini.",
};

/**
 * Video Analyzer page — placeholder for Step 9.
 * Will include: YouTube URL input, analysis button,
 * tabbed results (Summary, Vocabulary, Grammar, Questions, Phrases),
 * and one-click save to notes.
 */
export default function VideoPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">🎬 Phân tích Video</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Phân tích video YouTube để học từ vựng và ngữ pháp.
                </p>
            </div>

            {/* URL input */}
            <div className="card-linear p-6 mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                    URL Video YouTube
                </label>
                <div className="flex gap-3">
                    <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 h-11 px-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                    />
                    <button className="h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-150 hover:opacity-90 whitespace-nowrap">
                        Phân tích
                    </button>
                </div>

                {/* Language selector */}
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs text-muted-foreground">Ngôn ngữ:</span>
                    <button className="h-7 px-3 rounded-full badge-japanese text-xs font-medium">
                        🇯🇵 Tiếng Nhật
                    </button>
                    <button className="h-7 px-3 rounded-full border border-border text-xs font-medium text-muted-foreground">
                        🇬🇧 Tiếng Anh
                    </button>
                </div>
            </div>

            {/* Empty state */}
            <div className="card-linear p-12 text-center">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                    Chưa có phân tích nào
                </h3>
                <p className="text-sm text-muted-foreground">
                    Dán link YouTube ở trên để bắt đầu phân tích với Gemini AI.
                </p>
            </div>
        </div>
    );
}
