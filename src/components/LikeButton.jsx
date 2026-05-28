import '../css/LikeButton.css';

{/* いいね機能（ハートスタンプ風） */}
export default function LikeButton({ liked, count, onClick }) {
  return (
    <button
      className={`like-stamp-button ${liked ? 'liked' : ''}`}
      onClick={onClick}
    >
      <span className="icon">{liked ? "❤️" : "🤍"}</span> {count}
    </button>
  );
}