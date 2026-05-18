// src/components/Header.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUserId } from "../api/Signin"
import '../css/Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountClick = async () => {
    try {
      const userId = await getCurrentUserId();
      if (userId) {
        navigate(`/userpage/${userId}`);
      } else {
        // ログインしていない場合はログイン画面（ルート）へ
        navigate("/");
      }
    } catch (error) {
      console.error("ユーザーIDの取得に失敗しました:", error);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-top" />
      <button
        className="account-button"
        onClick={handleAccountClick}
      >
        👤
      </button>

      <div className="nav-bar">
        {/* HP */}
        <h2
          className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          HP
        </h2>

        {/* 制作物 */}
        <h2
          className={`nav-link ${
            ["/productList", "/productpost"].includes(location.pathname) || location.pathname.startsWith("/product/")
              ? "active" 
              : ""
          }`}
          onClick={() => navigate("/productList")}
        >
          制作物
        </h2>

        {/* 質問 */}
        <h2
          className={`nav-link ${
            ["/questionList", "/questionPost"].includes(location.pathname) || location.pathname.startsWith("/question/")
              ? "active" 
              : ""
          }`}
          onClick={() => navigate("/questionList")}
        >
          質問
        </h2>
      </div>
    </header>
  );
}