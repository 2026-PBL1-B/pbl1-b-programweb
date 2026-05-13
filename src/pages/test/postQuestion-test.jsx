import { useState } from 'react';
import { postQuestion } from '../../api/Question';
import { getOrCreateTags, postQuestionTags } from '../../api/Tag';

function PostQuestionTest() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newQuestion = await postQuestion(title, content, isPublic, isFinish, grade, department);
      
      if (newQuestion && tagsInput.trim()) {
        const tagNames = tagsInput.split(',').map(t => t.trim()).filter(t => t);
        const tagIds = await getOrCreateTags(tagNames);
        if (tagIds && tagIds.length > 0) {
          await postQuestionTags(newQuestion.id, tagIds);
        }
      }
      
      alert('質問を投稿し、タグを紐づけました（コンソールも確認してください）。');
      setTitle('');
      setContent('');
      setGrade('');
      setDepartment('');
      setTagsInput('');
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>質問投稿テスト</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>タイトル:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>内容:</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>学年 (空欄可):</label><br />
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="例: 1"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>学科:</label><br />
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="例: 情報工学科"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>タグ (カンマ区切り):</label><br />
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="例: React, CSS"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            /> 公開する
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isFinish}
              onChange={(e) => setIsFinish(e.target.checked)}
            /> 完了とする
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? '投稿中...' : '質問を投稿する'}
        </button>
      </form>
    </section>
  );
}

export default PostQuestionTest;