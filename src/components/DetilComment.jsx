import { useState, useRef, useEffect } from 'react';
import "../css/Comment.css";
import { getUserName } from '../api/User';

/**
 * ユーザーIDから名前を取得して表示する小さなコンポーネント
 */
function CommentAuthor({ userId }) {
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchName = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      const fetchedName = await getUserName(userId);
      if (isMounted) {
        setName(fetchedName);
        setIsLoading(false);
      }
    };
    fetchName();
    return () => { isMounted = false; };
  }, [userId]);

  if (isLoading) return <span className="comment-username">@...</span>;
  
  return (
    <span className="comment-username">
      @{name || '不明なユーザー'}
    </span>
  );
}

/**
 * コメントコンポーネント
 * 制作物詳細と質問投稿詳細で使用する予定
 * - onSubmit: コメントが投稿されたときのコールバック関数。引数としてコメントの内容を受け取る。
 */
export default function DetailCommentPost({ onSubmit }) {
  const [comment, setComment] = useState('');
  const textareaRef = useRef(null);

  // 入力内容が変わるたびに高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // autoにして縮む動きに対応
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (onSubmit) {
      onSubmit(comment);
    }
    setComment('');
  };

  return (
    <div className="comment-form-container">
      <div className="comment-form-header">
        <span className="comment-form-title">コメントを投稿する</span>
      </div>
      <form onSubmit={handleSubmit} className="comment-form-body">
        <textarea
          ref={textareaRef} // テキストエリアの高さを自動調整するためのref
          className="comment-input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="ここにコメントを入力できます"
          rows={1} // 初期行数は1行
          style={{ overflow: 'hidden', resize: 'none' }} // スクロールと手動リサイズを無効化
        />
        <div className="comment-form-footer">
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
 * @param {Array} comments - コメントの配列
 */
export function DetailCommentGet({ comments }) {
  if (!comments || comments.length === 0) {
    return <div className="comment-list-empty">コメントはまだありません。</div>;
  }

  return (
    <div className="comment-list-container">
      {comments.map((comment) => (
        <div key={comment.id || comment.created_at} className="comment-item">
          <div className="comment-header">
            {/* ユーザー名（getUserNameを使用して取得） */}
            <CommentAuthor userId={comment.user_id} />
            <span className="comment-date">
              {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
            </span>
          </div>
          <div className="comment-body">
            {comment.content}
          </div>
        </div>
      ))}
    </div>
  );
}