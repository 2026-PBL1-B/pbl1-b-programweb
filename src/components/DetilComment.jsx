import { useState, useRef, useEffect } from 'react';
import "../css/Comment.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import UserLink from './UserLink';
import LikeButton from './LikeButton';
import { postProductCommentLike, deleteProductCommentLike, getProductCommentLike } from '../api/productcommentLike';
import { postQuestionCommentLike, deleteQuestionCommentLike, getQuestionCommentLike } from '../api/questioncommentLike';
import { getCurrentUserId } from '../api/Signin';
import UserAvatar from './UserAvatar';

export default function DetailCommentPost({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [height, setHeight] = useState('auto');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isPreview && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = `${scrollHeight}px`;
      textareaRef.current.style.height = newHeight;
      setHeight(newHeight);
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
    setHeight('auto');
  };

  return (
    <div className="comment-form-container">
      <div className="comment-form-header">
        <span className="comment-form-title">コメントを投稿する</span>
      </div>
      <form onSubmit={handleSubmit} className="comment-form-body">
        {!isPreview ? (
          //  編集時：白背景
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
          // プレビュー時：preview-containerクラスのみ（comment-inputは外す）
          <div
            className="preview-container markdown-content"
            style={{
              minHeight: height,
              overflowWrap: 'anywhere',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              fontSize: '16px',
              lineHeight: '1.5',
              boxSizing: 'border-box',
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

function CommentItem({ comment, type }) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchLikeData = async () => {
      const currentUserId = await getCurrentUserId();
      setUserId(currentUserId);

      let likeData;
      if (type === 'product') {
        likeData = await getProductCommentLike(comment.id);
      } else if (type === 'question') {
        likeData = await getQuestionCommentLike(comment.id);
      }

      if (likeData) {
        setLikeCount(likeData.count);
        if (currentUserId && likeData.data) {
          const userLiked = likeData.data.some(like => like.user_id === currentUserId);
          setIsLiked(userLiked);
        }
      }
    };
    if (comment.id && type) {
      fetchLikeData();
    }
  }, [comment.id, type]);

  const toggleLike = async () => {
    if (!userId) {
      alert("いいねするにはログインが必要です");
      return;
    }

    try {
      if (isLiked) {
        if (type === 'product') {
          await deleteProductCommentLike(comment.id);
        } else if (type === 'question') {
          await deleteQuestionCommentLike(comment.id);
        }
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        if (type === 'product') {
          await postProductCommentLike(comment.id);
        } else if (type === 'question') {
          await postQuestionCommentLike(comment.id);
        }
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("いいねの切り替えに失敗しました", error);
      alert("いいねの操作に失敗しました");
    }
  };

  return (
    <div className="comment-item-black">
      <div className="comment-header" style={{ alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

        <UserAvatar userId={comment.user_id} size={30
        } />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <UserLink
            userId={comment.user_id}
            className="comment-username"
            prefix="@"
          />

          <LikeButton
            liked={isLiked}
            count={likeCount}
            onClick={toggleLike}
          />
        </div>

      </div>
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
  );
}

export function DetailCommentGet({ comments, type }) {
  if (!comments || comments.length === 0) {
    return <div className="comment-list-empty">コメントはまだありません。</div>;
  }

  return (
    <div className="comment-list-container">
      {comments.map((comment) => (
        <CommentItem key={comment.id || comment.created_at} comment={comment} type={type} />
      ))}
    </div>
  );
}