import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/QuestionDetail.css";


function QuestionDetail() {

    const { id } = useParams();

    const [question, setQuestion] = useState(null);

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
        };

        fetchQuestion();

    }, [id]);

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

            </div>

       
        </>
    );
}

export default QuestionDetail;