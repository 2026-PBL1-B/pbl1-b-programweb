import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserName } from '../api/User';

/**
 * ユーザーIDとユーザー名を受け取り、クリックでUserPageへ遷移するリンクを表示するコンポーネント
 * @param {string} userId - ユーザーのID
 * @param {string} [userName] - 既に取得済みのユーザー名（省略時はIDから自動取得）
 * @param {string} [prefix] - 名前の前に表示する文字（例: "@"）
 */
export default function UserLink({ userId, userName, className, prefix = "" }) {
  const [name, setName] = useState(userName);
  const [isLoading, setIsLoading] = useState(!userName);

  useEffect(() => {
    let isMounted = true;
    const fetchName = async () => {
      // 既にuserNameが渡されている場合はそれを使用し、取得は行わない
      if (userName) {
        setName(userName);
        setIsLoading(false);
        return;
      }
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
  }, [userId, userName]);

  if (!userId) {
    return <span className={className}>不明なユーザー</span>;
  }

  if (isLoading) {
    return <span className={className}>@...</span>;
  }

  return (
    <Link 
      to={`/userpage/${userId}`} 
      className={className} 
      style={{ textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}
    >
      {prefix}{name || '不明なユーザー'}
    </Link>
  );
}