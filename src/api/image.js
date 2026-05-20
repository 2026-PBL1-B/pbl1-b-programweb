import { supabase } from '../spabase'

/**
 * spabaseのストレージに画像ファイルをアップロードする関数
 * @param {File} file - アップロードする画像ファイル
 * @return {string|null} アップロードされた画像の公開URL。エラーがあればnullを返す。
 */
export async function uploadImage(file){
    if (!file) {
        console.warn('アップロードするファイルがありません');
        return null;
    }

    try {
        // ファイル名をユニークにするためにタイムスタンプとランダム文字列を付与
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        // Supabaseの 'ProductImage' バケットにアップロード
        const { error } = await supabase.storage
            .from('ProductImage')
            .upload(fileName, file);

        if (error) {
            console.error('Supabase upload error:', error.message);
            return null;
        }

        // アップロードしたファイルの公開URLを取得
        const { data: publicUrlData } = supabase.storage
            .from('ProductImage')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;

    } catch (error) {
        console.error('Error in uploadImage:', error);
        return null;
    }
}