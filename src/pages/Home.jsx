// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../spabase';
import Header from '../components/Header.jsx';

function Home() { 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 認証チェック中かどうかの状態

  useEffect(() => {
    const checkAuth = async () => {
      // 1. URLのハッシュ（#以降）からエラー情報を取得
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const errorMsg = params.get('error_description');

      if (errorMsg) {
        const decodedMsg = decodeURIComponent(errorMsg).replace(/\+/g, ' ');
        // データベースエラーやドメイン制限のエラーを検知してメッセージを差し替える
        if (decodedMsg.includes('Database error saving new user') || decodedMsg.includes('学校指定のメールアドレス')) {
          alert('stメールでサインインしてください');
        } else {
          alert(decodedMsg);
        }
        navigate('/'); 
        return;
      }

      // 2. セッション情報の確認
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // セッションがない場合も即座にログイン画面へ
        navigate('/');
      } else {
        // 認証が確認できた場合のみ、コンテンツを表示する
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // チェックが終わるまでは何も表示しない（一瞬Homeが見えるのを防ぐ）
  if (loading) {
    return null;
  }

  return (
    <div>
          <Header />
    </div>
  );
}

export default Home;