// src/pages/ProductPost.jsx
import { useState } from 'react';
import PostForm from '../components/PostForm'; // 作成した共通コンポーネントを読み込む
import { postProduct } from '../api/product'; 

// import '../css/ProductPost.css'  ←現在使わなくなったのでインポートしていません

function ProductPost() {
  const [loading, setLoading] = useState(false);

  // 共通コンポーネントの「投稿」ボタンが押されたときに呼ばれる関数
  const handleProductSubmit = async (formData) => {
    // formDataの中には、PostFormで入力された { title, content, tags, isPublic, isFinish } が入ってきます
    setLoading(true);

    try {
      await postProduct(formData.title, formData.content, formData.isPublic, formData.isFinish);
      alert('投稿が完了しました！');
      // ※投稿成功後の画面遷移（ページ移動）などをここに書くと良いでしょう
    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 共通のPostFormを呼び出し、文言や関数を渡す */}
      <PostForm 
        titlePlaceholder="タイトルを入力してください"
        contentLabel="本文"
        contentPlaceholder="本文を入力"
        submitButtonText="投稿する"
        onSubmit={handleProductSubmit}
        loading={loading}
      />
    </div>
  );
}

export default ProductPost;