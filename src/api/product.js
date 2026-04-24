// spabaseファイルから初期化済みの supabase インスタンスをインポート
import { supabase } from '../spabase'


//supabaseクライアントを作成するために関数を呼び出す
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('Product')
    .select('*')

  // エラーが発生した場合はコンソールに表示
  if (error) {
    console.error('Error:', error)
  } 
  // 成功した場合は取得した配列データをコンソールに表示
  else {
    console.log('取得データ:', data)
  }
}

// ファイルが読み込まれたタイミングで、即座に関数を実行してデータを取得
fetchProducts()

// ブラウザのデベロッパーツールのコンソールから、直接 `debugFetch()` と打って手動実行できるようにグローバル（window）に登録
window.debugFetch = fetchProducts;