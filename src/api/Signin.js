import { supabase } from '../spabase'

/**
 * Supabaseを使ってメールアドレスとパスワードでサインインする関数
 * @param {string} email - ユーザーのメールアドレス
 * @param {string} password - ユーザーのパスワード
 * @returns {Promise<Object|null>} サインインしたユーザー情報またはnull
 */
export async function signInEmailandPassword(email, password) {
    // Supabaseのauth機能を使ってサインインを試みる
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // エラーがあればエラー情報を返す
    if (error) {
        console.error('ログインエラー:', error.message)
        return { user: null, error }
    }

    return { user: data.user, error: null } // 成功
}

/**
 * Spabaseを使って、ログイン中のユーザーidを取得する関数
 * @returns {Promise<string|null>} ログイン中のユーザーIDまたはnull
 */
export async function getCurrentUserId() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error('ユーザー情報の取得エラー:', error.message)
        return null
    }

    return user ? user.id : null // ユーザーが存在すればIDを返し、存在しなければnullを返す
}

/**
 * Googleを使ってサインインする関数
 * Googleからリダイレクトした時に戻ってくる場所が必要
 * 現在spabaseのRedirect URLs に http://localhost:5173/home を登録しているので、そこにリダイレクトされるようにする
 * @param {string} redirectTo - ログイン後のリダイレクト先URL
 */
export async function signInWithGoogle(redirectTo) {
    // 認証を開始するタイミングで戻り先を教えておく必要がある
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo,
            queryParams: {
                hd: import.meta.env.VITE_DOMAIN_KD_EMAIL , // KDでドメイン制限
            },
        },
    })

    if (error) {
        console.error('Googleログインエラー:', error.message)
        return { data: null, error }
    }

    return { data, error: null }
}