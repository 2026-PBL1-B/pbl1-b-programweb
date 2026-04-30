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