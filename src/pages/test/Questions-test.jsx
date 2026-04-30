import { useState } from 'react';
import { getQuestions, postQuestion } from '../../api/Question';
import { postQuestionComment } from '../../api/questioncomment';

function QuestionsTest() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFinish, setIsFinish] = useState(false);

  // コメント投稿用ステート
  const [commentQuestionId, setCommentQuestionId] = useState('');
  const [commentContent, setCommentContent] = useState('');

  // 質問取得処理
  const handleGetQuestions = async () => {
    const data = await getQuestions();
    if (data) {
      setQuestions(data);
    }
  };

  // 質問投稿処理
  const handlePostQuestion = async (e) => {
    e.preventDefault();
    await postQuestion(title, content, isPublic, isFinish);
    alert('質問を投稿しました（コンソールも確認してください）。');
    // 入力フォームをクリア
    setTitle('');
    setContent('');
    // 投稿後に一覧を再取得したい場合はコメントアウトを外す
    // handleGetQuestions();
  };

  // コメント投稿処理
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentQuestionId) {
      alert('質問IDを入力してください');
      return;
    }
    await postQuestionComment(commentQuestionId, commentContent);
    alert('コメントを投稿しました（コンソールも確認してください）。');
    // 入力フォームをクリア
    setCommentQuestionId('');
    setCommentContent('');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'left', color: 'var(--text-color)' }}>
      <h1>質問API テストページ</h1>

      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h2>質問を投稿する (postQuestion)</h2>
        <form onSubmit={handlePostQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '80px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ marginRight: '4px' }}
              />
              公開する (is_public)
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isFinish}
                onChange={(e) => setIsFinish(e.target.checked)}
                style={{ marginRight: '4px' }}
              />
              完了とする (is_finish)
            </label>
          </div>
          <button type="submit" className="counter" style={{ marginTop: '8px', cursor: 'pointer' }}>
            投稿テスト
          </button>
        </form>
      </section>

      <section style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h2>質問を取得する (getQuestions)</h2>
        <button onClick={handleGetQuestions} className="counter" style={{ marginBottom: '16px', cursor: 'pointer' }}>
          質問を取得して表示
        </button>
        {questions.length > 0 ? (
          <ul style={{ paddingLeft: '20px' }}>
            {questions.map((q) => (
              <li key={q.id || Math.random()} style={{ marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
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

      <section style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '40px' }}>
        <h2>質問にコメントする (postQuestionComment)</h2>
        <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>質問ID</label>
            <input
              type="text"
              value={commentQuestionId}
              onChange={(e) => setCommentQuestionId(e.target.value)}
              required
              placeholder="取得した質問のIDを入力"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>コメント内容</label>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '80px' }}
            />
          </div>
          <button type="submit" className="counter" style={{ marginTop: '8px', cursor: 'pointer' }}>
            コメント投稿テスト
          </button>
        </form>
      </section>
    </div>
  );
}

export default QuestionsTest;