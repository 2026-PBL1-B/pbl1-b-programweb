import { supabase } from '../spabase'
import { getCurrentUserId } from './Signin';

/**
 * productcommentに対していいねを追加する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {string} product_comment_id いいねを追加するコメントのID
 */
export async function postProductCommentLike(product_comment_id) {
  const { data, error } = await supabase
    .from('ProductCommentLike')
    .insert([ { product_comment_id: product_comment_id },]);

  if (error) {
    console.error('いいねの追加に失敗:', error.message);
    throw error;
  }
  console.log('いいねが追加に成功:', data);
  return data;
}

/**
 * productcommentに対していいねを取り消し(削除)する関数
 * @param {string} product_comment_id いいねを削除するコメントのID
 */
export async function deleteProductCommentLike(product_comment_id) {
    const userId = await getCurrentUserId();

    if (!userId) {
        console.warn('ログインしていないため、いいねを削除できません');
        throw new Error('ログインしていません');
    }

    const { data, error } = await supabase
        .from('ProductCommentLike')
        .delete()
        .eq('product_comment_id', product_comment_id)
        .eq('user_id', userId);

    if (error) {
        console.error('いいねの削除に失敗:', error.message);
        throw error;
    }
    console.log('いいねが削除に成功:', data);
    return data;
}

/**
 * 特定の制作物コメントに対するいいね情報を取得する
 * ログインユーザーや特定のユーザーがそのコメントにいいねしているかも取得することが可能
 * @param {string} product_comment_id - いいね情報を取得したいコメントのID
 * @param {string} [user_id] - オプション: 特定のユーザーのいいね情報を取得したい場合はユーザーIDを指定
 * @returns {Promise<{data: Array, count: number}>} いいね情報の配列とその数を返す。エラーがあれば空配列と0を返す。
 */
export async function getProductCommentLike(product_comment_id, user_id) {
    try {
        let query = supabase
            .from('ProductCommentLike')
            .select('*', { count: 'exact' }) // countを取る設定
            .eq('product_comment_id', product_comment_id);

        // user_idが指定されている場合は、さらにuser_idで絞り込む
        if (user_id) {
            query = query.eq('user_id', user_id);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error('いいね情報の取得に失敗:', error.message);
            return { data: [], count: 0 };
        }

        console.log('いいね情報の取得に成功:', data, 'いいねの数:', count);
        return { data, count };
    }
    catch (error) {
        console.error('いいね情報の取得中にエラーが発生:', error.message);
        return { data: [], count: 0 };
    }
}