import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../css/Header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-wrapper">
      <button
        className="account-button"
        onClick={() => navigate("/MyPage")}
      >
        👤
      </button>

      <div className="nav-bar">
        <h2 className="nav-link" onClick={() => navigate("/Home")}>HP</h2>
        <h2 className="nav-link" onClick={() => navigate("/QuestionList")}>質問</h2>
        <h2 className="nav-link" onClick={() => navigate("/productlist")}>制作物</h2>
      </div>
      <br />
      <Link to="/" className="login-link">
        ログイン画面へ戻る
      </Link>
    </header>
  );
}