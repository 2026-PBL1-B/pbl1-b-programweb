// src/components/PostTagModal.jsx
import React, { useState, useEffect } from 'react';

function PostTagModal({ 
    isOpen, 
    onClose, 
    availableTags, 
    initialSelectedTags, 
    onConfirm 
}) {
    // モーダル内だけで使う一時的なステート
    const [tempSelectedTags, setTempSelectedTags] = useState([]);
    const [searchText, setSearchText] = useState("");

    // モーダルが開くたびに、現在のフォームのタグと同期させる
    useEffect(() => {
        if (isOpen) {
            setTempSelectedTags([...initialSelectedTags]);
            setSearchText(""); // 検索ワードもリセット
        }
    }, [isOpen, initialSelectedTags]);

    if (!isOpen) return null;

    // モーダル内でのトグル処理（選択/解除）
    const handleToggle = (tagName) => {
        if (tempSelectedTags.includes(tagName)) {
            setTempSelectedTags(tempSelectedTags.filter(t => t !== tagName));
        } else {
            if (tempSelectedTags.length < 5) {
                setTempSelectedTags([...tempSelectedTags, tagName]);
            } else {
                alert("タグは最大5つまで選択できます。");
            }
        }
    };

    // 検索フィルタリング
    const filteredTags = availableTags
        .filter(tag => tag.name.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

    return (
        <div className="modal-overlay">
            <div className="modal-content clipboard-modal">
                <div className="clipboard-clip">
                    <div className="clipboard-clip-pin"></div>
                </div>

                <div className="clipboard-modal-paper">
                    <div className="modal-header">
                        <h2>タグを選択 ({tempSelectedTags.length}/5)</h2>
                        <button type="button" className="close-button" onClick={onClose}>×</button>
                    </div>

                    <div className="search-area">
                        <input
                            type="text"
                            placeholder="タグ名で検索"
                            className="tag-search-input"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="tag-list" style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredTags.map((tag) => {
                            const isSelected = tempSelectedTags.includes(tag.name);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={isSelected ? 'tag-button active' : 'tag-button'}
                                    onClick={() => handleToggle(tag.name)}
                                >
                                    #{tag.name}
                                </button>
                            );
                        })}
                    </div>

                    <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="button"
                            className="post-submit-btn submit-btn"
                            style={{ width: '100%', padding: '12px' }}
                            onClick={() => onConfirm(tempSelectedTags)}
                        >
                            選択したタグを反映させる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostTagModal;