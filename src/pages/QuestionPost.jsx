// src/pages/QuestionPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postQuestion } from '../api/Question'; 
import { getOrCreateTags, postQuestionTags } from '../api/Tag'; 

import Guidheader from "../components/Header";

function QuestionPost() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleQuestionSubmit = async (formData) => {
		setLoading(true);

		try {
			// 1. 質問のメインデータを送信し、結果（newQuestion）を受け取る
			const newQuestion = await postQuestion(
				formData.title, 
				formData.content, 
				formData.isPublic, 
				formData.isFinish,
				formData.grade,
				formData.department
			);
			
			// 2. 質問が正常に作成され、かつ入力されたタグがある場合
			if (newQuestion && formData.tags && formData.tags.length > 0) {
				// タグIDの配列を取得（なければ作成される）
				const tagIds = await getOrCreateTags(formData.tags);
				
				// 3. 質問ID(newQuestion.id)とタグIDを紐付ける
				if (tagIds && tagIds.length > 0) {
					await postQuestionTags(newQuestion.id, tagIds);
				}
			}

			alert('質問の投稿とタグの保存が完了しました！');
			navigate('/questionList');

		} catch (error) {
			alert('投稿中にエラーが発生しました。');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// 下書き保存用の処理
const handleDraftSubmit = async (formData) => {
	setLoading(true);

	try {
	  // 1. 公開フラグを false（下書き）にして送信
	  const newQuestion = await postQuestion(
		formData.title, 
		formData.content, 
		false,
		formData.isFinish,
		formData.grade,
		formData.department
	  );

	  // 2. タグの紐付け
	  if (newQuestion && formData.tags && formData.tags.length > 0) {
		const tagIds = await getOrCreateTags(formData.tags);
		if (tagIds && tagIds.length > 0) {
		  await postQuestionTags(newQuestion.id, tagIds);
		}
	  }

	  alert('下書きを保存しました！');
	  navigate('/questionList');

	} catch (error) {
	  alert('下書き保存中にエラーが発生しました。');
	  console.error(error);
	} finally {
	  setLoading(false);
	}
  };

	return (
		<>
			<Guidheader />

		<div>
			<h1 style={{ padding: '0 40px', margin: 0, paddingTop: '40px' }}>
				質問を投稿する
			</h1>
			<PostForm 
				titlePlaceholder="質問のタイトルを入力してください"
				contentLabel="質問内容"
				contentPlaceholder="困っていることや試したことを詳しく入力してください"
				submitButtonText="質問を投稿する"
				onSubmit={handleQuestionSubmit}
				loading={loading}
				showFinish={false}
				showGradeDepartment={true}
				onDraftSubmit={handleDraftSubmit}
			/>

	
		</div>
		</>
	);
}

export default QuestionPost;