import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/QuestionDetail.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postQuestionComment, getQuestionComments } from '../api/questioncomment';
import { postQuestionLike, deleteQuestionLike, getQuestionsLike, getMyQuestionLike } from '../api/questionLike';
import LikeButton from '../components/LikeButton';


function QuestionDetail() {

    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

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
            } else {
                setQuestion(data);
            }

            await fetchComments();

            // いいね情報を取得
            const { count } = await getQuestionsLike(id); // いいねの数を取得
            setLikeCount(count);
            const isLiked = await getMyQuestionLike(id); // 自分がいいねしているかどうかを取得
            setLiked(isLiked);
        };

        fetchQuestion();

    }, [id, fetchComments]);

    // いいねボタンが押された時の処理
    const handleLikeToggle = async () => {
        // 楽観的UI更新
        const previousLiked = liked;
        const previousCount = likeCount;
        
        setLiked(!previousLiked);
        setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);  // いいねの数も更新

        // いいねの状態をサーバーに反映
        try {
            if (previousLiked) {
                await deleteQuestionLike(id);
            } else {
                await postQuestionLike(id);
            }
        } catch (error) {
            // 失敗した場合は元に戻す
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

    // 読み込み中
    if (!question) {
        return <p>読み込み中...</p>;
    }

    return (
        // 詳細ページタイトル
        <>
        <h1>詳細ページ</h1>
            <div className="detail-container">

            {/* いいねボタン */}
            <div className="like-button-container">
                <LikeButton liked={liked} count={likeCount} onClick={handleLikeToggle} />
            </div>

            {/* タイトルエリア */}
            <div className="content-section">

                <p className="section-label">
                    質問タイトル
                </p>

                <h2 className="post-title">
                    {question.title}
                </h2>

            </div>

            {/* 本文エリア */}
            <div className="content-section">

                <p className="section-label">
                    質問内容
                </p>

                <div className="post-content">
                    {question.content}
                </div>

            </div>

            {/* コメントフォーム */}
            <DetailCommentPost onSubmit={handleCommentSubmit} />

            {/* コメント一覧 */}
            <DetailCommentGet comments={comments} />

            </div>

       
        </>
    );
}

export default QuestionDetail;