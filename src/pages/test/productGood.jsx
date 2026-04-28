// テスト用のページです。関数の使い方の参考にしてください
import { useState } from 'react';
import { supabase } from '../../spabase';
import { postProductLike } from '../../api/productLike';

function ProductGoodTest() {
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
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

      // 2. 入力された productId と、取得した user_id を使ってAPIを呼び出す
      await postProductLike(productId, user.id);
      
      alert(`Product ID: ${productId} に「いいね」しました！`);
      setProductId(''); // 入力欄をクリア
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>いいね（ProductLike）テスト</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※事前にログインしておく必要があります。<br/>
        ※本来 productId は画面に表示された商品データから自動で渡しますが、テスト用に手入力します。
      </p>

      <form onSubmit={handleLike} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <div>
          <label>いいねする Product ID:</label><br />
          <input 
            type="text" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            required 
            placeholder="例: a1b2c3d4-..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '送信中...' : 'いいねを送信する'}
        </button>
      </form>
    </section>
  );
}

export default ProductGoodTest;
