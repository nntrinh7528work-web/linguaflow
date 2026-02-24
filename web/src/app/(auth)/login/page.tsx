'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login, loginWithGoogle } from '@/lib/auth-actions';
import { motion } from 'framer-motion';

/** Inner login form that uses useSearchParams (needs Suspense) */
function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const authError = searchParams.get('error');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setLoading(true);
        setError(null);
        const result = await loginWithGoogle();
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-xl font-bold text-white">L</span>
                </div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">LinguaFlow</h1>
            </div>

            {registered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400"
                >
                    ✅ Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.
                </motion.div>
            )}

            {authError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    ❌ Đăng nhập thất bại. Vui lòng thử lại.
                </div>
            )}

            <div className="card-linear p-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">Đăng nhập</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Chào mừng bạn trở lại! Đăng nhập để tiếp tục học.
                </p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                    >
                        {error}
                    </motion.div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-10 rounded-lg border border-border bg-card text-foreground font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 hover:bg-muted hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-5"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Đăng nhập với Google
                </button>

                <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-3 text-muted-foreground">hoặc</span>
                    </div>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                            Email
                        </label>
                        <input
                            id="email" name="email" type="email" required
                            placeholder="you@example.com" disabled={loading}
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                            Mật khẩu
                        </label>
                        <input
                            id="password" name="password" type="password" required minLength={6}
                            placeholder="••••••••" disabled={loading}
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </form>

                <div className="mt-5 text-center text-sm text-muted-foreground">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-primary font-medium hover:underline transition-colors">
                        Đăng ký
                    </Link>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng của chúng tôi.
            </p>
        </motion.div>
    );
}

/** Login page with Suspense boundary for useSearchParams */
export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Suspense fallback={
                <div className="w-full max-w-sm text-center text-muted-foreground">Đang tải...</div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
