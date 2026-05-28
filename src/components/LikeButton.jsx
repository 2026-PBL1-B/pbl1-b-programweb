import '../css/LikeButton.css';

{/* いいね機能（ハートスタンプ風） */}
export default function LikeButton({ liked, count, onClick, isSmall }) {
  return (
    <button
      className={`like-stamp-button ${liked ? 'liked' : ''} ${isSmall ? 'small-stamp' : ''}`}
      onClick={onClick}
    >
      <span className="icon">{liked ? "❤️" : "🤍"}</span> {count}
    </button>
  );
}