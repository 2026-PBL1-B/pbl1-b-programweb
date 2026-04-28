import { supabase } from '../spabase'
/**
 * SpabaseのProductLikeテーブルに新しいいいね情報を追加する関数
 * @param {string} product_id いいねを追加する制作物のID
 * @param {string} user_id いいねを追加するユーザーのID
 */

export async function postProductLike(product_id, user_id) {
  const { data, error } = await supabase
    .from('ProductLike')
    .insert([ { product_id: product_id, user_id: user_id },]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
  } else {
    console.log('いいねが追加に成功:', data);
  }
}

/**
 * SupabaseのProductLikeテーブルからすべてのいいね情報を取得する関数
 */

export async function getProductLike() {

  // .from('ProductLike') : いいねを保存しているテーブルを指定
  // .select('*') : 全てのカラムを取得
  const { data, error } = await supabase
    .from('ProductLike')
    .select('*');

  if (error) {

    console.error('いいね情報の取得に失敗:', error.message);
    return null;

  } else {

    console.log('いいね情報一覧:', data);
    return data;

  }
}

// 動作確認用（実行）
//getProductLike();