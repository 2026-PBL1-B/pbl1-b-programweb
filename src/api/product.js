// spabaseファイルから初期化済みの supabase インスタンスをインポート
import { supabase } from '../spabase'


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
 * gradeとdepartmentのデータ整形はこちらで行う
 * @param {string} title 制作物タイトル
 * @param {string} content 制作物本文テキスト
 * @param {boolean} is_public 制作物が公開状態(falseで非公開)
 * @param {boolean} is_finish 制作物が完成状態(trueで完成)
 * @param {int|null} grade 学年 null許容
 * @param {string} department 学科 無しは空文字で表現(nullは不可)
 * @return {Object|null} 追加された制作物のデータ。エラーがあればnullを返す。これによりすぐに追加された制作物のIDなどを知ることができる。(タグ付けなどの続きの処理がしやすくなる)
 */
export async function postProduct(title, content, is_public, is_finish, grade, department) {
  // departmentがnullやundefinedの場合は空文字にする
  const safeDepartment = department ?? '';
  // gradeを数値に変換（nullの場合はnullのままにする）
  const safeGrade = (grade === null || grade === '') ? null : Number(grade);

  const { data, error } = await supabase
    .from('Product')
    .insert([
      { title: title, content: content, is_public: is_public, is_finish: is_finish, grade: safeGrade, department: safeDepartment },
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
 * @param {*} user_id // 作品を取得したいユーザーのID
 * @returns // そのユーザーが投稿した作品の配列。エラーがあれば空配列を返す。
 */
export async function getMyProducts(user_id) {
  // 1. user_id が空っぽの場合のガード（エラーを防ぐ）
  if (!user_id) {
    console.error('存在しないユーザーです');
    return [];
  }

  const { data, error } = await supabase
    .from('Product')
    .select('title,id,created_at') // 作品のタイトル,ID,作成日時だけを取得する例
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