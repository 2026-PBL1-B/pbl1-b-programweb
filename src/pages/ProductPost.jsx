// src/pages/ProductPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postProduct } from '../api/product'; 
import { getOrCreateTags, postProductTags } from '../api/Tag'; 
import { postProductLinks } from '../api/productLink';  // productLink.js から URL保存用の関数をインポート

import Guideheader from '../components/Header.jsx';

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

      // 2. 制作物が正常に作成された場合、紐づくデータ（タグとURL）を保存する
      if (newProduct) {
        
        // --- タグの保存処理 ---
        if (formData.tags && formData.tags.length > 0) {
          const tagIds = await getOrCreateTags(formData.tags);
          if (tagIds && tagIds.length > 0) {
            await postProductTags(newProduct.id, tagIds);
          }
        }

        // --- 🌟追加: URLの保存処理 ---
        const urlsToSave = []; // 保存するURLをまとめる空の配列を準備

        // ① GitHub URLが入力されていれば配列に追加
        if (formData.githubUrl && formData.githubUrl.trim() !== '') {
          urlsToSave.push(formData.githubUrl.trim());
        }

        // ② 追加URLの配列があれば、中身が空のものを除外して配列に追加
        if (formData.additionalUrls && formData.additionalUrls.length > 0) {
          const validAdditionalUrls = formData.additionalUrls.filter(url => url && url.trim() !== '');
          urlsToSave.push(...validAdditionalUrls); // 配列を展開して追加
        }

        // ③ まとめた配列に1つでもURLが入っていれば保存関数を呼び出す
        if (urlsToSave.length > 0) {
          await postProductLinks(newProduct.id, urlsToSave);
        }
      }

      alert('制作物の投稿が完了しました！');
      navigate('/productList');

    } catch (error) {
      alert('エラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 下書き保存用の処理
  // PostFormから現在の入力値を受け取り、公開フラグ(isPublic)を強制的に false にして保存
  const handleDraftSubmit = async (formData) => {
    setLoading(true);

    try {
      // 1. 公開フラグを false（下書き）にして送信
      const newProduct = await postProduct(
        formData.title, 
        formData.content, 
        false,
        formData.isFinish,
        formData.grade,
        formData.department
      );

      // 2. 制作物が正常に作成された場合、紐づくデータ（タグとURL）を保存する
      if (newProduct) {
        
        // --- タグの保存処理 ---
        if (formData.tags && formData.tags.length > 0) {
          const tagIds = await getOrCreateTags(formData.tags);
          if (tagIds && tagIds.length > 0) {
            await postProductTags(newProduct.id, tagIds);
          }
        }

        // --- 🌟 URLの保存処理を追加 ---
        const urlsToSave = [];
        if (formData.githubUrl && formData.githubUrl.trim() !== '') {
          urlsToSave.push(formData.githubUrl.trim());
        }

        if (formData.additionalUrls && formData.additionalUrls.length > 0) {
          const validAdditionalUrls = formData.additionalUrls.filter(url => url && url.trim() !== '');
          urlsToSave.push(...validAdditionalUrls);
        }

        if (urlsToSave.length > 0) {
          await postProductLinks(newProduct.id, urlsToSave);
        }
      }

      alert('下書きを保存しました！');
      navigate('/productList');

    } catch (error) {
      alert('下書き保存中にエラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          showGithubUrl={true}       // GithubのURL機能をオン
          showAdditionalUrls={true}  // 追加URL機能をオン
          onDraftSubmit={handleDraftSubmit} 
        />
      </div>
    </>
  );
}

export default ProductPost;