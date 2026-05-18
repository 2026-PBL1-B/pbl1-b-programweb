import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/ProductDetail.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postProductComment, getProductComment } from '../api/productcomment';
import { postProductLike, deleteProductLike, getProductLike, getMyProductLike } from '../api/productLike';



function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); // コメントのstateを追加
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // コメント一覧を取得する関数（useCallbackで最適化）
  const fetchComments = useCallback(async () => {
    const data = await getProductComment(id);
    setComments(data || []);
  }, [id]);

  useEffect(() => {
    const initData = async () => {
      // 1. 制作物の詳細を取得
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

      // 2. コメント一覧を取得
      await fetchComments();

      // いいね情報を取得
      const { count } = await getProductLike(id); // いいねの数を取得
      setLikeCount(count);
      const isLiked = await getMyProductLike(id); // 自分がいいねしているかどうかを取得
      setLiked(isLiked);
    };

    initData();
  }, [id, fetchComments]);

  if (!product) return <p>読み込み中...</p>;

  // いいねボタンが押された時の処理
  const handleLikeToggle = async () => {
    // 楽観的UI更新
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);  // いいねの数も更新

    // いいねの状態をサーバーに反映
    try {
      if (previousLiked) {
        await deleteProductLike(id);
      } else {
        await postProductLike(id);
      }
    } catch (error) {
      // 失敗した場合は元に戻す
      console.error('いいねの処理に失敗:', error);
      setLiked(previousLiked);
      setLikeCount(previousCount);
      alert("いいねの処理に失敗しました");
    }
  };

  // コメント送信時の処理
  const handleCommentSubmit = async (content) => {
    const { error } = await postProductComment(id, content);

    // コメント投稿の結果に応じてアラートを表示
    if (error) {
      console.error('コメントの投稿に失敗:', error.message);
      alert('コメントの投稿に失敗しました。');
    } else {
      alert('コメントが投稿されました！');
      fetchComments(); // 投稿成功時にコメント一覧を再取得する
    }
  };
  
  return (
    <div className="detail-container">
      {/* ヘッダー */}
      <header className="header">
        <h1 className="site-title">詳細ページ</h1>

        <div className="user-icon">
          <div className="icon-circle"></div>
        </div>
      </header>

    {/* いいねボタン */}
      <div className="like-button-container">
        <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
      </div>

      {/* 投稿カード */}
      <div className="post-card">
        {/* 投稿者（まだDBにないなら仮） */}
        <p className="user-name">@user</p>

        {/* タイトル */}
        <h2 className="post-title">{product.title}</h2>

        {/* タグ（まだDBに無いなら一旦空でOK） */}
        <div className="tag-list">
          {/* 後でタグ機能追加したらここに表示 */}
        </div>

        {/* 本文 */}
        <div className="post-content">
          {product.content}

        </div>
      </div>
      
      {/* コメントフォーム */}
      <DetailCommentPost onSubmit={handleCommentSubmit} />

      {/* コメント一覧 */}
      <DetailCommentGet comments={comments} />
    </div>
  );
}


export default ProductDetail;