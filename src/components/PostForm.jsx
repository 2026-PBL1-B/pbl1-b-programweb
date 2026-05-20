// src/components/PostForm.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import GradeDepartmentSelect from './GradeDepartmentSelect';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import '../css/Post.css';

function PostForm({ 
    pageTitle,
    titlePlaceholder = "タイトルを入力してください",
    contentLabel = "本文",
    contentPlaceholder = "本文を入力してください",
    submitButtonText = "投稿する",
    onSubmit,
    loading = false,
    showFinish = true,
    showGradeDepartment = false,
    showGithubUrl = false,          // GithubのURL機能
    showAdditionalUrls = false      // 任意のURL追加機能
}) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [githubUrl, setGithubUrl] = useState("");             // GithubURLを管理する変数
    const [additionalUrls, setAdditionalUrls] = useState([]);   // 複数の追加URLを管理する配列（初期値は空）

    const [content, setContent] = useState("");
    const [mode, setMode] = useState("edit");

    const [isPublic, setIsPublic] = useState(true);
    const [isFinish, setIsFinish] = useState(false);

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

    // 「＋」ボタンが押されたとき、配列の最後に空の入力欄を追加する
    const handleAddUrl = () => {
        setAdditionalUrls([...additionalUrls, ""]);
    };

    // 「×」ボタンが押されたとき、指定された位置（index）の入力欄を削除する
    const handleRemoveUrl = (indexToRemove) => {
        setAdditionalUrls(additionalUrls.filter((_, index) => index !== indexToRemove));
    };

    // 追加URLの文字が入力されたとき、配列の中身を更新する
    const handleAdditionalUrlChange = (indexToChange, newValue) => {
        const newUrls = [...additionalUrls];
        newUrls[indexToChange] = newValue;
        setAdditionalUrls(newUrls);
    };

    // 文字列が正しいURLかチェックする関数
    const isValidUrl = (urlString) => {
        if (!urlString) return true; // 空欄の場合は任意項目なのでOKとする
        try {
            new URL(urlString); // 正しいURL形式でないとエラーになる性質を利用
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmitClick = (e) => {
        if (e) e.preventDefault();
        if (!title || !content) {
            alert("タイトルと本文を入力してください。");
            return;
        }

        // GitHub URLの形式チェック
        if (showGithubUrl && githubUrl && !isValidUrl(githubUrl)) {
            alert("GitHubのURLが正しい形式ではありません。（http:// または https:// から始めてください）");
            return; // 送信をストップ
        }

        // 追加URLの形式チェック
        if (showAdditionalUrls) {
            for (let i = 0; i < additionalUrls.length; i++) {
                const url = additionalUrls[i];
                if (url && !isValidUrl(url)) {
                    alert(`追加URLの ${i + 1} 番目が正しい形式ではありません。（http:// または https:// から始めてください）`);
                    return; // 送信をストップ
                }
            }
        }

        onSubmit({ title, content, tags, githubUrl, additionalUrls, isPublic, isFinish , grade, department});
    };

    return (
        <div className="container">
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

                {showGithubUrl && (
                    <input
                        className="github-url-input"
                        type="url"  // URLチェック
                        placeholder="GitHubのURLを入力してください（任意）"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                    />
                )}

                {/* 任意のURL追加セクション */}
                {showAdditionalUrls && (
                    <div className="additional-urls-section">
                        {/* 配列(additionalUrls)の数だけ入力ボックスと×ボタンを表示 */}
                        {additionalUrls.map((url, index) => (
                            <div key={index} className="url-input-row">
                                <input
                                    className="additional-url-input"
                                    type="url"
                                    placeholder="任意のURLを入力してください"
                                    value={url}
                                    onChange={(e) => handleAdditionalUrlChange(index, e.target.value)}
                                />
                                <button type="button" className="remove-url-btn" onClick={() => handleRemoveUrl(index)}>
                                    ×
                                </button>
                            </div>
                        ))}
                        {/* ＋ボタン（最初はこれだけが表示されます） */}
                        <button type="button" className="add-url-btn" onClick={handleAddUrl}>
                            ＋ URLを追加
                        </button>
                    </div>
                )}

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
                        <input type="file" accept="image/*" ref={inputRef} onChange={handleImageSelect}  style={{ display: "none" }}/> {/* 画像選択をさせる画面の表示 */}
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
                            
                            {/* Github用URL */}
                            {showGithubUrl && githubUrl && (
                                <p style={{ wordBreak: 'break-all', color: 'var(--accent)' }}>
                                    GitHub: <a href={githubUrl} target="_blank" rel="noopener noreferrer">{githubUrl}</a>
                                </p>
                            )}

                            {/* プレビューに追加URLも表示 */}
                            {showAdditionalUrls && additionalUrls.length > 0 && (
                                <div style={{ marginBottom: '15px' }}>
                                    {additionalUrls.map((url, i) => url && (
                                        <p key={i} style={{ wordBreak: 'break-all', margin: '5px 0' }}>
                                            関連URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                        </p>
                                    ))}
                                </div>
                            )}

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