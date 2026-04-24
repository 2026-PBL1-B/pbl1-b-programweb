// 制作物コメントテストページ

import { useState } from 'react';
import { supabase } from '../../spabase';
import { postProductComment } from '../../api/productcomment';

function ProductCommentTest() {
  const [productId, setProductId] = useState('7e82f1e1-8184-4076-83fb-b4b0869d6d48');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. セッションから現在ログインしているユーザーを取得する
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('ログインユーザーが取得できませんでした。先にログインしてください。');
        setLoading(false);
        return;
      }

      // 2. 入力された productId, comment と、取得した user_id を使ってAPIを呼び出す
      await postProductComment(productId, user.id, comment);
      
      alert(`Product ID: ${productId} にコメントを送信しました！`);
      setComment(''); // コメント入力欄をクリア
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>コメント（ProductComment）テスト</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※事前にログインしておく必要があります。
      </p>

      <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label>コメントする Product ID:</label><br />
          <input 
            type="text" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>コメント内容:</label><br />
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            required 
            rows="4"
            placeholder="ここにコメントを入力..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '送信中...' : 'コメントを送信する'}
        </button>
      </form>
    </section>
  );
}

export default ProductCommentTest;
