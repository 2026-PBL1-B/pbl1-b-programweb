// 仮ページ
import '../App.css'; // 既存のデザインを一部使い回します
import { signInWithGoogle } from '../api/Signin'; // サインインのAPI関数をインポート

function Login() {
    // Googleログインボタンが押された時の処理
    const handleGoogleLogin = async () => {
        // フロントエンドの責務としてリダイレクト先を指定
        const redirectTo = `${window.location.origin}/home`;
        const { error } = await signInWithGoogle(redirectTo);

        if (error) {
            if (error.message.includes('学校指定のメールアドレス') || error.message.includes('Database error saving new user')) {
                alert('stメールでログインしてください');
            } else {
                alert('Googleログイン中にエラーが発生しました。');
            }
        }
    };

    return (
        <>
        
        <section id="center">
            <div
                style={{
                    marginBottom: '24px',
                    textAlign: 'center'
                }}
            >
                <h1
                    style={{
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#2c2c2c',
                        letterSpacing: '2px'
                    }}
                >
                    KD-Board
                </h1>
                </div>
            <h2>ログイン</h2>
            <div style={{ marginTop: '16px' }}>
                <button 
                    onClick={handleGoogleLogin} 
                    className="counter" 
                    style={{ 
                        marginTop: '8px', 
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
        </>
    );
}
export default Login;