// src/pages/QuestionList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions } from '../api/Question';
import { getUserName } from '../api/User';
import { getTags } from '../api/Tag'; // ← ★追加: Tag.js のパスに合わせて変更してください

function QuestionList() {
    const [questions, setQuestions] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    // ★追加: タグ関連の状態を管理
    const [availableTags, setAvailableTags] = useState([]); // DBから取得したタグ一覧を保存
    const [selectedTagId, setSelectedTagId] = useState('all'); // 選択されたタグのID（初期値は'all'）

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // ★追加: タグ一覧を取得してStateに保存
                const tagsData = await getTags();
                setAvailableTags(tagsData || []);

                // 質問一覧を取得
                const data = await getQuestions();
                console.log('取得データ確認:', data);
                
                // ユーザー名を結合
                const dataWithNames = await Promise.all(
                    (data || []).map(async (question) => {
                        const userName = await getUserName(question.user_id);
                        return { ...question, fetchedUserName: userName };
                    })
                );
                
                setQuestions(dataWithNames);
            } catch (error) {
                console.error('データの読み込み処理中にエラーが発生しました', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // ★変更: 質問の「絞り込み」と「並び替え」を行います
    const filteredAndSortedQuestions = [...questions]
        .filter((question) => {
            // 「すべて」が選ばれている場合はそのまま表示
            if (selectedTagId === 'all') return true;
            
            // ★重要★ ここでは、question データの中に 'tags' という配列があり、
            // その中にタグのオブジェクト（{id: ...}）が入っていると仮定して絞り込んでいます。
            if (!question.tags) return false;
            return question.tags.some(tag => tag.id === selectedTagId);
        })
        .sort((a, b) => {
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
                    onClick={() => navigate('/questionpost')} 
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
                    
                    {/* 操作パネル（タグ絞り込み ＆ 並び替え） */}
                    <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end' }}>
                        
                        {/* タグを選択するプルダウンメニュー */}
                        <select
                            value={selectedTagId}
                            onChange={(e) => setSelectedTagId(e.target.value)}
                            style={{
                                padding: '8px 12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
                                borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', fontSize: '14px'
                            }}
                        >
                            <option value="all">すべてのタグ</option>
                            {availableTags.map(tag => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <button 
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            style={{
                                padding: '8px 16px', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)',
                                borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', width: '160px'
                            }}
                        >
                            {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
                        </button>
                    </div>

                    {isLoading ? (
                        <p style={{ color: 'var(--text)' }}>読み込み中...</p>
                    ) : (
                        // sortedQuestions ではなく、filteredAndSortedQuestions を表示します
                        filteredAndSortedQuestions.map((question) => (
                            <div key={question.id} style={{ 
                                border: '1px solid var(--border)', borderRadius: '12px', padding: '24px',                   
                                backgroundColor: 'var(--bg)', boxShadow: 'var(--shadow)', textAlign: 'left',
                                width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'                        
                            }}>
                                <div style={{ fontSize: '14px', color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                            投稿者: {question.fetchedUserName || '不明なユーザー'}
                                        </span>
                                        <span>{new Date(question.created_at).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                    
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
                                
                                <Link to={`/question/${question.id}`} style={{ textDecoration: 'none'}}>      
                                    <h2 style={{ fontSize: '22px', margin: '0', color: 'var(--text-h)', cursor: 'pointer' }}>
                                        {question.title}
                                    </h2>
                                </Link>

                                {/* 質問に紐づくタグがあれば表示する */}
                                {question.tags && question.tags.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {question.tags.map(tag => (
                                            <span key={tag.id || tag} style={{ fontSize: '12px', backgroundColor: 'var(--code-bg)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                {tag.name || tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

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