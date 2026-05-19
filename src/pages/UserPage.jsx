import { useState,useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';// useParams追加

import { getProfileForUserID} from '../api/profile';// プロフィール情報取得用API

import { getProductsByUserId } from '../api/product';// 制作物情報取得用API
import { getProductLike } from '../api/productLike';// 制作物いいね情報取得用API

import { getQuestionsByUserId } from '../api/Question'; // 質問取得用API
import { getQuestionsLike } from '../api/questionLike';// 質問のいいね取得用API
import { getCurrentUserId } from '../api/Signin';

import { getProductTagNames, getQuestionTagNames } from '../api/Tag';
import { getUserName } from '../api/User';
import UserLink from '../components/UserLink';
import Guideheader from '../components/Header.jsx';

import "../css/UserPage.css";
import "../css/ListPage.css";

function UserPage() {

  const [userArticles, setUserArticles] = useState([]);
  // const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { user_id } = useParams(); // 追加
  const [viewType, setViewType] = useState('products'); //表示の切り替え状態
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // プロフィール情報の状態
  const [profile, setProfile] = useState({
    name: "",
    comment: "",
    grade: "",
    department: "",
    graduation_year: ""
  });

  useEffect(() => {
          const loadUserProducts = async () => {
              setIsLoading(true);
              try {
                      // 自分のプロフィールかどうかをチェック
                      const currentId = await getCurrentUserId();
                      setIsOwnProfile(currentId === user_id);

                      // プロフィール情報とユーザー名の取得
                      const [profileResult, name] = await Promise.all([
                        getProfileForUserID(user_id),
                        getUserName(user_id)
                      ]);

                      if (profileResult.success && profileResult.data) {
                        setProfile({
                          name: name || "不明なユーザー",
                          comment: profileResult.data.comment || "",
                          grade: profileResult.data.grade || "",
                          department: profileResult.data.department || "",
                          graduation_year: profileResult.data.graduation_year || ""
                        });
                      } else {
                        setProfile(prev => ({ ...prev, name: name || "不明なユーザー" }));
                      }

                      if (viewType === 'products') {
                          const products = await getProductsByUserId(user_id);  // 投稿者のプロダクト一覧取得
                          
                          if (products && products.length > 0) {
                              // 全記事のいいね数とタグを並列で取得
                              const productsWithDetails = await Promise.all(
                                  products.map(async (product) => {
                                      const [likeRes, tagNames] = await Promise.all([
                                        getProductLike(product.id),
                                        getProductTagNames(product.id)
                                      ]);
                                      return { 
                                        ...product, 
                                        likeCount: likeRes.count || 0,
                                        tags: tagNames || []
                                      };
                                  })
                              );
                              setUserArticles(productsWithDetails);
                          } else {
                              setUserArticles([]);
                          }
                      } else {
                          // 投稿者の質問一覧の取得処理
                          const questions = await getQuestionsByUserId(user_id);
                          if (questions && questions.length > 0) {
                              const questionsWithDetails = await Promise.all(
                                questions.map(async (question) => {
                                  const [likeRes, tagNames] = await Promise.all([
                                    getQuestionsLike(question.id),
                                    getQuestionTagNames(question.id)
                                  ]);
                                  return { 
                                    ...question, 
                                    likeCount: likeRes.count || 0,
                                    tags: tagNames || []
                                  };
                                })
                              );
                              setUserArticles(questionsWithDetails);
                          } else {
                              setUserArticles([]);
                          }
                      }
              } catch (error) {
                  console.error('エラー:', error);
              } finally {
                  setIsLoading(false);
              }
          };
          loadUserProducts();
      }, [viewType, user_id]); // タブを切り替えた時やuser_idが変わった時に再実行されるように変更
     

  return (
    <section className="page-container">
      <Guideheader />
      <div className="profile-container">

      {/* プロフィールヘッダー */}
      <section className="profile-header">

        <div className="profile-left">
            {/* ここにプロフィールアイコンを入れる予定 スプリント3では不要 */}
          {/* <div className="profile-icon"></div> */}

          <div className="profile-info">
            <h1>{profile.name || user_id}</h1>
           { /*<p className="userid">{user.userid}</p> */}
            <p className="bio">{profile.comment ? profile.comment : "コメントはありません。"}</p>
          </div>
        </div>

        {/*
        <button className="follow-button">
          フォロー
        </button>
        */}

      </section>

      {/* タグ */}
      {/*現時点(スプリント3)では不要 */}
      {/*<section className="tag-section">
        {user.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </section>
      */}

      {/* 学校情報 */}
      <section className="school-section">

        <div className="school-card">
          <h2>学科</h2>
          <p>{profile.department ? profile.department : "情報はありません。"}</p>
        </div>

        <div className="school-card">
          <h2>学年</h2>
          <p>{profile.grade ? profile.grade : "情報はありません。"}</p>
        </div>

        <div className="school-card">
          <h2>卒業年</h2>
          <p>{profile.graduation_year ? profile.graduation_year : "情報はありません。"}</p>
        </div>

      </section>

      {/* 編集ボタン */}
      {isOwnProfile && (
        <section className="edit-profile-section" style={{ textAlign: 'center', margin: '20px 0' }}>
          <Link to="/myprofileedit" className="edit-button" style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>
            プロフィールを編集する
          </Link>
        </section>
      )}

      {/* 活動情報 */}
      <section className="stats-section">
        {/*
        <div className="stat-card">
          <h2>{user.posts}</h2>
          <p>投稿数</p>
        </div>

        <div className="stat-card">
          <h2>{user.likes}</h2>
          <p>総いいね</p>
        </div>

        <div className="stat-card">
          <h2>{user.followers}</h2>
          <p>フォロワー</p>
        </div>
            */}  
      </section>
      
       {/* タブ切り替え */}
      <section className="tab-section">

        <button
          className={`tab-button ${viewType === "products" ? "active" : ""}`}
          onClick={() => setViewType("products")}
        >
          制作物一覧
        </button>

        <button
          className={`tab-button ${viewType === "questions" ? "active" : ""}`}
          onClick={() => setViewType("questions")}
        >
          質問一覧
        </button>

      </section>          

      {/* 制作物一覧 */}
      <section className="products-section">

        <h2 className="section-title">
          {viewType === "products" ? "制作物一覧": "質問一覧"}
        </h2>
        
        <div className="main-column" style={{ width: '100%' }}>
          {isLoading ? (
            <p>読み込み中...</p>
          ) : userArticles.length === 0 ? (
            <p className="empty-message">
              {viewType === "products" ? "制作物はまだありません。" : "質問はまだありません。"}
            </p>
          ) : (
            [...userArticles]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((article) => (
              <div key={article.id} className="item-card">
                <div className="card-meta">
                  <div>
                    <UserLink userId={user_id} userName={profile.name} prefix="@" className="author-name" />
                    <span>
                      {new Date(article.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <Link to={`/${viewType === "products" ? "product" : "question"}/${article.id}`} className="title-link">
                  <h2 className="item-title">{article.title}</h2>
                </Link>

                {article.tags && article.tags.length > 0 && (
                  <div className="tag-list">
                    {article.tags.map((tagName, index) => (
                      <span key={index} className="tag-badge">
                        {tagName}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-footer" style={{ marginTop: '10px' }}>
                  <p>❤️ {article.likeCount}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
      </section>

      </div>
    </section>
  );
}
export default UserPage;