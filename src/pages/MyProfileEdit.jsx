import { useState } from "react";
import { grades,departments } from "../domain/GradeDepartment";


import "../css/MyProfileEdit.css";

function MyProfile() {

  // 仮プロフィールデータ
  const [profile, setProfile] = useState({
    name: "山田 太郎",
    userid: "@taro_creator",
    bio: "ReactやUIデザインを中心に制作しています。",
    grade: "",
    department: "",
    graduationYear: "",
  });

  // 入力変更処理
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // 保存ボタン
  const handleSave = () => {
    console.log("保存データ:", profile);

    // ここでSupabase更新など
    alert("プロフィールを保存しました！");
  };

  return (
    <div className="myprofile-container">

      {/* タイトル */}
      <div className="myprofile-header">
        <h1>プロフィール設定</h1>
        <p>プロフィール情報を編集できます。</p>
      </div>

      {/* プロフィールカード */}
      <div className="profile-card">

        {/* アイコン */}
        {/*}
        <div className="icon-section">

          <div className="profile-icon">
            <span>👤</span>
          </div>

          <button className="icon-button">
            アイコン変更
          </button>

        </div>
        */}

        {/* 名前 
        <div className="form-group">
          <label>名前</label>

          <input
            type="text"
            name="name"
            value={profile.name}
            disabled
          />
        </div>
        */}

        {/* ユーザーID
        <div className="form-group">
          <label>ユーザーID</label>

          <input
            type="text"
            name="userid"
            value={profile.userid}
            disabled
          />
        </div>
         */}

        {/* 自己紹介 */}
        <div className="form-group">
          <label>自己紹介</label>

          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="自己紹介を入力"
            rows="5"
          />
        </div>

        {/* 学年 */}
        <div className="form-group">
          <label>学年</label>

          <select
            name="grade"
            value={profile.grade}
            onChange={handleChange}
          >
            <option value="">選択してください</option>
            {grades.map((grade, index) => (
              <option
                key={grade.value}
                value={index.value}
              >
                {grade.label}
            </option>
               ))}
          </select>

        </div>

        {/* 学科 */}
        <div className="form-group">
          <label>学科</label>

          <select
            name="department"
            value={profile.department}
            onChange={handleChange}
          >
            <option value="">
              選択してください
            </option>

            {departments.map((department, index) => (

            <option
                key={department.value}
                value={index.value}
            >
              {department}
            </option>

            ))}

        </select>
        </div>

        {/* 卒業年 */}
        <div className="form-group">
          <label>卒業年</label>

          <input
            type="number"
            name="graduationYear"
            value={profile.graduationYear}
            onChange={handleChange}
            placeholder="2028"
          />
        </div>

        {/* 保存ボタン */}
        <button
          className="save-button"
          onClick={handleSave}
        >
          保存する
        </button>

      </div>
    </div>
  );
}

export default MyProfile;