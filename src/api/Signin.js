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

    // エラーがあればコンソールに出力してnullを返す
    if (error) {
        console.error('ログインエラー:', error.message)
        return null
    }

    return data.user // サインインに成功したユーザー情報を返す
}