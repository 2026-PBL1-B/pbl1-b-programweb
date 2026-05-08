{/* いいね機能 */}
export default function LikeButton({ liked, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: liked ? "#E24A4A" : "#ccc",  // いいね時は赤
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px"
      }}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}