// src/pages/QuestionDetail.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import "../css/DetailPage.css"; // 詳細独自のスタイルを読み込む
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postQuestionComment, getQuestionComments } from '../api/questioncomment';
import { postQuestionLike, deleteQuestionLike, getQuestionsLike, getMyQuestionLike } from '../api/questionLike';
import LikeButton from '../components/LikeButton';
import { getQuestionTagNames } from '../api/Tag';
import { getQuestionById } from '../api/Question';
import { getUserName } from '../api/User'; 
import { grades } from '../domain/GradeDepartment';
import UserLink from '../components/UserLink';
import AvatarIcon from '../components/AvatarIcon';

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
//*spabaseから直接引っ張ってくる形式から変更*//
useEffect(() => {
  const initData = async () => {
    const { success, data } = await getQuestionById(id);

    if (success && data) {
      setQuestion(data);

      if (data.user_id) {
        const name = await getUserName(data.user_id);
        setUserName(name || '不明なユーザー');
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
    }
  };

  initData();
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
            <Guideheader />

            <div className="content-layout">
                <div className="main-column">

                    <div className="detail-card" style={{ backgroundColor: '#fef9c3' }}>

                        <div className="like-button-container">
                            <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px', color: '#6b7280', fontSize: '14px', fontWeight: 'bold' }}>
                            {/* 1行目: アイコンとユーザーネーム */}
                            <div className="detail-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AvatarIcon userId={question.user_id} />
                                    <UserLink userId={question.user_id} userName={userName} prefix="投稿者: " />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 'normal' }}>投稿日: {new Date(question.created_at).toLocaleDateString('ja-JP')}</span>
                            </div>
                            
                            {/* 2行目: 学科・学年（こちらは横並び） */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span>{question.department ? question.department : '学科:情報なし'}</span>
                                <span>{question.grade ? gradeLabel : '学年:情報なし'}</span>
                            </div>

                            {/* 質問タイトル */}
                            <h2 className="post-title">{question.title}</h2>

                            {/* 🌟移動: タグリストをタイトルのすぐ下に配置 */}
                            <div className="tag-list" style={{ marginTop: '12px' }}>
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <span key={index} className="tag-badge">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <p className="item-content" style={{ margin: 0 }}>タグはありません</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="section-label" style={{ marginTop: '16px', marginBottom: '4px' }}>質問内容</p>
                            <div className="hand-drawn-line"></div>
                            <div className="post-content markdown-preview">
                                <MarkdownRenderer>
                                    {question.content}
                                </MarkdownRenderer>
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