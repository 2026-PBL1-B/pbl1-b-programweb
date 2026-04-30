import { supabase } from '../spabase'
// 「通信待ち（時間のかかる処理）」
/**
 * 質問一覧をSupabaseから取得する関数
 * @returns データベースのすべて
*/
export async function getQuestions() {
// Supabaseから返事が来るまで次の行に行かずに待機する命令
const { data, error } = await supabase
  .from('Question')
  .select('*');

// 通信に失敗したりテーブル名が間違っていたりしてエラーが出た場合
if (error) {
  // コンソールに赤文字でエラー内容を表示する
  console.error('get question failed:', error.message);
} else {
  // 成功したら、持ってきたデータの中身をコンソールに表示する
  console.log('取得した質問:', data);
  return data;
  }
}

/**
 * SupabaseのQuestionテーブルに新しい質問を投稿する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {*} title 質問のタイトル
 * @param {*} content 質問の内容
 * @param {*} is_public 公開フラグ(falseで非公開)
 * @param {*} is_finish 終了フラグ(trueで完了)
 */
export async function postQuestion(title, content, is_public, is_finish) {
  const { data, error } = await supabase
    .from('Question')
    .insert([
      { title: title, content: content, is_public: is_public, is_finish: is_finish },
    ]);

  if (error) {
    console.error('質問の追加に失敗:', error.message);
  } else {
    console.log('質問が追加に成功:', data);
  }
}