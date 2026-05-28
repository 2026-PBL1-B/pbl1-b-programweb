// src/components/PostForm.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GradeDepartmentSelect from './GradeDepartmentSelect';
import MarkdownRenderer from './MarkdownRenderer';
import { defaultUrlTransform } from 'react-markdown';
import '../css/Post.css';
import { uploadImage } from '../api/image';
import { getTags } from '../api/Tag';

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
    showAdditionalUrls = false,      // 任意のURL追加機能
    onDraftSubmit,                   // 下書き保存用の関数を受け取るプロップス
    initialData = null,              // 初期データを受け取るプロップス
    postType = 'product'             // プレビュー時の付箋の色などを決定するプロパティ
}) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [tags, setTags] = useState(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [availableTags, setAvailableTags] = useState([]); //既存のタグ一覧の状態を管理する追加
    const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");             // GithubURLを管理する変数
    const [additionalUrls, setAdditionalUrls] = useState(initialData?.additionalUrls || []);   // 複数の追加URLを管理する配列（初期値は空）

    const [content, setContent] = useState(initialData?.content || "");
    const [mode, setMode] = useState("edit");

    // 公開,完成の変数
    const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
    const [isFinish, setIsFinish] = useState(initialData?.isFinish || false);

    // 学年と学科の状態を管理する変数
    const [grade, setGrade] = useState(initialData?.grade || ""); 
    const [department, setDepartment] = useState(initialData?.department || "");

    // 画像アップロード中の状態と、アップロード待ちの画像リスト
    const [isUploading, setIsUploading] = useState(false);
    const [pendingImages, setPendingImages] = useState([]); // { objectUrl, file } の配列

    // タグ一覧を取得する処理
    useEffect(() => {
        const loadTags = async () => {
            const tagsData = await getTags();
            setAvailableTags(tagsData || []);
        };

        loadTags();
    }, []);

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

    // タグ入力から既存タグを絞り込む
    const filteredTags = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(tagInput.toLowerCase())&&
        !tags.includes(tag.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ja')) //タグ名を日本語順にソート
    
    .slice(0, 5);   //上位5件だけ表示するように制限

    // タグが選択されたときの処理
    const handleTagSelect = (tagName) => {
        if (tags.length < 5){
            setTags([...tags, tagName]);
            setTagInput("");
        }
    };

    // 画像関連
    const inputRef = useRef(null);

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

const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    const objectUrl = URL.createObjectURL(file);
    setPendingImages((prev) => [...prev, { objectUrl, file }]); // 後でアップロードするために保存
    
    const markdownImage = `![画像](${objectUrl})\n`;
    setContent((prev) => prev + markdownImage);  // 本文に一時URLの画像を即座に追加

    if (inputRef.current) {
        inputRef.current.value = ''; // リセット
    }
  }
};

    const handleSubmitClick = async (e) => {
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

        setIsUploading(true); // 送信（アップロード）開始
        let finalContent = content;

        try {
            // 投稿ボタンが押されたタイミングで、本文に含まれる画像だけをアップロードする
            for (const img of pendingImages) {
                // ユーザーが本文から画像を消していないかチェック
                if (finalContent.includes(img.objectUrl)) {
                    const publicUrl = await uploadImage(img.file);
                    if (publicUrl) {
                        // 一時URLを本物のURL（SupabaseのURL）に置換
                        finalContent = finalContent.replace(img.objectUrl, publicUrl);
                    } else {
                        throw new Error("画像のアップロードに失敗しました");
                    }
                }
            }
        } catch (err) {
            console.error(err);
            alert("画像のアップロード中にエラーが発生したため、投稿を中断しました。");
            setIsUploading(false);
            return;
        }

        setIsUploading(false); // アップロード完了
        onSubmit({ title, content: finalContent, tags, githubUrl, additionalUrls, isPublic, isFinish , grade, department});
    };

    const handleDraftClick = (e) => {
        if (e) e.preventDefault();
            if (!title || !content) {
            alert("タイトルと本文を入力してください。");
            return;
            }
        if (onDraftSubmit) {
            onDraftSubmit({ title, content, tags, githubUrl, additionalUrls, isPublic, isFinish, grade, department });
        }
    };

    return (
        <div className="container">
            {pageTitle && (
                <h1 style={{ margin: '0 0 20px 0', color: 'var(--text-h)', fontSize: '40px' }}>
                    {pageTitle}
                </h1>
            )}
            <form onSubmit={(e) => e.preventDefault()}>
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
                        <>
                        <input
                            className="tag-input"
                            type="text"
                            placeholder={tags.length === 0 ? "タグを入力（Enterで確定）" : ""}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* タグ入力中、候補一覧を表示する処理 */}
                        {tagInput.trim() !== "" && filteredTags.length > 0 && (
                            <div className="tag-suggestions">
                                {filteredTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        className="tag-suggestion-item"
                                        onClick={() => handleTagSelect(tag.name)}
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        </>
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
                        <button type="button" onClick={() => inputRef.current.click()} disabled={isUploading}>
                            {isUploading ? 'アップロード中...' : '画像'}
                        </button>
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
                        <div className="preview" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                            <div 
                                className="detail-card" 
                                style={{ 
                                    backgroundColor: postType === 'product' ? '#ffedd5' : '#fef9c3',
                                    '--note-bg': postType === 'product' ? '#ffedd5' : '#fef9c3',
                                    minHeight: '100%',
                                    margin: 0,
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div>
                                    <p className="section-label" style={{ marginTop: '16px', marginBottom: '4px' }}>
                                        {postType === 'product' ? '制作物内容' : '質問内容'}
                                    </p>
                                    <div className="hand-drawn-line"></div>
                                    <div className="post-content" style={{ marginTop: '16px' }}>
                                        <MarkdownRenderer 
                                            urlTransform={(url) => {
                                                if (url.startsWith('blob:')) {
                                                    return url; // blob URL (ローカルプレビュー用) を許可する
                                                }
                                                return defaultUrlTransform(url);
                                            }}
                                        >
                                            {content || "本文がここに表示されます"}
                                        </MarkdownRenderer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="post-options" style={{ 
                    marginTop: '20px', 
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '20px'
                }}>
                    {showFinish && (
                        <label style={{ cursor: 'pointer' }}>
                            <input type="checkbox" checked={isFinish} onChange={(e) => setIsFinish(e.target.checked)} /> 完成済み
                        </label>
                    )}

                    <label style={{ cursor: 'pointer' }}>
                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> 公開する
                    </label>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    marginTop: '20px', 
                    width: '100%' 
                }}>
                    <button 
                        type="button" 
                        className="draft-save-btn"
                        disabled={loading} 
                        onClick={handleDraftClick}
                        style={{ padding: '10px 30px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? '保存中...' : '下書き保存'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmitClick} 
                        disabled={loading} 
                        style={{ padding: '10px 30px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? '送信中...' : submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostForm;