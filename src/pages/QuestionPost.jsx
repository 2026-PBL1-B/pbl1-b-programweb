import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/QuestionPost.css';
import { postQuestion } from '../api/Question'; 

function QuestionPost() {
	const [questionTitle, setQuestionTitle] = useState("");
	const [questionTags, setQuestionTags] = useState("");
	const [questionContent, setQuestionContent] = useState("");
	const [mode, setMode] = useState("edit"); // edit | preview | split

	const [isPublic, setIsPublic] = useState(true);
	const [isFinish, setIsFinish] = useState(false);
	const [loading, setLoading] = useState(false);

	// プレビュー用のタグ配列
	const tagList = questionTags.split(",").slice(0, 5);

	// フォーム送信関数
	const handleSubmit = async (e) => {
		e.preventDefault(); // 画面が勝手に再読み込みされるのを防ぎます

		if (!questionTitle || !questionContent) {
			alert("質問のタイトルと本文を入力してください。");
			return;
		}

		setLoading(true);

		try {
			// Question.js の関数を呼び出してデータを送信
			await postQuestion(questionTitle, questionContent, isPublic, isFinish);
			
			alert('質問の投稿が完了しました！');
			
			// 入力欄をリセット
			setQuestionTitle('');
			setQuestionTags('');
			setQuestionContent('');
			setIsPublic(true);
			setIsFinish(false);
		} catch (error) {
			alert('投稿中にエラーが発生しました。');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container">
			<h1>質問を投稿する</h1>

			{/* 全体をformタグで囲み、送信時にhandleSubmit */}
			<form onSubmit={handleSubmit}>
				{/* タイトル入力 */}
				<input
					className="title"
					type="text"
					placeholder="質問のタイトルを入力してください"
					value={questionTitle}
					onChange={(e) => setQuestionTitle(e.target.value)}
					required // 入力必須にする属性
				/>

				{/* タグ入力（簡易的な文字列入力） */}
				<input
					className="tags"
					type="text"
					placeholder="タグをカンマ区切りで入力（例: React, JavaScript）"
					value={questionTags}
					onChange={(e) => setQuestionTags(e.target.value)}
				/>

				{/* 本文ヘッダー */}
				<div className="content-header">
					<h2>質問内容</h2>
					{/* ボタンを押したときにフォームが送信されないよう type="button" を追加 */}
					<div className="mode-buttons">
						<button type="button" onClick={() => setMode("edit")}>編集</button>
						<button type="button" onClick={() => setMode("split")}>分割</button>
						<button type="button" onClick={() => setMode("preview")}>プレビュー</button>
					</div>
				</div>

				{/* 本文エリア */}
				<div className={`content-area ${mode}`}>
					
					{/* 編集モード */}
					{(mode === "edit" || mode === "split") && (
						<textarea
							className="editor"
							placeholder="困っていることや試したことを詳しく入力してください"
							value={questionContent}
							onChange={(e) => setQuestionContent(e.target.value)}
							required // 入力必須にする属性
						/>
					)}

					{/* プレビューモード */}
					{(mode === "preview" || mode === "split") && (
						<div className="preview">
							<h3>{questionTitle || "質問タイトル"}</h3>

							<div className="tag-list">
								{tagList.map((tag, i) => (
									tag.trim() && <span key={i} className="tag">#{tag.trim()}</span>
								))}
							</div>

							<p style={{ whiteSpace: 'pre-wrap' }}>
								{questionContent || "質問本文がここに表示されます"}
							</p>
						</div>
					)}
				</div>

				{/* 投稿オプション */}
				<div className="post-options" style={{ marginTop: '20px', padding: '10px 0' }}>
					<label style={{ marginRight: '15px', cursor: 'pointer' }}>
						<input 
							type="checkbox" 
							checked={isPublic} 
							onChange={(e) => setIsPublic(e.target.checked)} 
						/> 質問を公開する
					</label>
					<label style={{ cursor: 'pointer' }}>
						<input 
							type="checkbox" 
							checked={isFinish} 
							onChange={(e) => setIsFinish(e.target.checked)} 
						/> 解決済みとして投稿
					</label>
				</div>

				<div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
					{/* フォームを送信するためのボタン */}
					<button 
						type="submit" 
						disabled={loading}
						style={{ padding: '10px 30px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
					>
						{loading ? '投稿中...' : '質問を投稿する'}
					</button>

					<Link to="/questionlist" style={{ color: 'var(--text)', textDecoration: 'none' }}>
						キャンセルして戻る
					</Link>
				</div>
			</form>
		</div>
	);
}

export default QuestionPost;