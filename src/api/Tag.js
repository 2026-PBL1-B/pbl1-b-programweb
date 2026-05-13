import { supabase } from '../spabase'


/**
 * Tagテーブルから全てのタグを取得する関数
 * id,name,created_atを取得する
 * @return タグの配列。エラーがあれば空配列を返す。
 */
export async function getTags() {

  const { data, error} = await supabase
    .from('Tag')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('タグの取得に失敗:', error.message);
    return [];
  } else {
    console.log('タグの取得に成功:', data);
    return data;
  }
}

/**
 * 複数タグの名前配列を受け取り、TagテーブルのID配列を返す関数
 * 返却されたtagidは、QuestionTagやProductTagテーブルに紐づけるため関数に渡す。
 * 存在しないタグは自動的に新規作成する
 * @param {string[]} tagNames - ['React', 'Next.js', 'Go'] のような配列
 * @return {Promise<string[]|null>} タグIDの配列。エラー時はnull
 */
export async function getOrCreateTags(tagNames) {
  if (!tagNames || tagNames.length === 0) return [];

  // 1. 既存のタグをDB側で検索
  const { data: existingTags, error: selectError } = await supabase
    .from('Tag')
    .select('id, name')
    .in('name', tagNames);

  if (selectError) {
    console.error('タグの検索に失敗:', selectError.message);
    return null;
  }

  // 2. 存在しなかった新しいタグの名前を特定
  const existingNames = existingTags.map(tag => tag.name);
  const newNames = tagNames.filter(name => !existingNames.includes(name));

  let allTags = [...existingTags];

  // 3. 新しいタグがあればまとめてInsert
  if (newNames.length > 0) {
    const newTagsData = newNames.map(name => ({ name: name }));
    const { data: insertedTags, error: insertError } = await supabase
      .from('Tag')
      .insert(newTagsData)
      .select('id, name');

    if (insertError) {
      console.error('新規タグの追加に失敗:', insertError.message);
      return null;
    }
    allTags = [...allTags, ...insertedTags];
  }

  // タグIDの配列を返す
  return allTags.map(tag => tag.id);
}

/**
 * Questionに対してタグを紐づける関数
 * @param {string} questionId - 質問のUUID
 * @param {string[]} tagIds - 紐づけるタグIDの配列
 */
export async function postQuestionTags(questionId, tagIds) {
  if (!tagIds || tagIds.length === 0) return;
  const insertData = tagIds.map(tagId => ({
    question_id: questionId,
    tag_id: tagId
  }));

  const { error } = await supabase
    .from('QuestionTag')
    .insert(insertData);

  if (error) {
    console.error('QuestionTagへの追加に失敗:', error.message);
  } else {
    console.log('タグの紐づけに成功しました。');
  }
}

/**
 * Productに対してタグを紐づける関数
 * @param {string} productId - 制作物のUUID
 * @param {string[]} tagIds - 紐づけるタグIDの配列
 */
export async function postProductTags(productId, tagIds) {
  if (!tagIds || tagIds.length === 0) return;

  const insertData = tagIds.map(tagId => ({
    product_id: productId,
    tag_id: tagId
  }));

  const { error } = await supabase
    .from('ProductTag')
    .insert(insertData);

  if (error) {
    console.error('ProductTagへの追加に失敗:', error.message);
  } else {
    console.log('タグの紐づけに成功しました。');
  }
}

/**
 * 特定の制作物に紐づくタグ名の配列を取得する関数
 * ProductとProductTagの結合クエリを実行
 * @param {string} productId - 制作物のUUID
 * @return タグ名の配列。エラーがあれば空配列を返す。
 */
export async function getProductTagNames(productId) {
  const { data, error } = await supabase
    .from('ProductTag')
    .select('Tag(name)')
    .eq('product_id', productId);

  if (error) {
    console.error('制作物のタグ名の取得に失敗:', error.message);
    return [];
  } else {
    console.log('制作物のタグ名の取得に成功:', data);
    return data.map(item => item.Tag.name);
  }
}

/**
 * 特定の質問に紐づくタグ名の配列を取得する関数
 * QuestionとQuestionTagの結合クエリを実行
 * @param {string} questionId - 質問のUUID
 * @return タグ名の配列。エラーがあれば空配列を返す。
 */
export async function getQuestionTagNames(questionId) {
  const { data, error } = await supabase
    .from('QuestionTag')
    .select('Tag(name)')
    .eq('question_id', questionId);

  if (error) {
    console.error('質問のタグ名の取得に失敗:', error.message);
    return [];
  } else {
    console.log('質問のタグ名の取得に成功:', data);
    return data.map(item => item.Tag.name);
  }
}
