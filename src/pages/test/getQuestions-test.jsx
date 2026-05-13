import { useState } from 'react';
import { getQuestions } from '../../api/Question';

function GetQuestionsTest() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagIdsInput, setTagIdsInput] = useState('');

  // 質問取得処理
  const handleGetQuestions = async () => {
    setLoading(true);
    try {
      // カンマ区切りの文字列を配列に変換（空白を除去し、空文字を取り除く）
      const tagIds = tagIdsInput
        .split(',')
        .map(id => id.trim())
        .filter(id => id);

      // 配列を渡して取得（配列が空の場合は引数なしと同じように全件取得される）
      const data = await getQuestions(tagIds);
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
      <h1>質問一覧取得テスト (タグOR検索対応)</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          絞り込みたい タグID を入力 (複数ある場合はカンマ区切り):
        </label>
        <input
          type="text"
          value={tagIdsInput}
          onChange={(e) => setTagIdsInput(e.target.value)}
          placeholder="例: tag-uuid-1, tag-uuid-2"
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleGetQuestions} disabled={loading} style={{ padding: '10px 16px', cursor: 'pointer' }}>
          {loading ? '取得中...' : '質問を取得して表示'}
        </button>
      </div>

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