import { useState, useEffect } from "react";
import { grades, departments } from "../domain/GradeDepartment";
import { getProfileForUserID, updateProfile } from "../api/profile";
import { getCurrentUserId } from "../api/Signin";
import { useNavigate } from "react-router-dom";
import { ClipboardSelect } from "../components/GradeDepartmentSelect";

import "../css/MyProfileEdit.css";

function MyProfile() {
  const navigate = useNavigate();

  // 仮プロフィールデータ
  const [profile, setProfile] = useState({
    name: "山田 太郎",
    userid: "@taro_creator",
    bio: "",
    grade: "",
    department: "",
    graduationYear: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const { success, data } = await getProfileForUserID(userId);
        if (success && data) {
          setProfile((prev) => ({
            ...prev,
            bio: data.comment || "",
            grade: data.grade || "",
            department: data.department || "",
            graduationYear: data.graduation_year || "",
          }));
        }
      }
    };
    fetchProfile();
  }, []);

  // 入力変更処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // ClipboardSelect用のハンドラ
  const handleDepartmentChange = (val) => setProfile({ ...profile, department: val });
  const handleGradeChange = (val) => setProfile({ ...profile, grade: val });

  // 保存ボタン
  const handleSave = async () => {
    // 自己紹介の必須入力チェック
    if (!profile.bio || profile.bio.trim() === "") {
      alert("自己紹介は必須項目です。");
      return;
    }

    console.log("保存データ:", profile);

    const result = await updateProfile({
      grade: profile.grade ? Number(profile.grade) : null,
      department: profile.department,
      graduation_year: profile.graduationYear ? Number(profile.graduationYear) : null,
      comment: profile.bio,
    });

    if (result.success) {
      alert("プロフィールを保存しました！");
      const userId = await getCurrentUserId();
      navigate(`/userpage/${userId}`);
    } else {
      alert("プロフィールの保存に失敗しました: " + result.error);
    }
  };

  return (
    <div className="myprofile-container">

      {/* タイトル */}
      <div className="myprofile-header">
        <h1>プロフィール設定</h1>
        <p>プロフィール情報を編集できます。</p>
      </div>

      {/* プロフィールカード（ノート風デザイン） */}
      <div className="profile-card notebook-paper">

        {/* アイコン（元のままコメントアウト） */}
        {/*
        <div className="icon-section">
          <div className="profile-icon">
            <span>👤</span>
          </div>
          <button className="icon-button">
            アイコン変更
          </button>
        </div>
        */}

        {/* 名前（元のままコメントアウト） */}
        {/*
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

        {/* ユーザーID（元のままコメントアウト） */}
        {/*
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
        
        {/* 学科 */}
        <div className="form-group">
          <label>学科</label>
          <ClipboardSelect
            value={profile.department}
            onChange={handleDepartmentChange}
            options={departments.map(d => ({ value: d, label: d }))}
            placeholder="選択してください"
          />
        </div>
        
        {/* 学年 */}
        <div className="form-group">
          <label>学年</label>
          <ClipboardSelect
            value={profile.grade}
            onChange={handleGradeChange}
            options={grades}
            placeholder="選択してください"
          />
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