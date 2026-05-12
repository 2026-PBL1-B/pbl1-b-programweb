// src/Home.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Header.css';  {/* ✅ CSSをimport */}

function Header() {
  const navigate = useNavigate();

  return (
    <header style={{ position: "relative" }}>
      <button
        onClick={() => navigate("/account")}
        style={{
          position: "absolute",
          top: "8px",
          right: "16px",
          backgroundColor: "#4A90E2",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          fontSize: "24px",
          cursor: "pointer"
        }}
      >
        👤
      </button>

      <h1>HomePage</h1>
      <div style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#4A90E2",
        height: "72px",
        width: "100%",
      }}>
        {/* ✅ classNameでCSSを適用 */}
        <h2
          className="nav-link nav-link-hp"
          onClick={() => navigate("/Home")}
        >
          HP
        </h2>
        <h2
          className="nav-link nav-link-question"
          onClick={() => navigate("/QuestionList")}
        >
          質問
        </h2>
        <h2
          className="nav-link nav-link-post"
          onClick={() => navigate("/productlist")}
        >
          投稿
        </h2>
      </div>
      <br />
      <Link to="/" style={{ color: 'var(--accent)', fontSize: '32px', fontWeight: 'bold' }}>
        ログイン画面へ戻る
      </Link>
    </header>
  );
}

export default Header;