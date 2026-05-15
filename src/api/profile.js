import { supabase } from '../spabase'
/**
 * プロフィール情報を登録関数
 * user_idはsupabaseの機能で自動的に入るため、引数には入れない
 * @param {string} avatar_url - アイコン画像のURL
 * @param {Int} grade - 学年
 * @param {string} department - 学部
 * @param {Int} graduation_year - 卒業年
 * @param {string} comment - 自己紹介コメント
 * @return {Object} { success, data, error } - 成功フラグ、保存されたプロフィールデータ、エラー情報
 */
export const postProfile = async (avatar_url, grade, department, graduation_year, comment) => {

  try {

    // 現在ログインしているユーザーの情報を取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // ログインしていない場合のエラーハンドリング
    if (userError || !user) {
      throw new Error("ログインユーザーが見つかりません。ログインしてから試してください。");
    }

    const { data, error } = await supabase
      .from('Profile')
      .insert([
        { user_id: user.id, avatar_url: avatar_url, grade: grade, department: department, graduation_year: graduation_year, 
            comment: comment 
        }
      ])
      .select();

    if (error) throw error; //supabase側のエラーをキャッチしてthrowする

    return { success: true, data };  // 成功したらデータを返す

  } catch (error) { 
    console.error('プロフィール保存エラー:', error.message);  // エラーが発生した場合はコンソールにエラーメッセージを表示
    return { success: false, error: error.message };  // エラー情報を返す
  }
};

/**
 * 特定のユーザーIDを指定してプロフィールを取得する関数
 * @param {string} user_id - 取得したいユーザーのUUID
 * @return {Object} { success, data, error }
 */

export const getMyProfile = async (user_id) => {

if (!user_id) {
        console.warn('取得対象のユーザーIDがありません（未ログイン）'); // エラーを防ぐために、user_idがない場合は空の配列を返して処理を終了
        return { success: false, data: null, error: 'No User ID' };
    }

  try {

    const { data, error } = await supabase
      .from('Profile')
      .select('*')          // すべてのカラムを取得
      .eq('user_id', user_id) // user_idが引数のuser_idと一致するものを探す
      .single();        

    if (error) throw error;

   console.log('プロフィールの取得に成功:', data);
    return { success: true, data };

  } catch (error) {

    console.error('プロフィール取得に失敗:', error.message);
    return { success: false, data: null, error: error.message };

  }
};