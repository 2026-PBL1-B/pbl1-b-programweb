
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductPost.css'; 

//制作物投稿

function ProductPost() {
  const [ProductTitle, setProductTitle] = useState("");
  const [ProductTags, setProductTags] = useState("");
  const [ProductContent, setProductContent] = useState("");
  const [mode, setMode] = useState("edit"); // edit | preview | split

  // タグ配列化（最大5つ）
  const tagList = ProductTags.split(",").slice(0, 5);

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
      </div>
    );
}

export default ProductPost;