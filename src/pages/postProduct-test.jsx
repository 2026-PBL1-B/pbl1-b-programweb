// テスト用のページです。関数の使い方の参考にしてください

import { useState } from 'react';
import { postProduct } from '../api/product';

function PostProductTest() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API関数を呼び出す（user_idはSupabase側で自動付与される前提）
      await postProduct(title, content, isPublic, isFinish);
      
      alert('投稿が完了しました！コンソールを確認してください。');
      // 入力欄をクリア
      setTitle('');
      setContent('');
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
