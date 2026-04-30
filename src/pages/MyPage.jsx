// src/pages/MyPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../spabase';
import { getMyProducts } from '../api/product';
import { getProductLike } from '../api/productLike'; 
import "../css/MyPage.css";

function MyPage() {
    const [myArticles, setMyArticles] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMyProducts = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const products = await getMyProducts(user.id);  // プロダクト一覧取得
                    
                    if (products && products.length > 0) {
                        // Promise.allを使って、全記事のいいね数を並列で取得
                        const productsWithLikes = await Promise.all(
                            products.map(async (product) => {
                                // user_idは渡さず、その投稿に対する全体のいいね数を取得する
                                const { count } = await getProductLike(product.id);
                                // 元のデータに likeCount プロパティを追加
                                return { ...product, likeCount: count || 0 };
                            })
                        );
                        setMyArticles(productsWithLikes);
                    } else {
                        setMyArticles([]);
                    }
                }
            } catch (error) {
                console.error('エラー:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMyProducts();
    }, []);

    // 取得したデータをソートする処理
    const sortedArticles = [...myArticles].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section className="mypage-container">
            {/* タイトル部分 */}
            <div className="mypage-header">
                <h1 className="mypage-title">マイページ</h1>
                <p className="mypage-subtitle">あなたの投稿一覧です</p>
            </div>

            {/* ソートボタン */}
            <div className="mypage-controls">
                <button 
                    className="sort-button"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                    {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
                </button>
            </div>

            {/* 投稿一覧表示 */}
            <div className="article-list">
                {isLoading ? (
                    <p className="loading-text">読み込み中...</p>
                ) : sortedArticles.length === 0 ? (
                    <p className="empty-text">まだ投稿がありません。</p>
                ) : (
                    sortedArticles.map((article) => (
                        <div key={article.id} className="article-card">
                            {/* 日付といいねの表示 */}
                            <div className="article-info">
                                <span>{new Date(article.created_at).toLocaleDateString('ja-JP')}</span>
                                {/* いいね数の表示を追加 */}
                                <span className="like-count" style={{ marginLeft: '12px', color: '#e0245e' }}>
                                    ❤️ {article.likeCount}
                                </span>
                            </div>
                            
                            <Link to={`/product/${article.id}`} className="article-link">      
                                <h2 className="article-title">{article.title}</h2>
                            </Link>
                        </div>
                    ))
                )}
            </div>
            
            {/* リンク(デバック用) */}
            <div className="back-link-container">
                <Link to="/productlist" className="back-link">
                    ← 投稿一覧へ戻る
                </Link>
            </div>
        </section>
    );
}

export default MyPage;