import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng ký — LinguaFlow",
    description: "Tạo tài khoản LinguaFlow mới để bắt đầu học.",
};

/**
 * Register page — placeholder for Step 3 (Auth screens).
 */
export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">L</span>
                    </div>
                    <h1 className="text-xl font-bold text-foreground">LinguaFlow</h1>
                </div>

                {/* Card */}
                <div className="card-linear p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Đăng ký</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Tạo tài khoản để bắt đầu hành trình học ngôn ngữ.
                    </p>

                    {/* Placeholder form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Họ và tên</label>
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                            />
                        </div>
                        <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]">
                            Đăng ký
                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{" "}
                        <a href="/login" className="text-primary font-medium hover:underline">
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
