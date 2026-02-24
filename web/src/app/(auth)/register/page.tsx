'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signup, loginWithGoogle } from '@/lib/auth-actions';
import { motion } from 'framer-motion';

/**
 * Register page — full_name, email, password + Google OAuth.
 */
export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /** Handle form submission */
    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        // Client-side validation
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            setLoading(false);
            return;
        }

        const result = await signup(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    /** Handle Google signup */
    async function handleGoogleSignup() {
        setLoading(true);
        setError(null);
        const result = await loginWithGoogle();
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
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

                {/* Card */}
                <div className="card-linear p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Đăng ký</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Tạo tài khoản để bắt đầu hành trình học ngôn ngữ.
                    </p>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full h-10 rounded-lg border border-border bg-card text-foreground font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 hover:bg-muted hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-5"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Đăng ký với Google
                    </button>

                    {/* Divider */}
                    <div className="relative mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-card px-3 text-muted-foreground">hoặc</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1.5">
                                Họ và tên
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                placeholder="Nguyễn Văn A"
                                disabled={loading}
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                disabled={loading}
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Ít nhất 6 ký tự"
                                disabled={loading}
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground mb-1.5">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Nhập lại mật khẩu"
                                disabled={loading}
                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-primary font-medium hover:underline transition-colors">
                            Đăng nhập
                        </Link>
                    </div>
                </div>

                {/* Language showcase */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-japanese text-xs font-medium">
                        🇯🇵 Tiếng Nhật
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-english text-xs font-medium">
                        🇬🇧 Tiếng Anh
                    </span>
                </div>

                {/* Footer */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của chúng tôi.
                </p>
            </motion.div>
        </div>
    );
}
