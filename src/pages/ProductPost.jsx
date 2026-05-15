// src/pages/ProductPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postProduct } from '../api/product'; 
// ↓ 新しく Tag.js の関数を読み込みます
import { getOrCreateTags, postProductTags } from '../api/Tag'; 

function ProductPost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProductSubmit = async (formData) => {
    setLoading(true);

    try {
      // 1. 制作物のメインデータを送信し、結果（newProduct）を受け取る
      const newProduct = await postProduct(
        formData.title, 
        formData.content, 
        formData.isPublic, 
        formData.isFinish,
        formData.grade,
				formData.department
      );

      // 2. 制作物が正常に作成され、かつ入力されたタグがある場合
      if (newProduct && formData.tags && formData.tags.length > 0) {
        // タグIDの配列を取得（なければ作成される）
        const tagIds = await getOrCreateTags(formData.tags);
        
        // 3. 制作物ID(newProduct.id)とタグIDを紐付ける
        if (tagIds && tagIds.length > 0) {
          await postProductTags(newProduct.id, tagIds);
        }
      }

      alert('制作物の投稿とタグの保存が完了しました！');
      // ※投稿成功後の画面遷移（ページ移動）などをここに書くと良いでしょう
      navigate('/productList');

    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ padding: '0 40px', margin: 0, paddingTop: '40px' }}>
			制作物を投稿する
		</h1>
      <PostForm 
        titlePlaceholder="タイトルを入力してください"
        contentLabel="本文"
        contentPlaceholder="本文を入力"
        submitButtonText="投稿する"
        onSubmit={handleProductSubmit}
        loading={loading}
        showGradeDepartment={true}
      />
    </div>
  );
}

export default ProductPost;