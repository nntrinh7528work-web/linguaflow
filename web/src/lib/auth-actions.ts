'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * Server action: Đăng nhập bằng email và mật khẩu.
 */
export async function login(formData: FormData) {
    const supabase = await createServerSupabaseClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    // Validate
    if (!data.email || !data.password) {
        return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        // Map common Supabase errors to Vietnamese
        if (error.message.includes('Invalid login credentials')) {
            return { error: 'Email hoặc mật khẩu không đúng.' };
        }
        if (error.message.includes('Email not confirmed')) {
            return { error: 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.' };
        }
        return { error: `Đăng nhập thất bại: ${error.message}` };
    }

    revalidatePath('/', 'layout');
    redirect('/timer');
}

/**
 * Server action: Đăng ký tài khoản mới.
 */
export async function signup(formData: FormData) {
    const supabase = await createServerSupabaseClient();

    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate
    if (!fullName || !email || !password) {
        return { error: 'Vui lòng nhập đầy đủ thông tin.' };
    }

    if (password.length < 6) {
        return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        if (error.message.includes('already registered')) {
            return { error: 'Email này đã được đăng ký.' };
        }
        return { error: `Đăng ký thất bại: ${error.message}` };
    }

    revalidatePath('/', 'layout');
    redirect('/login?registered=true');
}

/**
 * Server action: Đăng xuất.
 */
export async function logout() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}

/**
 * Server action: Đăng nhập bằng Google OAuth.
 */
export async function loginWithGoogle() {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
        },
    });

    if (error) {
        return { error: 'Đăng nhập Google thất bại.' };
    }

    if (data.url) {
        redirect(data.url);
    }
}
