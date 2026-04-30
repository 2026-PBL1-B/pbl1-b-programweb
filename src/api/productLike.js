import { supabase } from '../spabase';

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
 * 特定の商品に対するいいね情報を取得する
 * @param {string} product_id - いいね情報を取得したい商品のID
 * @param {string} [user_id] - オプション: 特定のユーザーのいいね情報を取得したい場合はユーザーIDを指定
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
