// 仮ページ
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 既存のデザインを一部使い回します
import { signUpEmailandPassword } from '../api/Signup'; // サインインのAPI関数をインポート

function Signup() {
    // 入力されたメールアドレスとパスワードを記憶するための準備
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // サインアップボタンが押された時の処理
    const handleSignup = async(e) => {
        e.preventDefault(); // 画面がリロードされるのを防ぐおまじないです

        // spabaseにサインアップリクエスト
        const user = await signUpEmailandPassword(email, password);

        if (user){
            console.log('サインアップ成功:', user);
            navigate('/home');  // サインアップ成功したら'/home'へ遷移
        } else {
            alert('サインアップに失敗しました。メールアドレスとパスワードを確認してください。');
            return; // サインアップ失敗ならここで処理を終わらせる
        }

    };

    return (
        <section id="center">
            <h1>サインアップ</h1>
            <p>アカウント情報を入力してください</p>

            {/* サインアップフォーム */}
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', width: '300px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label htmlFor="email" style={{ marginBottom: '8px', color: 'var(--text-h)' }}>メールアドレス</label>
                <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // 入力されるたびに記憶を更新
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label htmlFor="password" style={{ marginBottom: '8px', color: 'var(--text-h)' }}>パスワード</label>
                <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 入力されるたびに記憶を更新
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
            </div>

                {/* 既存の .counter クラスを使ってボタンをデザインします */}
                <button type="submit" className="counter" style={{ marginTop: '16px', cursor: 'pointer' }}>
                サインアップ
                </button>
            </form>
        </section>
    );
}

export default Signup;