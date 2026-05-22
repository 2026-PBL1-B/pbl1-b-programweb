// src/pages/ProductPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postProduct } from '../api/product'; 
import { getOrCreateTags, postProductTags } from '../api/Tag'; 
import { postProductLinks } from '../api/productLink';

import Guideheader from '../components/Header.jsx';

function ProductPost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 共通の保存処理
  const saveProductData = async (formData, isDraft) => {
    setLoading(true);

    try {
      // 1. 制作物のメインデータを送信
      const newProduct = await postProduct({
        title: formData.title, 
        content: formData.content, 
        is_public: formData.isPublic,
        is_finish: formData.isFinish,
        grade: formData.grade,
        department: formData.department
      });

      // 2. 制作物が正常に作成された場合、紐づくデータ（タグとURL）を保存する
      if (newProduct) {
        
        // --- タグの保存処理 ---
        if (formData.tags && formData.tags.length > 0) {
          const tagIds = await getOrCreateTags(formData.tags);
          if (tagIds && tagIds.length > 0) {
            await postProductTags(newProduct.id, tagIds);
          }
        }

        // --- URLの保存処理 ---
        const urlsToSave = [];

        // GitHub URL
        if (formData.githubUrl && formData.githubUrl.trim() !== '') {
          urlsToSave.push(formData.githubUrl.trim());
        }

        // 追加URL
        if (formData.additionalUrls && formData.additionalUrls.length > 0) {
          const validAdditionalUrls = formData.additionalUrls.filter(url => url && url.trim() !== '');
          urlsToSave.push(...validAdditionalUrls);
        }

        if (urlsToSave.length > 0) {
          await postProductLinks(newProduct.id, urlsToSave);
        }
      }

      alert(isDraft ? '下書きを保存しました！' : '制作物の投稿が完了しました！');
      navigate('/productList');

    } catch (error) {
      alert(isDraft ? '下書き保存中にエラーが発生しました。' : 'エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = (formData) => saveProductData(formData, false);
  const handleDraftSubmit = (formData) => saveProductData(formData, true);

  return (
    <>
      <Guideheader />
      
      <div className="post-form-wrapper">
        <PostForm 
          pageTitle="制作物を投稿する"
          titlePlaceholder="タイトルを入力してください"
          contentLabel="本文"
          contentPlaceholder="本文を入力してください"
          submitButtonText="投稿する"
          onSubmit={handleProductSubmit}
          loading={loading}
          showFinish={false}
          showGradeDepartment={true}
          showGithubUrl={true}
          showAdditionalUrls={true}
          onDraftSubmit={handleDraftSubmit} 
        />
      </div>
    </>
  );
}

export default ProductPost;
