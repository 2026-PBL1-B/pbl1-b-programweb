import { useState } from 'react';


{/* いいね機能 */}
export default function LikeButton() {
  const [liked, setLiked] = useState(false);   // いいね状態
  const [count, setCount] = useState(0);        // いいね数

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setCount(count - 1);  // 取り消し
    } else {
      setLiked(true);
      setCount(count + 1);  // いいね
    }
  };

  return (
    <button
      onClick={handleLike}
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