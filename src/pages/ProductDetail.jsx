import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { supabase } from '../spabase';
import "../css/DetailPage.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postProductComment, getProductComment } from '../api/productcomment';
import { postProductLike, deleteProductLike, getProductLike, getMyProductLike } from '../api/productLike';
import LikeButton from '../components/LikeButton';
import { getProductTagNames } from '../api/Tag';

import { getUserName } from '../api/User'; 
import { grades } from '../domain/GradeDepartment';

import Guideheader from '../components/Header.jsx';
import UserLink from '../components/UserLink';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); 
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [tags, setTags] = useState([]); 
  const [userName, setUserName] = useState('');

  const fetchComments = useCallback(async () => {
    const data = await getProductComment(id);
    setComments(data || []);
  }, [id]);

  useEffect(() => {
    const initData = async () => {
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
      } else if (data) {
        setProduct(data);
        if (data.user_id) {
          const name = await getUserName(data.user_id);
          setUserName(name || '不明なユーザー');
        }
      }

      await fetchComments();

      const { count } = await getProductLike(id);
      setLikeCount(count);
      const isLiked = await getMyProductLike(id);
      setLiked(isLiked);

      const tagNames = await getProductTagNames(id);
      setTags(tagNames || []);
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
  let gradeLabel = '';
  if (product.grade) {
    const foundGrade = grades.find(g => g.value === String(product.grade));
    gradeLabel = foundGrade.label; 
  }

  return (
    <section className="page-container">
      {/* Guideheaderは独立させて一番上に配置します */}
      <Guideheader />
      {/* ヘッダー部分 */}
      {/* <div className="page-header">
        <h1 className="header-title">制作物詳細ページ</h1>
      </div> */}

      {/* コンテンツレイアウト部分 */}
      <div className="content-layout">
        <div className="main-column">
          
          {/* 詳細情報のカード */}
          <div className="detail-card">
            
            <div className="like-button-container">
              <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>
              {/* 1行目: ユーザーネーム */}
              <div>投稿者: <UserLink userId={product.user_id} userName={userName} /></div>
              
              {/* 2行目: 学科・学年（こちらは横並び） */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.department && <span>{product.department}</span>}
                {gradeLabel && <span>{gradeLabel}</span>}
              </div>

              {/* 制作物タイトル */}
              <h2 className="post-title">{product.title}</h2>
            </div>

            <div className="tag-list">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="item-content">タグはありません</p>
              )}
            </div>

            <div>
              <p className="section-label">制作物内容</p>
              <div className="post-content markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {product.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* コメントエリア */}
          <div className="comment-section">
            <DetailCommentPost onSubmit={handleCommentSubmit} />
            {/* コメント一覧を表示する場合はコメントアウトを外してください */}
            <DetailCommentGet comments={comments} />
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetail;