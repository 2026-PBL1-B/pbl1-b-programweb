// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../spabase'; // 既存のパスに合わせています

function ProductList() {
    const [articles, setArticles] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate(); // ボタンで画面遷移するための関数

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            
            // 【重要】Userテーブルからnameを取得するようにselect文を修正
            const { data, error } = await supabase
                .from('Product')
                .select(`
                    *,
                    User:user_id (
                        name
                    )
                `)
                .eq('is_public', true);

            if (error) {
                console.error('データの取得に失敗しました:', error.message);
            } else {
                console.log('取得データ確認:', data); // デバッグ用
                setArticles(data || []);
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, []);

    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' ,
                paddingBottom: '24px', borderBottom: '2px solid var(--border)' 
            }}>
                <h1 style={{ margin: 0 }}>制作物投稿一覧ページ</h1>
                <button 
                    onClick={() => navigate('/productpost')} 
                    style={{
                        padding: '8px 16px', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)',
                        borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', width: '160px',
                        fontSize: '14px', fontWeight: 'bold', textAlign: 'center'
                    }}
                >
                    投稿する
                </button>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        style={{
                            padding: '8px 16px', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)',
                            borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', width: '160px', alignSelf: 'flex-end'
                        }}
                    >
                        {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
                    </button>

                    {isLoading ? (
                        <p style={{ color: 'var(--text)' }}>読み込み中...</p>
                    ) : (
                        sortedArticles.map((article) => (
                            <div key={article.id} style={{ 
                                border: '1px solid var(--border)', borderRadius: '12px', padding: '24px',                   
                                backgroundColor: 'var(--bg)', boxShadow: 'var(--shadow)', textAlign: 'left',
                                width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'                        
                            }}>
                                <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                        {/* 【修正】取得したUserオブジェクトのnameを表示 */}
                                        投稿者: {article.User?.name || '不明なユーザー'}
                                    </span>
                                    <span>{new Date(article.created_at).toLocaleDateString('ja-JP')}</span>
                                </div>
                                
                                <h2 style={{ fontSize: '22px', margin: '0', color: 'var(--text-h)', cursor: 'pointer' }}>
                                    {article.title}
                                </h2>

                                {article.content && (
                                    <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {article.content}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <Link to="/" style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' }}>
                    ← ログイン画面へ戻る
                </Link>
            </div>
        </section>
    );
}

export default ProductList;