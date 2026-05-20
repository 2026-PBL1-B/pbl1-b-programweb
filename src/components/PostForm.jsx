// src/components/PostForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GradeDepartmentSelect from './GradeDepartmentSelect';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useRef } from "react";
import '../css/Post.css';

function PostForm({ 
    pageTitle, // 🌟追加: ページの一番上に表示するタイトルを受け取れるようにします
    titlePlaceholder = "タイトルを入力してください",
    contentLabel = "本文",
    contentPlaceholder = "本文を入力してください",
    submitButtonText = "投稿する",
    onSubmit,
    loading = false,
    showFinish = true, // 完成済みチェックボックス
    showGradeDepartment = false
}) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [content, setContent] = useState("");
    const [mode, setMode] = useState("edit");

    // 公開,完成の変数
    const [isPublic, setIsPublic] = useState(true);
    const [isFinish, setIsFinish] = useState(false);

    // 学年と学科の状態を管理する変数
    const [grade, setGrade] = useState(""); 
    const [department, setDepartment] = useState("");

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

const inputRef = useRef(null);

const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const markdownImage = `![画像](${url})\n`;
    setContent((prev) => prev + markdownImage);  // 本文に画像を追加
  }
};

    const handleSubmitClick = (e) => {
        if (e) e.preventDefault();
        if (!title || !content) {
            alert("タイトルと本文を入力してください。");
            return;
        }
        onSubmit({ title, content, tags, isPublic, isFinish , grade, department});
    };

    return (
        <div className="container">
            {/* pageTitle が設定されている場合のみ、タイトルを表示します */}
            {pageTitle && (
                <h1 style={{ margin: '0 0 20px 0', color: 'var(--text-h)', fontSize: '40px' }}>
                    {pageTitle}
                </h1>
            )}
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

                {/* 学年・学科選択コンポーネント */}
                {showGradeDepartment && (
                    <GradeDepartmentSelect 
                        grade={grade} 
                        setGrade={setGrade} 
                        department={department} 
                        setDepartment={setDepartment} 
                    />
                )}

                <div className="content-header" style={{ marginTop: '20px' }}>
                    <h2>{contentLabel}</h2>
                    <div className="mode-buttons">
                        <button type="button"  onClick={() => inputRef.current.click()}>画像</button>
                        <input type="file" accept="image/*" ref={inputRef} onChange={handleImageSelect}  style={{ display: "none" }}/> //画像選択を刺せる画面の表示
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
                            <div className="markdown-preview">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {content || "本文がここに表示されます"}
                                </ReactMarkdown>
                            </div>
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
                </div>
            </form>
        </div>
    );
}

export default PostForm;