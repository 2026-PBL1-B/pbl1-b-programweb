// src/pages/QuestionList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions } from '../api/Question';
import { getUserName } from '../api/User';
import { getTags, getQuestionTagNames } from '../api/Tag';
import TagFilterSortBar from '../components/TagFilterSortBar';
import '../css/ListPage.css';

function QuestionList() {
    const [questions, setQuestions] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isLoading, setIsLoading] = useState(true);

    const [availableTags, setAvailableTags] = useState([]); 
    const [selectedTagNames, setSelectedTagNames] = useState([]); 

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const tagsData = await getTags();
                setAvailableTags(tagsData || []);

                const data = await getQuestions();
                
                const dataWithNamesAndTags = await Promise.all(
                    (data || []).map(async (question) => {
                        const userName = await getUserName(question.user_id);
                        const tagNames = await getQuestionTagNames(question.id);
                        return { ...question, fetchedUserName: userName, tags: tagNames };
                    })
                );
                
                setQuestions(dataWithNamesAndTags);
            } catch (error) {
                console.error('データの読み込み処理中にエラーが発生しました', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // --- 絞り込みと並び替えの部分 ---
    const filteredAndSortedQuestions = [...questions]
        .filter((question) => {
            // 何も選択されていない場合はすべて表示
            if (selectedTagNames.length === 0) return true;
            if (!question.tags) return false;
            
            // 選択されたタグの「いずれか」が含まれていれば表示
            return selectedTagNames.some(tag => question.tags.includes(tag));
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    return (
        <section className="page-container">
            <div className="page-header">
                <h1 className="header-title">質問一覧ページ</h1>
                <button 
                    className="primary-button"
                    onClick={() => navigate('/questionpost')} 
                >
                    質問を投稿する
                </button>
            </div>

            <div className="content-layout">
                <div className="main-column">
                    <TagFilterSortBar 
                        availableTags={availableTags}
                        selectedTagNames={selectedTagNames}
                        setSelectedTagNames={setSelectedTagNames}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    {isLoading ? (
                        <p style={{ color: 'var(--text)' }}>読み込み中...</p>
                    ) : (
                        filteredAndSortedQuestions.map((question) => (
                            <div key={question.id} className="item-card">
                                <div className="card-meta">
                                    <div>
                                        <span className="author-name">
                                            投稿者: {question.fetchedUserName || '不明なユーザー'}
                                        </span>
                                        <span>{new Date(question.created_at).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                    
                                    {/* 状態によって色を切り替えるクラスを動的に付与します */}
                                    <div className={`status-badge ${question.is_finish ? 'status-resolved' : 'status-open'}`}>
                                        {question.is_finish ? '解決済み' : '受付中'}
                                    </div>
                                </div>
                                
                                <Link to={`/question/${question.id}`} className="title-link">      
                                    <h2 className="item-title">
                                        {question.title}
                                    </h2>
                                </Link>

                                {question.tags && question.tags.length > 0 && (
                                    <div className="tag-list">
                                        {question.tags.map((tagName, index) => (
                                            <span key={index} className="tag-badge">
                                                {tagName}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {question.content && (
                                    <p className="item-content">
                                        {question.content}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default QuestionList;