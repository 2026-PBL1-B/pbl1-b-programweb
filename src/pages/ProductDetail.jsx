// src/pages/ProductDetail.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import "../css/DetailPage.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postProductComment, getProductComment } from '../api/productcomment';
import { postProductLike, deleteProductLike, getProductLike, getMyProductLike } from '../api/productLike';
import LikeButton from '../components/LikeButton';
import { getProductTagNames } from '../api/Tag';

import { getProductLinks } from '../api/productLink';   // URLを取得する関数をインポート
import { getProductById } from '../api/product';

import { getUserName } from '../api/User'; 
import { grades } from '../domain/GradeDepartment';

import Guideheader from '../components/Header.jsx';
import UserLink from '../components/UserLink';
import AvatarIcon from '../components/AvatarIcon';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); 
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [tags, setTags] = useState([]); 
  const [links, setLinks] = useState([]);   // URLリストを管理する状態
  
  const [userName, setUserName] = useState('');

  const fetchComments = useCallback(async () => {
    const data = await getProductComment(id);
    setComments(data || []);
  }, [id]);

  //*spabaseから直接引っ張ってくる形式から変更*//
useEffect(() => {
  const initData = async () => {

    const { success, data } = await getProductById(id);

    if (success && data) {

      setProduct(data);

      if (data.user_id) {
        const name = await getUserName(data.user_id);
        setUserName(name || "不明なユーザー");
      }

      await fetchComments();

      const { count } = await getProductLike(id);
      setLikeCount(count);

      const isLiked = await getMyProductLike(id);
      setLiked(isLiked);

      const tagNames = await getProductTagNames(id);
      setTags(tagNames || []);

      const productUrls = await getProductLinks(id);
      setLinks(productUrls || []);
    }
  };

  initData();

}, [id, fetchComments]);

  const handleLikeToggle = async () => {
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      if (previousLiked) {
        await deleteProductLike(id);
      } else {
        await postProductLike(id);
      }
    } catch (error) {
      console.error('いいねの処理に失敗:', error);
      setLiked(previousLiked);
      setLikeCount(previousCount);
      alert("いいねの処理に失敗しました");
    }
  };

  const handleCommentSubmit = async (content) => {
    const { error } = await postProductComment(id, content);
    if (error) {
      console.error('コメントの投稿に失敗:', error.message);
      alert('コメントの投稿に失敗しました。');
    } else {
      alert('コメントが投稿されました！');
      fetchComments(); 
    }
  };
  
  if (!product) return <p style={{ color: 'var(--text)', padding: '40px' }}>読み込み中...</p>;

  // 学年のラベル変換
  let gradeLabel = '情報なし';
  if (product.grade) {
    const foundGrade = grades.find(g => g.value === String(product.grade));
    if (foundGrade) {
      gradeLabel = foundGrade.label;
    }
  }

  return (
    <section className="page-container">
      {/* Guideheaderは独立させて一番上に配置します */}
      <Guideheader />

      {/* コンテンツレイアウト部分 */}
      <div className="content-layout">
        <div className="main-column">
          
          {/* 詳細情報のカード */}
          <div className="detail-card">
            
            <div className="like-button-container">
              <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>
              {/* 1行目: アイコンとユーザーネーム */}
              <div className="detail-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AvatarIcon userId={product.user_id} />
                  <UserLink userId={product.user_id} userName={userName} prefix="投稿者: " />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 'normal' }}>投稿日: {new Date(product.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              
              {/* 2行目: 学科・学年（こちらは横並び） */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <span>{product.department ? product.department : '学科:情報なし'}</span>
                <span>{product.grade ? gradeLabel : '学年:情報なし'}</span>
              </div>

              {/* 制作物タイトル */}
              <h2 className="post-title">{product.title}</h2>

              {/*  タグ表示 */}
              <div className="tag-list" style={{ marginTop: '12px' }}>
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <span key={index} className="tag-badge">
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="item-content" style={{ margin: 0 }}>タグはありません</p>
                )}
              </div>
            </div>


            {/* 関連リンク（URL）表示セクション */}
            {links && links.length > 0 && (
              <div className="link-section" style={{ marginTop: '10px' }}>
                <p className="section-label" style={{ marginBottom: '8px' }}>関連リンク</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        wordBreak: 'break-all',
                        color: 'var(--accent, #3b82f6)',
                        textDecoration: 'underline',
                        fontSize: '15px'
                      }}
                    >
                      🔗 {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="section-label" style={{ marginTop: '16px' }}>制作物内容</p>
              <div className="post-content markdown-preview">
                <MarkdownRenderer>
                  {product.content}
                </MarkdownRenderer>
              </div>
            </div>
          </div>

          {/* コメントエリア */}
          <div className="comment-section">
            <DetailCommentPost onSubmit={handleCommentSubmit} />
            {/* コメント一覧を表示する場合はコメントアウトを外してください */}
            <DetailCommentGet comments={comments} type="product" />
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetail;