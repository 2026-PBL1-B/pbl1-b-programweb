import { supabase } from '../spabase'

/**
 * SpabaseのProductLikeテーブルに新しいいいね情報を追加する関数
 * @param {string} product_id いいねを追加する制作物のID
 * @param {string} user_id いいねを追加するユーザーのID
 */

export async function postProductLike(product_id, user_id) {
  const { data, error } = await supabase
    .from('ProductLike')
    .insert([
      { product_id: product_id, user_id: user_id },
    ]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
  } else {
    console.log('いいねが追加に成功:', data);
  }
}