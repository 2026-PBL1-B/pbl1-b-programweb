import { supabase } from '../spabase'

/**
 * ProductCommentテーブルに新しいコメントを追加する関数
 * @param {string} product_id - コメントを追加する制作物のID
 * @param {string} user_id - コメントを追加するユーザーのID
 * @param {string} content - コメントの内容
 */
export async function postProductComment(product_id, user_id, content) {
  const { data, error } = await supabase
    .from('ProductComment')
    .insert([
      { product_id: product_id, user_id: user_id, content: content },
    ]);

  if (error) {
    console.error('コメントの追加に失敗:', error.message);
  } else {
    console.log('コメントが追加に成功:', data);
  }
}