import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { supabase } from '../spabase';
//import "../css/ListPage.css";
import "../css/DetailPage.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postProductComment, getProductComment } from '../api/productcomment';
import { postProductLike, deleteProductLike, getProductLike, getMyProductLike } from '../api/productLike';
import LikeButton from '../components/LikeButton';
import { getProductTagNames } from '../api/Tag';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); 
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [tags, setTags] = useState([]); 

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
      } else {
        setProduct(data);
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

  return (
    <section className="page-container">
      {/* ヘッダー部分 */}
      <div className="page-header">
        <h1 className="header-title">制作物詳細ページ</h1>
      </div>

      {/* コンテンツレイアウト部分 */}
      <div className="content-layout">
        <div className="main-column">
          
          {/* 詳細情報のカード */}
          <div className="detail-card">
            
            <div className="like-button-container">
              <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
            </div>

            <div>
              <p className="section-label">制作物タイトル</p>
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
            {/* <DetailCommentGet comments={comments} /> */}
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetail;