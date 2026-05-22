// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/product';
import { getUserName } from '../api/User';
import { getTags, getProductTagNames } from '../api/Tag';
import TagFilterSortBar from '../components/TagFilterSortBar';
import '../css/ListPage.css';
import Guideheader from '../components/Header.jsx';
import UserLink from '../components/UserLink';

function ProductList() {
    const [articles, setArticles] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    // タグ関連の状態管理
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTagNames, setSelectedTagNames] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                // 1. 全タグ一覧を取得
                const tagsData = await getTags();
                setAvailableTags(tagsData || []);

                // 2. 制作物一覧を取得
                const data = await getProducts();
                console.log('取得データ確認:', data); // デバッグ用
                
                // 3. 各制作物にユーザー名と紐づくタグ名リストを追加
                const dataWithNamesAndTags = await Promise.all(
                    (data || []).map(async (article) => {
                        const userName = await getUserName(article.user_id);
                        const tagNames = await getProductTagNames(article.id);
                        return { ...article, fetchedUserName: userName, tags: tagNames };
                    })
                );
                
                setArticles(dataWithNamesAndTags);
            } catch (error) {
                console.error('データの読み込み中にエラーが発生しました', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    // ★重要: ここで絞り込みと並び替えを行った新しい配列を作成します
    const filteredAndSortedArticles = [...articles]
        .filter((article) => {
            // 非公開は除外
            if (!article.is_public) return false;

            // 未完成は除外
            if (!article.is_finish) return false;
            // 選択されているタグがない場合はすべて表示
            if (selectedTagNames.length === 0) return true;
            if (!article.tags) return false;
            // 選択されたタグの「いずれか」が含まれているものを抽出
            return selectedTagNames.some(tag => article.tags.includes(tag));
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    return (
        <section className="page-container">
            {/* Guideheaderは独立させて一番上に配置します */}
            <Guideheader />

            <div className="content-layout">
                <div className="main-column">
                    {/* アクションバー：フィルターとボタンを横並びに配置 */}
                    <div className="action-bar">
                        {/* 左側にフィルターとソート */}
                        <TagFilterSortBar 
                            availableTags={availableTags}
                            selectedTagNames={selectedTagNames}
                            setSelectedTagNames={setSelectedTagNames}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                        
                        {/* 右側に投稿ボタン */}
                        <button 
                            className="primary-button"
                            onClick={() => navigate('/productpost')}
                        >
                            制作物を投稿する
                        </button>
                    </div>

                    {isLoading ? (
                        <p style={{ color: 'var(--text)' }}>読み込み中...</p>
                    ) : filteredAndSortedArticles.length === 0 ? (
                        <p>該当する制作物はありません。</p>
                    ) : (
                        filteredAndSortedArticles.map((article) => (
                            <div key={article.id} className="item-card">
                                <div className="card-meta">
                                    <div>
                                        <span className="author-name">
                                            投稿者: <UserLink userId={article.user_id} userName={article.fetchedUserName} />
                                        </span>

                                         {/*投稿日時表記：年月日、時分まで表記 */}
                                        <span>{new Date(article.created_at).toLocaleDateString('ja-JP',{
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </div>
                                
                                <Link to={`/product/${article.id}`} className="title-link">      
                                    <h2 className="item-title">
                                        {article.title}
                                    </h2>
                                </Link>

                                {article.tags && article.tags.length > 0 && (
                                    <div className="tag-list">
                                        {article.tags.map((tagName, index) => (
                                            <span key={index} className="tag-badge">
                                                {tagName}
                                            </span>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductList;