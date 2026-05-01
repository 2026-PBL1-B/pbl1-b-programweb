import { supabase } from '../spabase';

/**
 * 特定の質問投稿に対するいいね情報を取得する
 * @param {string} question_id - いいね情報を取得したい質問のID
 * @param {string} [user_id] - オプション: 特定のユーザーのいいね情報を取得したい場合はユーザーIDを指定
 * @returns {Promise<{data: Array, count: number}>} いいね情報の配列とその数を返す。エラーがあれば空配列と0を返す。
 */
export async function getQuestionsLike(question_id, user_id) {
  try {
    let query = supabase
      .from('QuestionLike')
      .select('*', { count: 'exact' }) // countを取る設定
      .eq('question_id', question_id);

      // user_idが指定されている場合は、さらにuser_idで絞り込む
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('いいね情報の取得に失敗:', error.message);
      return { data: [], count: 0 };
    }

    console.log(`取得成功: ${count}件`, data);
    return { data, count };

  } catch (err) {
    console.error('予期せぬエラーが発生しました:', err);
    return { data: [], count: 0 };
  }
}