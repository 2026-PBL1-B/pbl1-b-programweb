import { useNavigate, useLocation } from "react-router-dom";  
import '../css/Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header-wrapper">
      <div className="header-top" />
      <button
        className="account-button"
        onClick={() => navigate("/MyPage")}
      >
        👤
      </button>

      <div className="nav-bar">
        <h2
          className={`nav-link ${location.pathname === "/Home" ? "active" : ""}`}
          onClick={() => navigate("/Home")}
        >
          HP
        </h2>
        <h2
          className={`nav-link ${location.pathname === "/productlist" ? "active" : ""}`}
          onClick={() => navigate("/productlist")}
        >
          制作物
        </h2>
        <h2
          className={`nav-link ${location.pathname === "/QuestionList" ? "active" : ""}`}
          onClick={() => navigate("/QuestionList")}
        >
          質問
        </h2>
      </div>
    </header>
  );
}