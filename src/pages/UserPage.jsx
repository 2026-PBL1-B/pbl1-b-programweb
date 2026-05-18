import { useState,useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';// useParams追加

import { getProfileForUserID} from '../api/profile';// プロフィール情報取得用API

import { getProductsByUserId } from '../api/product';// 制作物情報取得用API
import { getProductLike } from '../api/productLike';// 制作物いいね情報取得用API

import { getQuestionsByUserId } from '../api/Question'; // 質問取得用API
import { getQuestionsLike } from '../api/questionLike';// 質問のいいね取得用API

import "../css/UserPage.css";

function UserPage() {

  const [userArticles, setUserArticles] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { user_id } = useParams(); // 追加
  const [viewType, setViewType] = useState('products'); //表示の切り替え状態
  
  // プロフィール情報の状態
  const [profile, setProfile] = useState({
    comment: "",
    grade: "",
    department: "",
    graduation_year: ""
  });

  useEffect(() => {
          const loadUserProducts = async () => {
              setIsLoading(true);
              try {
                      // プロフィール情報の取得
                      const profileResult = await getProfileForUserID(user_id);
                      if (profileResult.success && profileResult.data) {
                        setProfile({
                          comment: profileResult.data.comment || "",
                          grade: profileResult.data.grade || "",
                          department: profileResult.data.department || "",
                          graduation_year: profileResult.data.graduation_year || ""
                        });
                      }

                      if (viewType === 'products') {
                          const products = await getProductsByUserId(user_id);  // 投稿者のプロダクト一覧取得
                          
                          if (products && products.length > 0) {
                              // Promise.allを使って、全記事のいいね数を並列で取得
                              const productsWithLikes = await Promise.all(
                                  products.map(async (product) => {
                                      // user_idは渡さず、その投稿に対する全体のいいね数を取得する
                                      const { count } = await getProductLike(product.id);
                                      // 元のデータに likeCount プロパティを追加
                                      return { ...product, likeCount: count || 0 };
                                  })
                              );
                              setUserArticles(productsWithLikes);
                          } else {
                              setUserArticles([]);
                          }
                      } else {
                          // 投稿者の質問一覧の取得処理
                          const questions = await getQuestionsByUserId(user_id);
                          if (questions && questions.length > 0) {
                              const questionsWithLikes = await Promise.all(
                                questions.map(async (question) => {
                                  const { count } = await getQuestionsLike(question.id);
                                  return { 
                                    ...question, 
                                    created_at: question.updated_at || question.created_at,
                                    likeCount: count || 0
                                  };
                                })
                              );
                              setUserArticles(questionsWithLikes);
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
    <div className="profile-container">

      {/* プロフィールヘッダー */}
      <section className="profile-header">

        <div className="profile-left">
          <div className="profile-icon"></div>

          <div className="profile-info">
            <h1>{user_id}</h1>
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
          <h2>学年</h2>
          <p>{profile.grade ? profile.grade : "情報はありません。"}</p>
        </div>

        <div className="school-card">
          <h2>学科</h2>
          <p>{profile.department ? profile.department : "情報はありません。"}</p>
        </div>

        <div className="school-card">
          <h2>卒業年</h2>
          <p>{profile.graduation_year ? profile.graduation_year : "情報はありません。"}</p>
        </div>

      </section>
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
        
        {viewType === "products" ? (

          <div className="product-grid">

          {userArticles.length === 0 ? (
            <p className="empty-message">
              投稿はまだありません。
            </p>
          ) :(
            userArticles.map((product) => (

            <div key={product.id} className="product-card">

              

              <div className="product-content">
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{product.title}</h3>
                </Link>
                <p>❤️ {product.likeCount}</p>
              </div>

            </div>

          ))
        )}
      
        </div>
      ) : (
        <div className="question-list">

            {userArticles.length === 0 ? (
              <p className="empty-message">
                質問はまだありません。
              </p>
            ) : (
              // userArticles
              userArticles.map((question) => (
                <div key={question.id} className="question-card">
                  <Link to={`/questions/${question.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{question.title}</h3>
                  </Link>
                  <p>❤️ {question.likeCount}</p>
                </div>
              ))
            )}

          </div>
        )}
        
      </section>

    </div>
  );
}
export default UserPage;