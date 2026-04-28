import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductPost.css'; 

import { postProduct } from '../api/product'; 

//制作物投稿

function ProductPost() {
  const [ProductTitle, setProductTitle] = useState("");
  const [ProductTags, setProductTags] = useState("");
  const [ProductContent, setProductContent] = useState("");
  const [mode, setMode] = useState("edit"); // edit | preview | split

  // ▼ 追加: 投稿に必要な公開状態、完成状態、ローディングのステート
  const [isPublic, setIsPublic] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [loading, setLoading] = useState(false);

  // タグ配列化（最大5つ）
  const tagList = ProductTags.split(",").slice(0, 5);

  // ▼ 追加: 投稿ボタンを押したときに実行される関数
  const handleSubmit = async () => {
    // 簡単な入力チェック（タイトルと本文がないと投稿できないようにする）
    if (!ProductTitle || !ProductContent) {
      alert("タイトルと本文を入力してください。");
      return;
    }

    setLoading(true); // ボタンを「投稿中...」にする

    try {
      // product.jsの関数を呼び出してデータを送信
      await postProduct(ProductTitle, ProductContent, isPublic, isFinish);
      
      alert('投稿が完了しました！');
      
      // 投稿後に入力欄を空に戻す（必要に応じて削除・変更してください）
      setProductTitle('');
      setProductTags('');
      setProductContent('');
      setIsPublic(true);
      setIsFinish(false);
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      // 成功しても失敗しても、ローディング状態を解除する
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* タイトル */}
      <input
          className="title"
          type="text"
          placeholder="タイトルを入力してください"
          /*定義したファイル名に合わせて */
          value={ProductTitle}
          onChange={(e) => setProductTitle(e.target.value)}
      />

      {/* タグ */}
      <input
          className="tags"
          type="text"
          placeholder="タグを入力してください（最大5つ）"
          value={ProductTags}
          onChange={(e) => setProductTags(e.target.value)}
      />

      {/* 本文ヘッダー */}
      <div className="content-header">
          <h2>本文</h2>
          <div className="mode-buttons">
          <button onClick={() => setMode("edit")}>edit</button>
          <button onClick={() => setMode("split")}>両方</button>
          <button onClick={() => setMode("preview")}>preview</button>
          </div>
      </div>

      {/* 本文エリア */}
      <div className={`content-area ${mode}`}>
          
          {/* 編集 */}
          {(mode === "edit" || mode === "split") && (
          <textarea
              className="editor"
              placeholder="本文を入力"
              value={ProductContent}
              onChange={(e) => setProductContent(e.target.value)}
          />
          )}

          {/* プレビュー */}
          {(mode === "preview" || mode === "split") && (
          <div className="preview">
              <h3>{ProductTitle || "タイトル"}</h3>

              <div className="tag-list">
                  {tagList.map((tag, i) => (
                  <span key={i} className="tag">
                  #{tag}
                  </span>
                  ))}
              </div>

              <p>{ProductContent || "本文がここに表示されます"}</p>
          </div>
          )}
      </div>

      {/* ▼ 追加: 投稿オプション（チェックボックス）と投稿ボタン */}
      <div className="post-options" style={{ marginTop: '20px', padding: '10px 0' }}>
        <label style={{ marginRight: '15px' }}>
          <input 
            type="checkbox" 
            checked={isPublic} 
            onChange={(e) => setIsPublic(e.target.checked)} 
          /> 公開する
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={isFinish} 
            onChange={(e) => setIsFinish(e.target.checked)} 
          /> 完成済み
        </label>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading} // 投稿中はボタンを押せなくする
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? '投稿中...' : '投稿する'}
      </button>

    </div>
  );
}

export default ProductPost;