// テスト用のページです。関数の使い方の参考にしてください

import { useState } from 'react';
import { postProduct } from '../../api/product';
import { getOrCreateTags, postProductTags } from '../../api/Tag';

function PostProductTest() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API関数を呼び出す（user_idはSupabase側で自動付与される前提）
      // idが入力されている場合は含める（更新処理になる）
      const payload = { 
        title, 
        content, 
        is_public: isPublic, 
        is_finish: isFinish, 
        grade, 
        department 
      };
      if (id.trim()) {
        payload.id = id.trim();
      }

      const newProduct = await postProduct(payload);
      
      if (newProduct && tagsInput.trim()) {
        const tagNames = tagsInput.split(',').map(t => t.trim()).filter(t => t);
        const tagIds = await getOrCreateTags(tagNames);
        if (tagIds && tagIds.length > 0) {
          await postProductTags(newProduct.id, tagIds);
        }
      }

      alert(payload.id ? '更新とタグの紐付けが完了しました！' : '投稿とタグの紐付けが完了しました！コンソールを確認してください。');
      // 入力欄をクリア
      setId('');
      setTitle('');
      setContent('');
      setGrade('');
      setDepartment('');
      setTagsInput('');
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>制作物投稿テスト</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>ID (任意・更新用):</label><br />
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            placeholder="更新したい場合はIDを入力"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>タイトル:</label><br />
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>本文:</label><br />
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            rows="4"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>学年 (空欄可):</label><br />
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="例: 1"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>学科:</label><br />
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="例: 情報工学科"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>タグ (カンマ区切り):</label><br />
          <input 
            type="text" 
            value={tagsInput} 
            onChange={(e) => setTagsInput(e.target.value)} 
            placeholder="例: React, JavaScript"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            /> 公開する
          </label>
        </div>

        <div>
          <label>
            <input 
              type="checkbox" 
              checked={isFinish} 
              onChange={(e) => setIsFinish(e.target.checked)} 
            /> 完成済み
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </section>
  );
}

export default PostProductTest;
