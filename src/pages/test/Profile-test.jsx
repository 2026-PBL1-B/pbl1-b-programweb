import React, { useState, useEffect } from 'react';
import { supabase } from '../../spabase'; // パスは環境に合わせて調整してください
import { getMyProfile, updateProfile } from '../../api/profile';

const ProfileTest = () => {
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  // フォームの入力状態を管理
  const [formData, setFormData] = useState({
    avatar_url: '',
    grade: '',
    department: '',
    graduation_year: '',
    comment: ''
  });

  // コンポーネントマウント時にログインユーザーを取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setStatusMessage('ログインしていません。Supabaseの認証が必要です。');
      }
    };
    fetchUser();
  }, []);

  // 入力値の変更をハンドリング
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // プロフィール取得のテスト
  const handleGetProfile = async () => {
    if (!userId) return;
    setStatusMessage('プロフィールを取得中...');
    
    const result = await getMyProfile(userId);
    
    if (result.success) {
      setProfileData(result.data);
      setStatusMessage('プロフィール取得成功！');
    } else {
      setProfileData(null);
      setStatusMessage(`取得失敗: ${result.error}`);
    }
  };

  // プロフィール更新のテスト
  const handleUpdateProfile = async () => {
    setStatusMessage('プロフィールを更新中...');
    
    // 空文字の入力は未定義(undefined)として扱い、更新対象から外すための処理
    const updateData = {};
    if (formData.avatar_url !== '') updateData.avatar_url = formData.avatar_url;
    if (formData.grade !== '') updateData.grade = parseInt(formData.grade, 10);
    if (formData.department !== '') updateData.department = formData.department;
    if (formData.graduation_year !== '') updateData.graduation_year = parseInt(formData.graduation_year, 10);
    if (formData.comment !== '') updateData.comment = formData.comment;

    // もし何も入力されていなければアラート
    if (Object.keys(updateData).length === 0) {
      setStatusMessage('更新する項目が入力されていません。');
      return;
    }

    const result = await updateProfile(updateData);
    
    if (result.success) {
      setStatusMessage('プロフィール更新成功！');
      // 更新成功後に最新のデータを再取得して表示
      handleGetProfile();
      // フォームをリセット
      setFormData({ avatar_url: '', grade: '', department: '', graduation_year: '', comment: '' });
    } else {
      setStatusMessage(`更新失敗: ${result.error}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>プロフィール機能 テストページ</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <strong>ステータス:</strong> {statusMessage}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>1. プロフィールの取得 (getMyProfile)</h3>
        <button onClick={handleGetProfile} disabled={!userId} style={{ padding: '8px 16px' }}>
          自分のプロフィールを取得する
        </button>
        
        {profileData && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <pre>{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>2. プロフィールの保存・更新 (updateProfile)</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
          更新したい項目だけ入力してください（空欄の項目は更新されず、元の値が保持されます）。<br/>
          データが存在しない場合は新規作成（Upsert）されます。
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block' }}>アイコンURL (avatar_url):</label>
            <input type="text" name="avatar_url" value={formData.avatar_url} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block' }}>学年 (grade):</label>
            <input type="number" name="grade" value={formData.grade} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block' }}>学部 (department):</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block' }}>卒業年 (graduation_year):</label>
            <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block' }}>コメント (comment):</label>
            <textarea name="comment" value={formData.comment} onChange={handleChange} rows="3" style={{ width: '100%' }} />
          </div>
        </div>

        <button onClick={handleUpdateProfile} disabled={!userId} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          入力した項目のみ更新する
        </button>
      </div>
    </div>
  );
};

export default ProfileTest;