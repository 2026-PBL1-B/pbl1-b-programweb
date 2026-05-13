import { useState } from 'react';
import PostForm from '../components/PostForm'; // 共通コンポーネントを読み込む
import { postQuestion } from '../api/Question'; 

// import '../css/QuestionPost.css'  ←現在使わなくなったのでインポートしていません

function QuestionPost() {
	const [loading, setLoading] = useState(false);

	// 共通コンポーネントの「投稿」ボタンが押されたときに呼ばれる関数
	const handleQuestionSubmit = async (formData) => {
		// formDataの中には { title, content, tags, isPublic, isFinish } が入ってきます
		setLoading(true);

		try {
		// Question.js の関数を呼び出してデータを送信
		await postQuestion(formData.title, formData.content, formData.isPublic, formData.isFinish);
		
		alert('質問の投稿が完了しました！');
		
		// ※投稿成功後の画面遷移などをここに書くと良いでしょう
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
		{/* 共通のPostFormを呼び出し、質問用の文言や関数を渡す */}
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