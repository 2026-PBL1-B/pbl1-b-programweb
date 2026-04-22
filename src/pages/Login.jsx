import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 既存のデザインを一部使い回します

function Login() {
    // 入力されたメールアドレスとパスワードを記憶するための準備
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ログインボタンが押された時の処理
    const handleLogin = (e) => {
        e.preventDefault(); // 画面がリロードされるのを防ぐおまじないです
    
        // ここで入力されたデータを確認します（後々、ここでサーバーにデータを送ります）
        console.log('入力されたメールアドレス:', email);
        console.log('入力されたパスワード:', password);
        alert(`「${email}」でログインを試みました！`);

        navigate('/home');  // ログインの処理が終わった後、'/home'へ遷移
    };

    return (
        <section id="center">
            <h1>ログイン</h1>
            <p>アカウント情報を入力してください</p>

            {/* ログインフォーム */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', width: '300px' }}>
            
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
                ログインする
                </button>
            </form>
        </section>
    );
}

export default Login;