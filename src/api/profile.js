import { supabase } from '../spabase'

/**
 * 特定のユーザーIDを指定してプロフィールを取得する関数
 * @param {string} user_id - 取得したいユーザーのUUID
 * @return {Object} { success, data, error }
 */

export const getProfileForUserID = async (user_id) => {

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

/**
 * プロフィール情報を保存・更新する関数 (Upsert)
 * プロフィールが存在しない場合は新規作成、存在する場合は更新します。
 * updateProfile({ grade: 2, comment: "test" }) のようにすると、更新したい項目だけを引数に渡せます。
 * 
 * @param {string} [avatar_url] - アイコン画像のURL
 * @param {Int} [grade] - 学年
 * @param {string} [department] - 学部
 * @param {Int} [graduation_year] - 卒業年
 * @param {string} [comment] - 自己紹介コメント
 * @return {Promise<Object>} { success, data, error }
 */
export async function updateProfile({ avatar_url, grade, department, graduation_year, comment }) {
  try {
    // 現在ログインしているユーザーの情報を取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // ログインしていない場合のエラーハンドリング
    if (userError || !user) {
      throw new Error("ログインユーザーが見つかりません。ログインしてから試してください。");
    }

    // すでにプロフィールが存在するか確認する
    // maybeSingle() を使うと、データがない場合でもエラーにならず null を返します
    const { data: existingProfile, error: fetchError } = await supabase
      .from('Profile')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`既存プロフィールの確認中にエラーが発生しました: ${fetchError.message}`);
    }

    // 保存するデータの組み立て
    const finalUpdates = {
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    // 既存のプロフィールがあれば、そのidを含める（これによりupsertがUpdateとして機能する）
    if (existingProfile) {
      finalUpdates.id = existingProfile.id;
    }

    // 引数に値が入っているものだけをfinalUpdatesに追加する
    if (avatar_url !== undefined) finalUpdates.avatar_url = avatar_url;
    if (grade !== undefined) finalUpdates.grade = grade;
    if (department !== undefined) finalUpdates.department = department;
    if (graduation_year !== undefined) finalUpdates.graduation_year = graduation_year;
    if (comment !== undefined) finalUpdates.comment = comment;

    // supabaseのupsertメソッドを使用
    const { data, error } = await supabase
      .from('Profile')
      .upsert(finalUpdates)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("プロフィールの保存に失敗しました。");
    }

    return { success: true, data: data[0] };

  } catch (error) { 
    console.error('プロフィール保存・更新エラー:', error.message);
    return { success: false, error: error.message };
  }
}