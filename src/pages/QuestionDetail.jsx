import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { supabase } from '../spabase';
import "../css/DetailPage.css"; // 詳細独自のスタイルを読み込む
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postQuestionComment, getQuestionComments } from '../api/questioncomment';
import { postQuestionLike, deleteQuestionLike, getQuestionsLike, getMyQuestionLike } from '../api/questionLike';
import LikeButton from '../components/LikeButton';
import { getQuestionTagNames } from '../api/Tag';
import { getUserName } from '../api/User'; 
import { grades } from '../domain/GradeDepartment';
import UserLink from '../components/UserLink';

import Guideheader from '../components/Header.jsx';

function QuestionDetail() {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [tags, setTags] = useState([]);
    const [userName, setUserName] = useState('');

    const fetchComments = useCallback(async () => {
        const data = await getQuestionComments(id);
        setComments(data || []);
    }, [id]);

    useEffect(() => {
        const fetchQuestion = async () => {
            const { data, error } = await supabase
                .from('Question')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('取得エラー:', error);
            } else if (data) {
                setQuestion(data);
                // user_idを使ってユーザーネームを取得する処理
                if (data.user_id) {
                    const name = await getUserName(data.user_id);
                    setUserName(name || '不明なユーザー');
                }
            }

            await fetchComments();

            const { count } = await getQuestionsLike(id);
            setLikeCount(count);
            const isLiked = await getMyQuestionLike(id);
            setLiked(isLiked);

            if (getQuestionTagNames) {
                const tagNames = await getQuestionTagNames(id);
                setTags(tagNames || []);
            }
        };

        fetchQuestion();
    }, [id, fetchComments]);

    const handleLikeToggle = async () => {
        const previousLiked = liked;
        const previousCount = likeCount;
        
        setLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            if (previousLiked) {
                await deleteQuestionLike(id);
            } else {
                await postQuestionLike(id);
            }
        } catch (error) {
            console.error('いいねの処理に失敗:', error);
            setLiked(previousLiked);
            setLikeCount(previousCount);
            alert("いいねの処理に失敗しました");
        }
    };

    const handleCommentSubmit = async (content) => {
        const { error } = await postQuestionComment(id, content);
        if (error) {
            console.error('コメントの投稿に失敗:', error.message);
            alert('コメントの投稿に失敗しました。');
        } else {
            alert('コメントが投稿されました！');
            fetchComments();
        }
    };

    if (!question) return <p style={{ color: 'var(--text)', padding: '40px' }}>読み込み中...</p>;

    // 学年のラベル変換
    let gradeLabel = '情報なし';
    if (question.grade) {
        const foundGrade = grades.find(g => g.value === String(question.grade));
        if (foundGrade) {
            gradeLabel = foundGrade.label;
        }
    }

    return (
        <section className="page-container">
            {/* Guideheaderは独立させて一番上に配置します */}
            <Guideheader />

            {/* ヘッダー部分（リストページと同じ構造） */}
            {/* <div className="page-header">
                <h1 className="header-title">質問詳細ページ</h1>
            </div> */}

            {/* コンテンツレイアウト部分 */}
            <div className="content-layout">
                <div className="main-column">
                    
                    {/* 詳細情報のカード */}
                    <div className="detail-card">
                        
                        <div className="like-button-container">
                            <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>
                            {/* 1行目: ユーザーネーム */}
                            <div>投稿者: <UserLink userId={question.user_id} userName={userName} /></div>
                            
                            {/* 2行目: 学科・学年（こちらは横並び） */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span>{question.department ? question.department : '学科:情報なし'}</span>
                                <span>{question.grade ? gradeLabel : '学年:情報なし'}</span>
                            </div>

                            {/* 制作物タイトル */}
                            <h2 className="post-title">{question.title}</h2>
                        </div>

                        {/* タグリスト（リストページのスタイルを再利用） */}
                        <div className="tag-list">
                            {tags.length > 0 ? (
                                tags.map((tag, index) => (
                                    <span key={index} className="tag-badge">
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <p className="item-content">タグはありません</p>
                            )}
                        </div>

                        <div>
                            <p className="section-label">質問内容</p>
                            <div className="post-content markdown-preview">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {question.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* コメントエリア */}
                    <div className="comment-section">
                        <DetailCommentPost onSubmit={handleCommentSubmit} />
                        <DetailCommentGet comments={comments} type="question" />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default QuestionDetail;