// テスト用のページです。関数の使い方の参考にしてください
import { useState } from 'react';
import { supabase } from '../../spabase';
import { 
  postProductCommentLike, 
  deleteProductCommentLike, 
  getProductCommentLike 
} from '../../api/productcommentLike';

function ProductCommentLikeTest() {
  const [productCommentId, setProductCommentId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleLike = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('ログインユーザーが取得できませんでした。先にログインしてください。');
        setLoading(false);
        return;
      }

      const data = await postProductCommentLike(productCommentId);
      setResult({ type: 'success', action: 'post', data });
      alert(`Product Comment ID: ${productCommentId} に「いいね」しました！`);
    } catch (error) {
      alert(`エラーが発生しました: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLike = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('ログインユーザーが取得できませんでした。先にログインしてください。');
        setLoading(false);
        return;
      }

      const data = await deleteProductCommentLike(productCommentId);
      setResult({ type: 'success', action: 'delete', data });
      alert(`Product Comment ID: ${productCommentId} の「いいね」を削除しました！`);
    } catch (error) {
      alert(`エラーが発生しました: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLike = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = await getProductCommentLike(productCommentId, userId || undefined);
      setResult({ type: 'success', action: 'get', data });
    } catch (error) {
      alert(`エラーが発生しました: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>制作物コメントいいね（ProductCommentLike）テスト</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※事前にログインしておく必要があります。<br/>
        ※本来 product_comment_id は画面に表示されたコメントデータから自動で渡しますが、テスト用に手入力します。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <div>
          <label>対象の Product Comment ID (必須):</label><br />
          <input 
            type="text" 
            value={productCommentId} 
            onChange={(e) => setProductCommentId(e.target.value)} 
            placeholder="例: a1b2c3d4-..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>特定のユーザーID (GETで絞り込む場合のみ任意):</label><br />
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            placeholder="例: user-uuid-..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={handleLike} disabled={loading || !productCommentId} style={{ padding: '10px', cursor: 'pointer', flex: 1 }}>
            いいねを送信
          </button>
          <button onClick={handleDeleteLike} disabled={loading || !productCommentId} style={{ padding: '10px', cursor: 'pointer', flex: 1 }}>
            いいねを削除
          </button>
          <button onClick={handleGetLike} disabled={loading || !productCommentId} style={{ padding: '10px', cursor: 'pointer', flex: 1 }}>
            いいねを取得
          </button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', color: '#333' }}>
          <h3>実行結果 ({result.action})</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

export default ProductCommentLikeTest;