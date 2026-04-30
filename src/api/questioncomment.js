import { supabase } from '../spabase'

/**
 * 質問投稿に対してコメントを追加する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {string} question_id - コメントを追加する質問のID
 * @param {string} content - コメントの内容
 */
export async function postQuestionComment(question_id, content){
    const { data, error } = await supabase
    .from('QuestionComment')
    .insert([
      { question_id: question_id, content: content },
    ]);

  if (error) {
    console.error('コメントの追加に失敗:', error.message);
  } else {
    console.log('コメントが追加に成功:', data);
  }
}

/**
 * 特定の質問に対するコメント一覧を取得する
 * @param {string} question_id - 対象の質問ID
 * @return コメントの配列。エラーがあれば空配列を返す。
 */

export async function getCommentsOnly(question_id) {
  if (!question_id) return [];

  try {
    const { data, error } = await supabase
      .from('QuestionComment')
      .select('*')
      .eq('question_id', question_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('コメントの取得に失敗:', error.message);
      return [];
    }

    console.log('コメントの取得に成功:', data);
    return data || [];
  } catch (err) {
    console.error('予期せぬエラー:', err);
    return [];
  }
}