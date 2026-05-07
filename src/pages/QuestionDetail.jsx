import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';

import "../css/QuestionDetail.css";

function QuestionDetail(){

    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            // 質問詳細取得
            const { data: questionData, error: questionError } = await supabase
                .from('Question')
                .select('*')
                .eq('id', id)
                .single();

            if(questionError){
                console.error(questionError);
            } else {
                setQuestion(questionData);
            }

            // コメント取得
            const { data: commentData, error: commentError } = await supabase
                .from('QuestionComment')
                .select('*')
                .eq('question_id', id)
                .order('created_at', { ascending: true });

            if(commentError){
                console.error(commentError);
            } else {
                setComments(commentData);
            }
        };

        fetchData();

    }, [id]);

    // コメント送信
    const handleCommentSubmit = async () => {

        if(!commentText) return;

        const { error } = await supabase
            .from('QuestionComment')
            .insert([
                {
                    question_id: id,
                    content: commentText
                }
            ]);

        if(error){
            console.error(error);
            return;
        }

        // コメント再取得
        const { data } = await supabase
            .from('QuestionComment')
            .select('*')
            .eq('question_id', id)
            .order('created_at', { ascending: true });

        setComments(data);

        setCommentText("");
    };

    if(!question){
        return <p>読み込み中...</p>;
    }

    return (
        <div className="detail-page">

            <div className="detail-main">

                {/* ページタイトル */}
                <div className="detail-header">
                    <h1 className="detail-page-title">
                        質問詳細画面
                    </h1>
                </div>

                {/* 質問カード */}
                <div className="question-card">

                    <div className="question-header">

                        <div>
                            <h1 className="question-title">
                                {question.title}
                            </h1>

                            <div className="question-meta">
                                投稿日：
                                {new Date(question.created_at)
                                    .toLocaleDateString('ja-JP')}
                            </div>
                        </div>

                        <div className="question-status">
                            {question.is_finish
                                ? '解決済み'
                                : '受付中'}
                        </div>

                    </div>

                    <div className="question-content">
                        {question.content}
                    </div>

                </div>

                {/* コメント一覧 */}
                <div className="comment-section">

                    <h2 className="comment-title">
                        コメント {comments.length}件
                    </h2>

                    {comments.map((comment) => (

                        <div
                            key={comment.id}
                            className="comment-card"
                        >

                            <div className="comment-content">
                                {comment.content}
                            </div>

                        </div>

                    ))}

                </div>

                {/* コメント投稿 */}
                <div className="comment-form">

                    <h3 className="comment-form-title">
                        コメントを書く
                    </h3>

                    <textarea
                        className="comment-textarea"
                        value={commentText}
                        onChange={(e) =>
                            setCommentText(e.target.value)
                        }
                        placeholder="回答やアドバイスを書いてください"
                    />

                    <button
                        className="comment-submit-button"
                        onClick={handleCommentSubmit}
                    >
                        コメント送信
                    </button>

                </div>

            </div>

        </div>
    );
}

export default QuestionDetail;