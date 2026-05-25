// src/pages/QuestionPost.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postQuestion, getQuestionById } from '../api/Question'; 
import { getOrCreateTags, postQuestionTags, getQuestionTagNames } from '../api/Tag'; 

import Guidheader from "../components/Header";

function QuestionPost() {
	const [loading, setLoading] = useState(false);
	const [initialData, setInitialData] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [isInitialDataLoading, setIsInitialDataLoading] = useState(!!id);

	useEffect(() => {
		const loadDraft = async () => {
			if (id) {
				setIsInitialDataLoading(true);
				const res = await getQuestionById(id);
				if (res.success && res.data) {
					const tags = await getQuestionTagNames(id);
					setInitialData({
						title: res.data.title || "",
						content: res.data.content || "",
						isPublic: res.data.is_public !== false,
						isFinish: res.data.is_finish || false,
						grade: res.data.grade || "",
						department: res.data.department || "",
						tags: tags || []
					});
				}
				setIsInitialDataLoading(false);
			}
		};
		loadDraft();
	}, [id]);

	// 共通の保存処理
	const saveQuestionData = async (formData, isDraft) => {
		setLoading(true);

		try {
			// 1. 質問のメインデータを送信
			const newQuestion = await postQuestion({
				id: id || undefined,
				title: formData.title, 
				content: formData.content, 
				is_public: formData.isPublic,
				is_finish: isDraft ? false : true,
				is_open: true,
				grade: formData.grade,
				department: formData.department
			});
			
			// 2. 質問が正常に作成された場合、タグの保存処理
			if (newQuestion) {
				if (formData.tags && formData.tags.length > 0) {
					const tagIds = await getOrCreateTags(formData.tags);
					
					if (tagIds && tagIds.length > 0) {
						await postQuestionTags(newQuestion.id, tagIds);
					}
				} else {
					await postQuestionTags(newQuestion.id, []);
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
			{isInitialDataLoading ? (
				<p style={{ padding: '0 40px' }}>読み込み中...</p>
			) : (
				<PostForm 
					key={id || "new"}
					titlePlaceholder="質問のタイトルを入力してください"
					contentLabel="質問内容"
					contentPlaceholder="困っていることや試したことを詳しく入力してください"
					submitButtonText="投稿する"
					onSubmit={handleQuestionSubmit}
					loading={loading}
					showFinish={false}
					showGradeDepartment={true}
					onDraftSubmit={handleDraftSubmit}
					initialData={initialData}
				/>
			)}
		</div>
		</>
	);
}

export default QuestionPost;
