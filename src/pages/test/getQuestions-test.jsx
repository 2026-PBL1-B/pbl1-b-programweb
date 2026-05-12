import { useState } from 'react';
import { getQuestions } from '../../api/Question';

function GetQuestionsTest() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 質問取得処理
  const handleGetQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions();
      if (data) {
        setQuestions(data);
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>質問一覧取得テスト</h1>
      
      <button onClick={handleGetQuestions} disabled={loading} style={{ padding: '10px', cursor: 'pointer', marginBottom: '20px' }}>
        {loading ? '取得中...' : '質問を取得して表示'}
      </button>

      {questions.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {questions.map((q, index) => (
            <li key={q.id || index} style={{ marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <strong style={{ fontSize: '1.2em' }}>{q.title} <span style={{ fontSize: '0.8em', color: 'gray' }}>(ID: {q.id})</span></strong>
              <p style={{ margin: '4px 0' }}>{q.content}</p>
              <div style={{ fontSize: '0.9em', color: 'gray' }}>
                公開設定: {q.is_public ? '公開' : '非公開'} / 状態: {q.is_finish ? '完了' : '未完了'}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>まだ質問が取得されていません。</p>
      )}
    </section>
  );
}

export default GetQuestionsTest;