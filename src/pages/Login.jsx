// 仮ページ
import '../App.css'; // 既存のデザインを一部使い回します
import '../css/Login.css'; // 新しいデザイン用のCSSを読み込む
import { signInWithGoogle } from '../api/Signin'; // サインインのAPI関数をインポート

function Login() {
    // Googleサインインボタンが押された時の処理
    const handleGoogleLogin = async () => {
        // フロントエンドの責務としてリダイレクト先を指定
        const redirectTo = `${window.location.origin}/home`;
        const { error } = await signInWithGoogle(redirectTo);

        if (error) {
            if (error.message.includes('学校指定のメールアドレス') || error.message.includes('Database error saving new user')) {
                alert('stメールでサインインしてください');
            } else {
                alert('Googleサインイン中にエラーが発生しました。');
            }
        }
    };

    return (
        <section className="login-page-container">
            <div className="login-memo-card">
                <div className="login-header">
                    <h1 className="login-title">KD-Board</h1>
                    <h2 className="login-subtitle">サインイン</h2>
                </div>
                
                <div className="login-body">
                    <button 
                        onClick={handleGoogleLogin} 
                        className="login-signin-button" 
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                        KDアカウントでサインイン
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Login;