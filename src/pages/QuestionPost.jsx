// src/pages/QuestionPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postQuestion } from '../api/Question'; 
// ↓ 新しく Tag.js の関数を読み込みます（パスは Tag.js の実際の場所に合わせてください）
import { getOrCreateTags, postQuestionTags } from '../api/Tag'; 

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
				formData.isFinish
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
			// ※投稿成功後の画面遷移などをここに書くと良いでしょう
			navigate('/questionList');

		} catch (error) {
			alert('投稿中にエラーが発生しました。');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
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
			/>
		</div>
	);
}

export default QuestionPost;