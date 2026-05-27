// src/components/Header.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUserId } from "../api/Signin"
import { getProfileAvatarUrl } from "../api/profile";
import '../css/Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  // 初期値をsessionStorageから取得し、画面遷移時のチラつきを防ぐ
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return sessionStorage.getItem("userAvatarUrl") || "";
  });

  useEffect(() => {
    const fetchAvatar = async () => {
      // すでにセッションにデータがある場合はAPIを叩かない
      if (sessionStorage.getItem("userAvatarUrl")) {
        return;
      }

      const userId = await getCurrentUserId();
      if (userId) {
        const url = await getProfileAvatarUrl(userId);
        if (url) {
          setAvatarUrl(url);
          sessionStorage.setItem("userAvatarUrl", url); // 取得したURLをセッションに保存
        }
      }
    };
    fetchAvatar();
  }, []);

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
      <h1 className="service-name" onClick={() => navigate("/home")}>
        KD-Board
      </h1>
      <button
        className="account-button"
        onClick={handleAccountClick}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Account" className="avatar-image" />
        ) : (
          "👤"
        )}
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