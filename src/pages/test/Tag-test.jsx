import { useState } from 'react';
import { getTags, getOrCreateTags, postQuestionTags, postProductTags } from '../../api/Tag';

function TagTest() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Question用ステート
  const [questionId, setQuestionId] = useState('');
  const [questionTagsInput, setQuestionTagsInput] = useState('');

  // Product用ステート
  const [productId, setProductId] = useState('');
  const [productTagsInput, setProductTagsInput] = useState('');

  // タグ取得処理
  const handleGetTags = async () => {
    setLoading(true);
    try {
      const fetchedTags = await getTags();
      setTags(fetchedTags || []);
    } catch (error) {
      alert('タグの取得に失敗しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Questionへのタグ付け処理
  const handlePostQuestionTags = async (e) => {
    e.preventDefault();
    if (!questionId || !questionTagsInput) {
      alert('Question IDとタグ名を入力してください。');
      return;
    }
    setLoading(true);
    try {
      // カンマ区切りで配列にする
      const tagNames = questionTagsInput.split(',').map(t => t.trim()).filter(t => t);
      const tagIds = await getOrCreateTags(tagNames);
      
      if (tagIds && tagIds.length > 0) {
        await postQuestionTags(questionId, tagIds);
        alert('Questionにタグを紐づけました！コンソールも確認してください。');
        setQuestionId('');
        setQuestionTagsInput('');
      } else {
        alert('タグの処理に失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // Productへのタグ付け処理
  const handlePostProductTags = async (e) => {
    e.preventDefault();
    if (!productId || !productTagsInput) {
      alert('Product IDとタグ名を入力してください。');
      return;
    }
    setLoading(true);
    try {
      // カンマ区切りで配列にする
      const tagNames = productTagsInput.split(',').map(t => t.trim()).filter(t => t);
      const tagIds = await getOrCreateTags(tagNames);
      
      if (tagIds && tagIds.length > 0) {
        await postProductTags(productId, tagIds);
        alert('Productにタグを紐づけました！コンソールも確認してください。');
        setProductId('');
        setProductTagsInput('');
      } else {
        alert('タグの処理に失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left', color: 'var(--text-color)' }}>
      <h1>タグAPI テストページ</h1>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        ※事前に Question ID または Product ID を用意して入力してください。
      </p>

      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border, #ccc)', borderRadius: '8px' }}>
        <h2>1. タグ一覧の取得 (getTags)</h2>
        <button onClick={handleGetTags} disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {loading ? '取得中...' : 'タグ一覧を取得'}
        </button>
        {tags.length > 0 ? (
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            {tags.map((tag) => (
              <li key={tag.id} style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.2em' }}>{tag.name}</strong> <span style={{ fontSize: '0.8em', color: 'gray' }}>(ID: {tag.id})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: '16px' }}>タグがまだありません（または取得されていません）。</p>
        )}
      </section>

      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border, #ccc)', borderRadius: '8px' }}>
        <h2>2. Questionにタグを紐づける (postQuestionTags)</h2>
        <form onSubmit={handlePostQuestionTags} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>対象の Question ID</label>
            <input
              type="text"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              placeholder="例: a1b2c3d4-..."
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #ccc)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>追加するタグ名 (カンマ区切りで複数可)</label>
            <input
              type="text"
              value={questionTagsInput}
              onChange={(e) => setQuestionTagsInput(e.target.value)}
              placeholder="例: React, Next.js, Firebase"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #ccc)' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {loading ? '処理中...' : 'Questionにタグを紐づける'}
          </button>
        </form>
      </section>

      <section style={{ padding: '20px', border: '1px solid var(--border, #ccc)', borderRadius: '8px' }}>
        <h2>3. Productにタグを紐づける (postProductTags)</h2>
        <form onSubmit={handlePostProductTags} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>対象の Product ID</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="例: e5f6g7h8-..."
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #ccc)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>追加するタグ名 (カンマ区切りで複数可)</label>
            <input
              type="text"
              value={productTagsInput}
              onChange={(e) => setProductTagsInput(e.target.value)}
              placeholder="例: JavaScript, CSS, HTML"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border, #ccc)' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {loading ? '処理中...' : 'Productにタグを紐づける'}
          </button>
        </form>
      </section>

    </div>
  );
}

export default TagTest;
