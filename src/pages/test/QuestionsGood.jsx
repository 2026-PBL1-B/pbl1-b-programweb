// 質問投稿のいいねのテストページ
import { useState } from 'react';
import { getQuestionsLike } from '../../api/questionLike';

function QuestionsGoodTest() {
  const [questionId, setQuestionId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGetLikes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // getQuestionsLike関数を呼び出して結果を取得
      // userIdは任意項目のため、空文字の場合はundefinedを渡す
      const response = await getQuestionsLike(questionId, userId || undefined);
      setResult(response);
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>質問いいね（QuestionLike）取得テスト</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※特定の質問に対するいいね情報を取得します。<br/>
        ※特定のユーザーのいいねを確認したい場合は、User IDも入力してください。
      </p>

      <form onSubmit={handleGetLikes} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <div>
          <label>対象の Question ID (必須):</label><br />
          <input 
            type="text" 
            value={questionId} 
            onChange={(e) => setQuestionId(e.target.value)} 
            required 
            placeholder="例: a1b2c3d4-..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>対象の User ID (任意):</label><br />
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            placeholder="例: user-uuid-..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '取得中...' : 'いいね情報を取得する'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h2>取得結果</h2>
          <p><strong>いいね数:</strong> {result.count}件</p>
          <div>
            <strong>データ詳細:</strong>
            <pre style={{ background: '#f4f4f4', padding: '10px', overflowX: 'auto', fontSize: '12px' }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

export default QuestionsGoodTest;
