import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LinguaFlow — Đăng nhập',
    description: 'Đăng nhập vào LinguaFlow để tiếp tục hành trình học ngôn ngữ.',
};

/**
 * Auth layout — shared wrapper for login & register pages.
 * No sidebar, minimal layout.
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
