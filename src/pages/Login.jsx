// 仮ページ
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 既存のデザインを一部使い回します
import { signInEmailandPassword, signInWithGoogle } from '../api/Signin'; // サインインのAPI関数をインポート

function Login() {
    // 入力されたメールアドレスとパスワードを記憶するための準備
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ログインボタンが押された時の処理
    const handleLogin = async(e) => {
        e.preventDefault(); // 画面がリロードされるのを防ぐおまじないです

        // spabaseにサインインリクエスト
        const { user, error } = await signInEmailandPassword(email, password);

        if (user){
            console.log('ログイン成功:', user);
            navigate('/home');  // ログイン成功したら'/home'へ遷移
        } else {
            // トリガーからのカスタムエラーメッセージが含まれているか確認
            if (error && error.message.includes('学校指定のメールアドレスでのみ登録可能です')) {
                alert('学校指定のメールアドレスでのみ登録可能です。');
            } else {
                alert('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
            }
            return; // ログイン失敗ならここで処理を終わらせる
        }
    };

    // Googleログインボタンが押された時の処理
    const handleGoogleLogin = async () => {
        // フロントエンドの責務としてリダイレクト先を指定
        const redirectTo = `${window.location.origin}/home`;
        const { error } = await signInWithGoogle(redirectTo);

        if (error) {
            if (error.message.includes('学校指定のメールアドレスでのみ登録可能です')) {
                alert('学校指定のメールアドレスでのみ登録可能です。');
            } else {
                alert('Googleログイン中にエラーが発生しました。');
            }
        }
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

            <div style={{ marginTop: '24px' }}>
                <p>または</p>
                <button 
                    onClick={handleGoogleLogin} 
                    className="counter" 
                    style={{ 
                        marginTop: '16px', 
                        cursor: 'pointer', 
                        backgroundColor: '#fff', 
                        color: '#757575', 
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '300px'
                    }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    KDアカウントでサインイン
                </button>
            </div>
        </section>
    );
}

export default Login;