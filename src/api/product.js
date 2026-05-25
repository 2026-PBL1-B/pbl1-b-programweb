// spabaseファイルから初期化済みの supabase インスタンスをインポート
import { supabase } from '../spabase'
import { getCurrentUserId } from './Signin'


//supabaseクライアントを作成するために関数を呼び出す
/**
 * 製品一覧をSupabaseから取得する関数
 * @param {string[]} [tagIds] - 絞り込みたいタグIDの配列（任意）
 * @returns データベースのすべて
 */
export const getProducts = async (tagIds) => {
  let query = supabase.from('Product').select('*');

  if (tagIds && tagIds.length > 0) {
    query = supabase
      .from('Product')
      .select(`
        *,
        ProductTag!inner (
          tag_id
        )
      `)
      .in('ProductTag.tag_id', tagIds);
  }

  const { data, error } = await query;

  // エラーが発生した場合はコンソールに表示
  if (error) {
    console.error('Error:', error);
    return [];
  } 
  // 成功した場合は取得した配列データをコンソールに表示
  else {
    console.log('取得データ:', data);
    return data;
  }
}

// ファイルが読み込まれたタイミングで、即座に関数を実行してデータを取得
// fetchProducts()

// ブラウザのデベロッパーツールのコンソールから、直接 `debugFetch()` と打って手動実行できるようにグローバル（window）に登録
// window.debugFetch = fetchProducts;import { supabase } from '../spabase'


/**
 * SupabaseのProductテーブルに新しい制作物情報を追加する関数
 * @param {Object} productData - 制作物データ
 * @param {string} productData.title - 制作物タイトル
 * @param {string} productData.content - 制作物本文テキスト
 * @param {boolean} productData.is_public - 制作物が公開状態(falseで非公開)
 * @param {boolean} productData.is_finish - 制作物が完成状態(trueで完成)
 * @param {number|string|null} productData.grade - 学年
 * @param {string} productData.department - 学科
 * @return {Object|null} 追加された制作物のデータ
 */
export async function postProduct({ title, content, is_public, is_finish, grade, department }) {
  // departmentがnullやundefinedの場合は空文字にする
  const safeDepartment = department ?? '';
  // gradeを数値に変換（nullの場合はnullのままにする）
  const safeGrade = (grade === null || grade === '') ? null : Number(grade);

  const { data, error } = await supabase
    .from('Product')
    .insert([
      { 
        title: title, 
        content: content, 
        is_public: is_public, 
        is_finish: is_finish, 
        grade: safeGrade, 
        department: safeDepartment 
      },
    ])
    .select();

  if (error) {
    console.error('制作物の追加に失敗:', error.message);
    return null;
  } else {
    console.log('制作物が追加に成功:', data);
    return data[0];
  }
}

/**
 * ユーザーが投稿した制作物を取得する関数
 * @returns // そのユーザーが投稿した作品の配列。エラーがあれば空配列を返す。
 */
export async function getMyProducts() {
  // 1. user_id が空っぽの場合のガード（エラーを防ぐ）
  const user_id = await getCurrentUserId();

   // IDが取得できなかった（未ログイン）場合は、空の配列を返して処理を終了
    if (!user_id) {
        console.warn('取得対象のユーザーIDがありません（未ログイン）');
        return [];
    }

  const { data, error } = await supabase
    .from('Product')
    .select('title,id,created_at,is_finish') // 作品のタイトル,ID,作成日時,終了フラグだけを取得する例
    .eq('user_id', user_id);

  if (error) {
    console.error('制作物の取得に失敗:', error.message);
    return []; // エラー時は空配列を返すと画面が壊れにくい
  }
  
  console.log('制作物の取得に成功:', data); // 成功したら、持ってきたデータの中身をコンソールに表示する

  return data;
}

/**
 * 指定ユーザーの制作物を取得する関数
 * @param {string} user_id - 作品を取得したいユーザーのID
 * @returns そのユーザーが投稿した作品の配列。エラーがあれば空配列を返す。
 */
export async function getProductsByUserId(user_id) {
  if (!user_id) {
    console.error('存在しないユーザーです');
    return [];
  }

  const { data, error } = await supabase
    .from('Product')
    .select('title, id, created_at, is_finish') // 作品のタイトル,ID,作成日時,完成フラグだけを取得する例
    .eq('user_id', user_id);

  if (error) {
    console.error('制作物の取得に失敗:', error.message);
    return [];
  } else {
    console.log('制作物の取得に成功:', data);
    return data;
  }
}

// 
/**
 * IDを指定して1件だけ取得する関数
 * @param {string} id 
 * @returns dataとかerror
 */
// export async function getProductById(id) {
//   const { data, error } = await supabase
//     .from('Product')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error) return { success: false, error };
//   return { success: true, data };
// }

/**
 * IDを指定して単一の制作物を取得する関数
 * @param {string} product_id - 取得したい制作物のID
 * @returns 制作物データ。エラーがあればnullを返す。
 */
export async function getProductById(product_id) {
  if (!product_id) {
    console.error('存在しない作品IDです');
    return null;
  }

  const { data, error } = await supabase
    .from('Product')
    .select('*') // 作品の全カラムを取得する例
    .eq('id', product_id)
    .single(); // IDはユニークなので、単一のレコードを期待している場合は single() を使うと便利

  if (error) {
    console.error('制作物の取得に失敗:', error.message);
    return null;
  } else {
    console.log('制作物の取得に成功:', data);
    return data; // 単一の作品データを返す
  }
}