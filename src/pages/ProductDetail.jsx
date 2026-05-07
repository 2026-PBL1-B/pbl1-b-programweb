import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/ProductDetail.css";
import DetailCommentPost from '../components/DetilComment';
import { postProductComment } from '../api/productcomment';


function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [id]);

  if (!product) return <p>読み込み中...</p>;

  // コメント送信時の処理
  const handleCommentSubmit = async (content) => {
    const { error } = await postProductComment(id, content);

    // コメント投稿の結果に応じてアラートを表示
    if (error) {
      console.error('コメントの投稿に失敗:', error.message);
      alert('コメントの投稿に失敗しました。');
    } else {
      alert('コメントが投稿されました！');
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
    </div>
  );
}

{/* いいね機能 */}
function Button() {
  const [liked, setLiked] = useState(false);   // いいね状態
  const [count, setCount] = useState(0);        // いいね数

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setCount(count - 1);  // 取り消し
    } else {
      setLiked(true);
      setCount(count + 1);  // いいね
    }
  };

  return (
    <button
      onClick={handleLike}
      style={{
        backgroundColor: liked ? "#E24A4A" : "#ccc",  // いいね時は赤
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
      }}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}

export default ProductDetail;