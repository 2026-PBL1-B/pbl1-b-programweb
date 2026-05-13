// src/components/PostForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Post.css';

function PostForm({ 
    titlePlaceholder = "タイトルを入力してください",
    contentLabel = "本文",
    contentPlaceholder = "本文を入力してください",
    submitButtonText = "投稿する",
    onSubmit,
    loading = false,
    showCancel = false,
    cancelLink = "/",
    showFinish = true // 完成済みチェックボックス
}) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [content, setContent] = useState("");
    const [mode, setMode] = useState("edit");
    const [isPublic, setIsPublic] = useState(true);
    const [isFinish, setIsFinish] = useState(false);

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag !== "" && !tags.includes(newTag) && tags.length < 5) {
                setTags([...tags, newTag]);
                setTagInput("");
            }
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmitClick = (e) => {
        if (e) e.preventDefault();
        if (!title || !content) {
            alert("タイトルと本文を入力してください。");
            return;
        }
        onSubmit({ title, content, tags, isPublic, isFinish });
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmitClick}>
                <input
                    className="title"
                    type="text"
                    placeholder={titlePlaceholder}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="tags-container">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-badge">
                            #{tag}
                            <button type="button" onClick={() => removeTag(index)}>×</button>
                        </span>
                    ))}
                    {tags.length < 5 && (
                        <input
                            className="tag-input"
                            type="text"
                            placeholder={tags.length === 0 ? "タグを入力（Enterで確定）" : ""}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>

                <div className="content-header" style={{ marginTop: '20px' }}>
                    <h2>{contentLabel}</h2>
                    <div className="mode-buttons">
                        <button type="button" onClick={() => setMode("edit")}>編集</button>
                        <button type="button" onClick={() => setMode("split")}>両方</button>
                        <button type="button" onClick={() => setMode("preview")}>プレビュー</button>
                    </div>
                </div>

                <div className={`content-area ${mode}`}>
                    {(mode === "edit" || mode === "split") && (
                        <textarea
                            className="editor"
                            placeholder={contentPlaceholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}

                    {(mode === "preview" || mode === "split") && (
                        <div className="preview">
                            <h3>{title || "タイトル"}</h3>
                            <div className="tag-list">
                                {tags.map((tag, i) => (
                                    <span key={i} className="tag">#{tag}</span>
                                ))}
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{content || "本文がここに表示されます"}</p>
                        </div>
                    )}
                </div>

                <div className="post-options" style={{ marginTop: '20px', padding: '10px 0' }}>
                    <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> 公開する
                    </label>
                    
                    {/* 完成済みチェックボックス */}
                    {showFinish && (
                        <label style={{ cursor: 'pointer' }}>
                            <input type="checkbox" checked={isFinish} onChange={(e) => setIsFinish(e.target.checked)} /> 完成済み
                        </label>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '10px 30px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {loading ? '送信中...' : submitButtonText}
                    </button>
                    
                    {/* ProductList または QuestionList の対応する画面に戻る */}
                    {showCancel && <Link to={cancelLink}>キャンセルして戻る</Link>}
                </div>
            </form>
        </div>
    );
}

export default PostForm;