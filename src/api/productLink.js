import { supabase } from '../spabase'

/**
 * 制作物投稿で入力されたURLをProductLinkテーブルに保存する関数
 * リンクはテキストの配列で受け取る
 * @parm {string}  product_id - URLを紐づける制作物のID
 * @param {Array<string>} links - 保存したいURLの配列
 * @return {Array<Object>|null} 挿入されたURLのデータの配列。エラーがあればnullを返す。
 */
export async function postProductLinks(product_id, links) {
  if (!product_id) {
    console.error('URLを紐づける制作物のIDがありません');
    return null;
  }

  if (!Array.isArray(links) || links.length === 0) {
    console.warn('保存するURLがありません');
    return null;
  }

  // 配列の各URLをProductLinkテーブルに挿入するためのデータ構造に変換
  const linkData = links.map(link => ({
    product_id,
    url: link
  }));

  const { data, error } = await supabase
    .from('ProductLink')
    .insert(linkData) // 配列で複数のURLを一括挿入
    .select(); // 挿入後のデータを取得するためにselect()を呼び出す

  if (error) {
    console.error('URLの保存に失敗:', error.message);
    return null;
  } else {
    console.log('URLの保存に成功:', data);
    return data; // 挿入されたURLのデータを返す
  }
}

/**
 * 指定された制作物IDに紐づくURLをProductLinkテーブルから取得する関数
 * @parm {string} product_id - URLを取得したい制作物のID
 * @return {Array<string>} その制作物に紐づくURLの配列。エラーがあれば空配列を返す。
 */
export async function getProductLinks(product_id) {
  if (!product_id) {
    console.error('URLを取得する制作物のIDがありません');
    return [];
  }

  const { data, error } = await supabase
    .from('ProductLink')
    .select('url') // URLだけを取得する
    .eq('product_id', product_id); // 指定された制作物IDに紐づくURLを取得

    if (error) {
    console.error('URLの取得に失敗:', error.message);
    return [];
  } else {
    console.log('URLの取得に成功:', data);
    return data.map(item => item.url); // URLの配列を返す
  }
}