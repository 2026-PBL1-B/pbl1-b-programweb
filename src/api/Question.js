import { supabase } from '../spabase'
import { getCurrentUserId } from './Signin'

// 「通信待ち（時間のかかる処理）」
/**
 * 質問一覧をSupabaseから取得する関数
 * @returns データベースのすべて
*/
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
  return data;
  }
}

/**
 * SupabaseのQuestionテーブルに新しい質問を投稿する関数
 * user_idはspabaseの機能で自動的に入るため、引数には入れない
 * @param {*} title 質問のタイトル
 * @param {*} content 質問の内容
 * @param {*} is_public 公開フラグ(falseで非公開)
 * @param {*} is_finish 終了フラグ(trueで完了)
 * @return {Object|null} 追加された質問のデータ。エラーがあればnullを返す。これによりすぐに追加された質問のIDなどを知ることができる。(タグ付けなどの続きの処理がしやすくなる)
 */
export async function postQuestion(title, content, is_public, is_finish) {
  const { data, error } = await supabase
    .from('Question')
    .insert([
      { title: title, content: content, is_public: is_public, is_finish: is_finish },
    ])
    .select();

  if (error) {
    console.error('質問の追加に失敗:', error.message);
    return null;
  } else {
    console.log('質問が追加に成功:', data);
    return data[0];
  }
}

/**
 * 【データ取得】ログイン中のユーザーが投稿した質問（Questionテーブル）を取得する関数
 */
export async function getMyQuestions() {
    // 1. まず「誰がログインしているか」のIDを取得（上記の関数を再利用）
    const user_id = await getCurrentUserId();

    // IDが取得できなかった（未ログイン）場合は、空の配列を返して処理を終了
    if (!user_id) {
        console.warn('取得対象のユーザーIDがありません（未ログイン）');
        return [];
    }

    // 2. Supabaseの 'Question' テーブルからデータを取ってくる
    const { data, error } = await supabase
        .from('Question')              // 'Question' という名前のテーブルを指定
        .select('title, id, updated_at')    // 取得したいカラムを指定（title と id と updated_at）
        .eq('user_id', user_id);       // 条件：user_idカラムの値が、自分のIDと一致するもの

    // データベース操作に失敗した場合（テーブル名ミスや権限エラーなど）
    if (error) {
        console.error('質問の取得に失敗:', error.message);
        return [];
    }

    // 3. 取得したデータをコンソールに表示（デベロッパーツールのConsoleタブで見れる）
    console.log('質問の取得に成功しました。データの中身:', data);
    
    return data; // 最終的に取得した配列を返す
}