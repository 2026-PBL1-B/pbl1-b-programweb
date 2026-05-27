import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfileAvatarUrl } from '../api/profile';

/**
 * ユーザーのアバターアイコンを表示するコンポーネント
 * @param {string} userId - ユーザーのID
 * @param {number} size - アイコンのサイズ（デフォルト: 35px）
 * @param {string} className - 追加のクラス名
 */
export default function AvatarIcon({ userId, size = 35, className = "" }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchAvatar = async () => {
      if (!userId) {
        setAvatarUrl("");
        return;
      }
      const url = await getProfileAvatarUrl(userId);
      if (isMounted) {
        setAvatarUrl(url || ""); // nullやundefinedの場合も空文字にする
      }
    };
    fetchAvatar();
    return () => { isMounted = false; };
  }, [userId]);

  const renderContent = () => {
    if (!avatarUrl) {
      return (
        <div 
          className={className}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: '#4A90E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.6}px`,
            color: 'white',
            flexShrink: 0,
            lineHeight: 1,
            overflow: 'hidden'
          }}
        >
          👤
        </div>
      );
    }

    return (
      <img
        src={avatarUrl}
        alt="User Avatar"
        className={className}
        onError={() => setAvatarUrl("")} // 画像読み込みエラー時も👤にする
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          backgroundColor: '#f0f0f0' // 読み込み中や背景透過対策
        }}
      />
    );
  };

  if (!userId) {
    return renderContent();
  }

  return (
    <Link to={`/userpage/${userId}`} style={{ textDecoration: 'none', display: 'block', width: `${size}px`, height: `${size}px` }}>
      {renderContent()}
    </Link>
  );
}
