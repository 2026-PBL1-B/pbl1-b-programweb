import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/QuestionDetail.css";
import DetailCommentPost, { DetailCommentGet } from '../components/DetilComment';
import { postQuestionComment, getQuestionComments } from '../api/questioncomment';


function QuestionDetail() {

    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);

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
        };

        fetchQuestion();

    }, [id, fetchComments]);

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