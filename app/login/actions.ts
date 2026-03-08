'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        return { error: signInError.message }
    }

    if (!user) {
        return { error: "Authentication failed. No user found." }
    }

    // Fetch profile to get firm category
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('category')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { error: "Profile not found. Please contact support." }
    }

    const cookieStore = await cookies()
    cookieStore.set('portal_category', profile.category || 'accounting', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const cookieStore = await cookies()
    cookieStore.delete('portal_category')

    revalidatePath('/', 'layout')
    redirect('/login')
}
