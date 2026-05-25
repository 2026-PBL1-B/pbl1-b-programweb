// src/pages/ProductPost.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postProduct, getProductById } from '../api/product'; 
import { getOrCreateTags, postProductTags, getProductTagNames } from '../api/Tag'; 
import { postProductLinks, getProductLinks } from '../api/productLink';

import Guideheader from '../components/Header.jsx';

function ProductPost() {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadDraft = async () => {
      if (id) {
        const res = await getProductById(id);
        if (res.success && res.data) {
          const tags = await getProductTagNames(id);
          const links = await getProductLinks(id);
          
          let githubUrl = "";
          let additionalUrls = [];
          
          if (links && links.length > 0) {
            // Assume the first github.com link is githubUrl, others are additional
            const githubIndex = links.findIndex(url => url.includes('github.com'));
            if (githubIndex !== -1) {
              githubUrl = links[githubIndex];
              additionalUrls = links.filter((_, i) => i !== githubIndex);
            } else {
              additionalUrls = links;
            }
          }

          setInitialData({
            title: res.data.title || "",
            content: res.data.content || "",
            isPublic: res.data.is_public !== false,
            isFinish: res.data.is_finish || false,
            grade: res.data.grade || "",
            department: res.data.department || "",
            tags: tags || [],
            githubUrl,
            additionalUrls
          });
        }
      }
    };
    loadDraft();
  }, [id]);

  // 共通の保存処理
  const saveProductData = async (formData, isDraft) => {
    setLoading(true);

    try {
      // 1. 制作物のメインデータを送信
      const newProduct = await postProduct({
        id: id || undefined,
        title: formData.title, 
        content: formData.content, 
        is_public: formData.isPublic,
        is_finish: isDraft ? false : true,
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
        } else {
          // タグが空になった場合も既存のタグを消去するよう呼び出す
          await postProductTags(newProduct.id, []);
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

        // URLが空の場合も呼び出して削除させる
        await postProductLinks(newProduct.id, urlsToSave);
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
          initialData={initialData}
        />
      </div>
    </>
  );
}

export default ProductPost;
