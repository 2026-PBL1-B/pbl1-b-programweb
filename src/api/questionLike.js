import { supabase } from '../spabase';
import { getCurrentUserId } from './Signin';


/**
 * 質問投稿にいいねを追加する
 * usr_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {string} question_id - いいねを追加する質問のID
 * @returns {Promise<Array>} 追加されたいいねのデータ
 */
export async function postQuestionLike(question_id) {
  const { data, error } = await supabase
    .from('QuestionLike')
    .insert([ { question_id: question_id },]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
    throw error;
  }
  console.log('いいねが追加に成功:', data);
  return data;
}

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

/**
 * 自分の質問投稿に対するいいねを削除(取り消し)する関数
 * @param {string} question_id いいねを削除する質問のID
 * @returns {Promise<void>} 成功すればvoid、失敗すればエラーを投げる
 */
export async function deleteQuestionLike(question_id) {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    console.warn('ログインしていないため、いいねを削除できません');
    throw new Error('ログインしていません');
  }

  const { data, error } = await supabase
    .from('QuestionLike')
    .delete()
    .eq('question_id', question_id)
    .eq('user_id', userId);

  if (error) {
    console.error('いいねの削除に失敗:', error.message);
    throw error;
  }
  console.log('いいねが削除に成功:', data);
}

/**
 * 自分の質問投稿に対するいいね情報を取得する関数
 * @param {string} question_id - いいね情報を取得したい質問のID
 * @returns {Promise<boolean>} 自分がいいねしていればtrue、そうでなければfalse。エラーがあればfalseを返す。
 */
export async function getMyQuestionLike(question_id) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('ユーザーがログインしていません');
      return false;
    }

    const { data, error } = await supabase
      .from('QuestionLike')
      .select('*')
      .eq('question_id', question_id)
      .eq('user_id', userId)
      .single(); // 自分のいいねは1件しかないはずなのでsingle()で取得

    if (error) {
      if (error.code === 'PGRST116') { // データが見つからない場合のエラーコード
        console.log('自分のいいねは見つかりませんでした');
        return false; // いいねしていない状態
      }
      console.error('自分のいいね情報の取得に失敗:', error.message);
      return false;
    }

    console.log('自分のいいね情報の取得に成功:', data);
    return !!data; // データが存在すればtrue、存在しなければfalse

  } catch (err) {
    console.error('予期せぬエラーが発生しました:', err);
    return false;
  }
}