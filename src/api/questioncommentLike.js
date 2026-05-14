import { supabase } from '../spabase'
import { getCurrentUserId } from './Signin';

/**
 * questioncommentに対していいねを追加する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {string} question_comment_id いいねを追加するコメントのID
 */
export async function postQuestionCommentLike(question_comment_id) {
  const { data, error } = await supabase
    .from('QuestionCommentLike')
    .insert([ { question_comment_id: question_comment_id },]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
    throw error;
  }
  console.log('いいねが追加に成功:', data);
  return data;
}

/**
 * questioncommentに対していいねを取り消し(削除)する関数
 * @param {string} question_comment_id いいねを削除するコメントのID
 */
export async function deleteQuestionCommentLike(question_comment_id) {
    const userId = await getCurrentUserId();
    
    if (!userId) {
        console.warn('ログインしていないため、いいねを削除できません');
        throw new Error('ログインしていません');
    }

    const { data, error } = await supabase
        .from('QuestionCommentLike')
        .delete()
        .eq('question_comment_id', question_comment_id)
        .eq('user_id', userId);

    if (error) {
        console.error('いいねの削除に失敗:', error.message);
        throw error;
    }
    console.log('いいねが削除に成功:', data);
    return data;
}

