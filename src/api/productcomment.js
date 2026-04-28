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

/**
 * ProductCommentテーブルからコメントを取得する関数
 * product_idに基づいてコメントをフィルタリングして取得
 * @param {string} product_id - コメントを取得したい制作物id
 */
export async function getProductComment(product_id) {

  const { data, error} = await supabase
    .from('ProductComment')
    .select('*')
    .eq('product_id', product_id);

  if (error) {
    console.error('コメントの取得に失敗:', error.message);
    return [];
  } else {
    console.log('コメントの取得に成功:', data);
    return data;
  }
}