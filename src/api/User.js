import { supabase } from '../spabase'

/**
 * UserIDを元にユーザーネームを取得する関数
 * @param {string} user_id - ユーザーID
 * @returns {Promise<string|null>} ユーザーネーム。エラーがあればnullを返す。
 */
export async function getUserName(user_id) {
  const { data, error } = await supabase
    .from('User')
    .select('name')
    .eq('id', user_id)
    .single();

  if (error) {
    console.error('ユーザーネームの取得に失敗:', error.message);
    return null;
  }

  return data.name;
}