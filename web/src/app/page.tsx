import Link from "next/link";

/**
 * Landing page — redirects to dashboard or shows welcome screen.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Hero section */}
      <div className="text-center max-w-2xl animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            LinguaFlow
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-2">
          Học ngôn ngữ thông minh
        </p>
        <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
          Hệ thống học tiếng Nhật 🇯🇵 và tiếng Anh 🇬🇧 tích hợp Pomodoro,
          ghi chú AI, và phân tích video.
        </p>

        {/* Language pills */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-japanese text-sm font-medium">
            🇯🇵 Tiếng Nhật
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-english text-sm font-medium">
            🇬🇧 Tiếng Anh
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-11 px-8 rounded-lg border border-border bg-card text-foreground font-medium text-sm transition-all duration-150 hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
          >
            Đăng ký
          </Link>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            { icon: "🍅", label: "Pomodoro", desc: "Quản lý thời gian học" },
            { icon: "📓", label: "Ghi chú", desc: "Từ vựng & ngữ pháp" },
            { icon: "🤖", label: "AI Review", desc: "Ôn tập với GPT-4o" },
            { icon: "🎬", label: "Video", desc: "Phân tích video YouTube" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="card-linear p-4 text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-sm font-medium text-foreground">
                {feature.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-xs text-muted-foreground">
        © 2026 LinguaFlow — Được xây dựng với ❤️ cho người học ngôn ngữ
      </footer>
    </div>
  );
}
