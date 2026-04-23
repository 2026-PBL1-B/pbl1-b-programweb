import { supabase } from '../spabase'

/**
 * Supabaseを使ってメールアドレスとパスワードでサインアップする関数
 * @param {string} email - ユーザーのメールアドレス
 * @param {string} password - ユーザーのパスワード
 * @returns {Promise<Object|null>} サインアップしたユーザー情報またはnull
 */
export async function signUpEmailandPassword(email, password) {
    // supabaseで用意されているユーザー登録の関数
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    // エラーがあればコンソールに出力してnullを返す
    if (error) {
        console.error('サインアップエラー:', error.message)
        return null
    }

    return data.user // サインアップに成功したユーザー情報を返す
}
