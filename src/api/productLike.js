import { supabase } from '../spabase';

/**
 * SpabaseのProductLikeテーブルに新しいいいね情報を追加する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {string} product_id いいねを追加する制作物のID
 */
export async function postProductLike(product_id) {
  const { data, error } = await supabase
    .from('ProductLike')
    .insert([ { product_id: product_id },]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
  } else {
    console.log('いいねが追加に成功:', data);
  }
}

/**
 * SpabaseのProductLikeテーブルからいいね情報を削除（取り消し）する関数
 * RLSで自分のみ削除可能に制限しています
 * @param {string} product_id いいねを削除する制作物のID
 */
export async function deleteProductLike(product_id) {
  const { data, error } = await supabase
    .from('ProductLike')
    .delete()
    .eq('product_id', product_id);

  if (error) {
    console.error('いいねの削除に失敗:', error.message);
  } else {
    console.log('いいねが削除に成功:', data);
  }
}

/**
 * 特定の制作物投稿に対するいいね情報を取得する
 * @param {string} product_id - いいね情報を取得したい制作物のID
 * @param {string} [user_id] - オプション: 特定のユーザーのいいね情報を取得したい場合はユーザーIDを指定
 * @returns {Promise<{data: Array, count: number}>} いいね情報の配列とその数を返す。エラーがあれば空配列と0を返す。
 */
export async function getProductLike(product_id, user_id) {
  try {
    let query = supabase
      .from('ProductLike')
      .select('*', { count: 'exact' }) // countを取る設定
      .eq('product_id', product_id);

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
