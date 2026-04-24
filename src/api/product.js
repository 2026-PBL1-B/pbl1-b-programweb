import { supabase } from '../spabase'


/**
 * SupabaseのProductテーブルに新しい制作物情報を追加する関数
 * @param {string} title 制作物タイトル
 * @param {string} content 制作物本文テキスト
 * @param {boolean} is_public 制作物が公開状態(falseで非公開)
 * @param {boolean} is_finish 制作物が完成状態(trueで完成)
 * @param {string} user_id 制作物を追加するユーザーのID
 */
export async function postProduct(title, content, is_public, is_finish) {
  const { data, error } = await supabase
    .from('Product')
    .insert([
      { title: title, content: content, is_public: is_public, is_finish: is_finish },
    ]);

  if (error) {
    console.error('制作物の追加に失敗:', error.message);
  } else {
    console.log('制作物が追加に成功:', data);
  }
}