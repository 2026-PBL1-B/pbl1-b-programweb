import { supabase } from '../spabase'
// 「通信待ち（時間のかかる処理）」
export async function getQuestions() {

  // Supabaseから返事が来るまで次の行に行かずに待機する命令
  const { data, error } = await supabase
    .from('Question')
    .select('*');

  // 通信に失敗したりテーブル名が間違っていたりしてエラーが出た場合
  if (error) {
    // コンソールに赤文字でエラー内容を表示する
    console.error('get question failed:', error.message);

  } else {
    // 成功したら、持ってきたデータの中身をコンソールに表示する
    console.log('取得した質問:', data);
  }
}