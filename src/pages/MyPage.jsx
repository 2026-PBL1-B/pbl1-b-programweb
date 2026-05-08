// src/pages/MyPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts } from '../api/product';
import { getProductLike } from '../api/productLike';
import { getMyQuestions } from '../api/Question'; //質問取得用API
import { getCurrentUserId } from '../api/Signin';
import "../css/MyPage.css";

function MyPage() {
    const [myArticles, setMyArticles] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);
    const [viewType, setViewType] = useState('products'); //表示の切り替え状態

    useEffect(() => {
        const loadMyProducts = async () => {
            setIsLoading(true);
            try {
                // getCurrentUserId を実行してユーザーIDを直接取得する
                const userId = await getCurrentUserId();
                
                if (userId) {
                    if (viewType === 'products') {
                        const products = await getMyProducts(userId);  // プロダクト一覧取得
                        
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
                    } else {
                        // 質問一覧の取得処理
                        const questions = await getMyQuestions();
                        if (questions) {
                            // 既存の表示項目(created_at)に合わせるためupdated_atを代入
                            const formattedQuestions = questions.map(q => ({
                                ...q,
                                created_at: q.updated_at 
                            }));
                            setMyArticles(formattedQuestions);
                        } else {
                            setMyArticles([]);
                        }
                    }
                }
            } catch (error) {
                console.error('エラー:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMyProducts();
    }, [viewType]); // タブを切り替えた時に再実行されるように変更

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
                {/* タブボタンを表示 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <p className="mypage-subtitle">あなたの投稿一覧です</p>
                    <div className="tab-container">
                        <button 
                            className={`tab-button ${viewType === 'products' ? 'active' : ''}`}
                            onClick={() => setViewType('products')}
                        >
                            投稿物一覧
                        </button>
                        <button 
                            className={`tab-button ${viewType === 'questions' ? 'active' : ''}`}
                            onClick={() => setViewType('questions')}
                        >
                            質問一覧
                        </button>
                    </div>
                </div>
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
                    <p className="empty-text">まだ{viewType === 'products' ? '投稿' : '質問'}がありません。</p>
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
                            
                            {/* リンク先を投稿か質問かで切り替え */}
                            <Link 
                                to={viewType === 'products' ? `/product/${article.id}` : `/questiondetail/${article.id}`} 
                                className="article-link"
                            >      
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