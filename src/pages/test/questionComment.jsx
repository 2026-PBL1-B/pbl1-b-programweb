import { useState } from 'react';
import { supabase } from '../../spabase';
import { postQuestionComment } from '../../api/questioncomment';

function QuestionCommentTest() {
  const [questionId, setQuestionId] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('ログインユーザーが取得できませんでした。先にログインしてください。');
        setLoading(false);
        return;
      }

      await postQuestionComment(questionId, comment);
      
      alert(`Question ID: ${questionId} にコメントを送信しました！`);
      setComment('');
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>コメント（QuestionComment）テスト</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※事前にログインしておく必要があります。
      </p>

      <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label>コメントする Question ID:</label><br />
          <input 
            type="text" 
            value={questionId} 
            onChange={(e) => setQuestionId(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>コメント内容:</label><br />
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            required 
            rows="4"
            placeholder="ここにコメントを入力..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '送信中...' : 'コメントを送信する'}
        </button>
      </form>
    </section>
  );
}

export default QuestionCommentTest;