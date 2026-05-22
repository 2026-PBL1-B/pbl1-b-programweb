// src/pages/QuestionList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions } from '../api/Question';
import { getUserName } from '../api/User';
import { getTags, getQuestionTagNames } from '../api/Tag';
import TagFilterSortBar from '../components/TagFilterSortBar';
import '../css/ListPage.css';
import Guideheader from '../components/Header.jsx';
import UserLink from '../components/UserLink';

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
            // 非公開は除外
            if (!question.is_public) return false;
            // 下書きは非公開
            if (!question.is_finish) return false;

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
            {/* Guideheaderは独立させて一番上に配置します */}
            <Guideheader/>
            
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
                            onClick={() => navigate('/questionPost')}
                        >
                            質問を投稿する
                        </button>
                    </div>

                    {isLoading ? (
                        <p style={{ color: 'var(--text)' }}>読み込み中...</p>
                    ) : (
                        filteredAndSortedQuestions.map((question) => (
                            <div key={question.id} className="item-card">
                                <div className="card-meta">
                                    <div>
                                        <span className="author-name">
                                            投稿者: <UserLink userId={question.user_id} userName={question.fetchedUserName} />
                                        </span>
                                         {/*投稿日時表記：年月日、時分まで表記 */}
                                        <span>{new Date(question.created_at).toLocaleDateString('ja-JP',{
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                    
                                    {/* 状態によって色を切り替えるクラスを動的に付与します */}
                                    <div className={`status-badge ${question.is_open ? 'status-resolved' : 'status-open'}`}>
                                        {question.is_open ? '受付中' : '解決済み'}
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