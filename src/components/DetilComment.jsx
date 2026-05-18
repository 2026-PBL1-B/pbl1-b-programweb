import { useState, useRef, useEffect } from 'react';
import "../css/Comment.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import UserLink from './UserLink';

/**
 * コメントコンポーネント
 * - onSubmit: コメントが投稿されたときのコールバック関数。引数としてコメントの内容を受け取る。
 */
export default function DetailCommentPost({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [height, setHeight] = useState('auto'); // 高さをStateで管理
  const textareaRef = useRef(null);

  // 入力内容が変わるたびに高さを計算し、Stateに保存
  useEffect(() => {
    if (!isPreview && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = `${scrollHeight}px`;
      textareaRef.current.style.height = newHeight;
      setHeight(newHeight); // プレビュー側でも使えるように保存
    }
  }, [comment, isPreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (onSubmit) {
      onSubmit(comment);
    }
    setComment('');
    setIsPreview(false);
    setHeight('auto'); // リセット
  };

  return (
    <div className="comment-form-container">
      <div className="comment-form-header">
        <span className="comment-form-title">コメントを投稿する</span>
      </div>
      <form onSubmit={handleSubmit} className="comment-form-body">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ここにコメントを入力できます"
            rows={1}
            style={{ overflow: 'hidden', resize: 'none' }}
          />
        ) : (
          <div 
            className="comment-input markdown-content" 
            style={{ 
              minHeight: height,
              overflowWrap: 'anywhere'
            }}
          >
            {comment.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {comment}
              </ReactMarkdown>
            ) : (
              <span style={{ color: '#999' }}>プレビューする内容がありません</span>
            )}
          </div>
        )}
        
        <div className="comment-form-footer">
          <button
            type="button"
            className="comment-mode-button"
            onClick={() => setIsPreview(!isPreview)}
            style={{ marginRight: '8px' }}
          >
            {isPreview ? '編集' : 'プレビュー'}
          </button>
          <button 
            type="submit" 
            className="comment-submit-button" 
            disabled={!comment.trim()}
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * コメント一覧を表示するコンポーネント
 */
export function DetailCommentGet({ comments }) {
  if (!comments || comments.length === 0) {
    return <div className="comment-list-empty">コメントはまだありません。</div>;
  }

  return (
    <div className="comment-list-container">
      {comments.map((comment) => (
        <div key={comment.id || comment.created_at} className="comment-item-black">
          <div className="comment-header">
            <UserLink userId={comment.user_id} className="comment-username" prefix="@" />
            <span className="comment-date">
              {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
            </span>
          </div>
          <div className="comment-body markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {comment.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}