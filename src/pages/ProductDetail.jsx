import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/ProductDetail.css";

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
    </div>
  );
}

export default ProductDetail;