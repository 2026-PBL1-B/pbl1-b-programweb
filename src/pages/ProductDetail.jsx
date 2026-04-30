import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/ProductDetail.css";

function ProductDetail() {
  // 仮データ（あとでAPIに置き換え可能）
  // 別途タグやいいね関連を追加予定
  const post = {
    //ユーザー
    user: "@abcdefg12345",
    // タイトル
    title: "投稿タイトル",
    // 本文
    content: "ここに本文が入ります。サンプルテキストです。",
    // タグ
    tags: ["React", "CSS", "JavaScript", "UI", "フロントエンド"]
  };
  
  return (
    <div className="detail-container">
      {/* ヘッダー */}
      <header className="header">
        <h1 className="site-title">タイトル</h1>

        <div className="user-icon">
          <div className="icon-circle"></div>
        </div>
      </header>

      {/* 投稿カード */}
      <div className="post-card">
        {/*投稿者*/}
        <p className="user-name">{post.user}</p>
        {/*タイトル*/}
        <h2 className="post-title">{post.title}</h2>
        {/*投稿タグ */}
        <div className="tag-list">
        {/*投稿タグの数を5つに制限*/}
          {post.tags.slice(0, 5).map((tag, i) => (
            <span key={i} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        {/*本文*/}
        <div className="post-content">
          {post.content}
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;