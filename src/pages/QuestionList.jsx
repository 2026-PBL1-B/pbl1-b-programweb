// src/pages/QuestionList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions } from '../api/Question'; // 質問用のAPI関数をインポート

function QuestionList() {
    // articlesをquestionsに変更し、状態を管理します
    const [questions, setQuestions] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            try {
                // 質問一覧を取得するAPIを呼び出します
                const data = await getQuestions();
                console.log('取得データ確認:', data);
                setQuestions(data || []);
            } catch (error) {
                console.error('データの読み込み処理中にエラーが発生しました', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, []);

    // 質問を作成日（created_at）の順序で並び替えます
    const sortedQuestions = [...questions].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <section style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' ,
                paddingBottom: '24px', borderBottom: '2px solid var(--border)' 
            }}>
                <h1 style={{ margin: 0 }}>質問一覧ページ</h1>
                <button 
                    onClick={() => navigate('/questionpost')} // 質問投稿ページへの遷移に変更
                    style={{
                        padding: '8px 16px', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)',
                        borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', width: '160px',
                        fontSize: '14px', fontWeight: 'bold', textAlign: 'center'
                    }}
                >
                    質問を投稿する
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
                        sortedQuestions.map((question) => (
                            <div key={question.id} style={{ 
                                border: '1px solid var(--border)', borderRadius: '12px', padding: '24px',                   
                                backgroundColor: 'var(--bg)', boxShadow: 'var(--shadow)', textAlign: 'left',
                                width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'                        
                            }}>
                                <div style={{ fontSize: '14px', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                            投稿者: {question.User?.name || '不明なユーザー'}
                                        </span>
                                        <span>{new Date(question.created_at).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                    
                                    {/* DBの is_finish を活用したステータスラベル */}
                                    <div style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: question.is_finish ? '#e0f2f1' : '#ffebee',
                                        color: question.is_finish ? '#00695c' : '#c62828',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        {question.is_finish ? '解決済み' : '受付中'}
                                    </div>
                                </div>
                                
                                <h2 style={{ fontSize: '22px', margin: '0', color: 'var(--text-h)', cursor: 'pointer' }}>
                                    {question.title}
                                </h2>

                                {question.content && (
                                    <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {question.content}
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

export default QuestionList;