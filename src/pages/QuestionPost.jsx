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

	// 共通の保存処理
	const saveQuestionData = async (formData, isDraft) => {
		setLoading(true);

		try {
			// 1. 質問のメインデータを送信
			const newQuestion = await postQuestion({
				title: formData.title, 
				content: formData.content, 
				is_public: formData.isPublic,
				is_finish: isDraft ? false : true,
				is_open: false,
				grade: formData.grade,
				department: formData.department
			});
			
			// 2. 質問が正常に作成され、かつ入力されたタグがある場合
			if (newQuestion && formData.tags && formData.tags.length > 0) {
				const tagIds = await getOrCreateTags(formData.tags);
				
				if (tagIds && tagIds.length > 0) {
					await postQuestionTags(newQuestion.id, tagIds);
				}
			}

			alert(isDraft ? '下書きを保存しました！' : '質問の投稿が完了しました！');
			navigate('/questionList');

		} catch (error) {
			alert(isDraft ? '下書き保存中にエラーが発生しました。' : '投稿中にエラーが発生しました。');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleQuestionSubmit = (formData) => saveQuestionData(formData, false);
	const handleDraftSubmit = (formData) => saveQuestionData(formData, true);

	return (
		<>
			<Guidheader />

		<div>
			<h1 style={{ padding: '0 40px', margin: 0, paddingTop: '40px' }}>
				投稿する
			</h1>
			<PostForm 
				titlePlaceholder="質問のタイトルを入力してください"
				contentLabel="質問内容"
				contentPlaceholder="困っていることや試したことを詳しく入力してください"
				submitButtonText="投稿する"
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
