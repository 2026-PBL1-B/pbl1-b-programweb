// src/components/PostTagModal.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

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

    // ページネーション用のステート
    const [currentPage, setCurrentPage] = useState(1);
    const [pageStarts, setPageStarts] = useState([0]);
    const [maxVisible, setMaxVisible] = useState(-1);
    const [pageCapacity, setPageCapacity] = useState(0);
    const containerRef = useRef(null);

    // モーダルが開くたびに、現在のフォームのタグと同期・リセットさせる
    useEffect(() => {
        if (isOpen) {
            setTempSelectedTags([...initialSelectedTags]);
            setSearchText(""); // 検索ワードもリセット
            setPageStarts([0]);
            setCurrentPage(1);
            setPageCapacity(0);
            setMaxVisible(-1);
        }
    }, [isOpen, initialSelectedTags]);

    // 検索ワードや利用可能なタグ一覧が変わったらページをリセット
    useEffect(() => {
        if (isOpen) {
            setPageStarts([0]);
            setCurrentPage(1);
            setPageCapacity(0);
            setMaxVisible(-1);
        }
    }, [searchText, availableTags, isOpen]);

    // ウィンドウサイズが変わったら再計算のためにリセット
    useEffect(() => {
        const handleResize = () => {
            setPageStarts([0]);
            setCurrentPage(1);
            setPageCapacity(0);
            setMaxVisible(-1);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 検索とソート
    const filteredTags = availableTags
        .filter(tag => tag.name.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

    // ページネーション用のタグスライス
    const startIndex = pageStarts[currentPage - 1] || 0;
    const currentTags = filteredTags.slice(startIndex, startIndex + 100);

    // 画面内に収まるタグの数を計算
    useLayoutEffect(() => {
        if (!isOpen || !containerRef.current || maxVisible !== -1) return;

        const container = containerRef.current;
        const tags = container.querySelectorAll('.tag-button');
        if (tags.length === 0) {
            setMaxVisible(0);
            return;
        }

        const containerBottom = container.getBoundingClientRect().bottom;
        let fitCount = 0;

        for (let i = 0; i < tags.length; i++) {
            const tagBottom = tags[i].getBoundingClientRect().bottom;
            if (tagBottom <= containerBottom + 2) { 
                fitCount = i + 1;
            } else {
                break;
            }
        }
        setMaxVisible(fitCount);

        if (fitCount < tags.length) {
            setPageCapacity(fitCount);
        } else if (pageCapacity === 0 && fitCount > 0) {
            setPageCapacity(fitCount);
        }
    }, [isOpen, currentTags, currentPage, maxVisible, pageCapacity]);


    // ==========================================
    // 全ての Hooks を呼び出した後に return を配置する
    // ==========================================
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

    // 次のページへ
    const handleNextPage = () => {
        const nextStart = startIndex + maxVisible;
        if (maxVisible > 0 && nextStart < filteredTags.length) {
            setPageStarts([...pageStarts, nextStart]);
            setCurrentPage(currentPage + 1);
            setMaxVisible(-1); // 次のページのために再計測
        }
    };

    // 前のページへ
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setMaxVisible(-1); // 前のページのために再計測
        }
    };

    const totalPagesEstimate = pageCapacity > 0 
        ? Math.ceil(filteredTags.length / pageCapacity) 
        : 1;

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

                    <div 
                        className="tag-list" 
                        ref={containerRef} 
                        //style={{ overflow: 'hidden', flex: 1, alignContent: 'flex-start' }}
                    >
                        {currentTags.map((tag, index) => {
                            const isSelected = tempSelectedTags.includes(tag.name);
                            const isVisible = maxVisible === -1 || index < maxVisible;
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={isSelected ? 'tag-button active' : 'tag-button'}
                                    onClick={() => handleToggle(tag.name)}
                                    style={{
                                        display: isVisible ? 'inline-block' : 'none',
                                        visibility: maxVisible === -1 ? 'hidden' : 'visible',
                                        pointerEvents: maxVisible === -1 ? 'none' : 'auto'
                                    }}
                                >
                                    {tag.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* ページネーション */}
                    <div className="pagination">
                        <button
                            type="button"
                            className="page-arrow"
                            disabled={currentPage === 1}
                            onClick={handlePrevPage}
                        >
                            {'<'}
                        </button>

                        <span>
                            {currentPage} / {Math.max(currentPage, totalPagesEstimate)}
                        </span>

                        <button
                            type="button"
                            className="page-arrow"
                            disabled={startIndex + maxVisible >= filteredTags.length}
                            onClick={handleNextPage}
                        >
                            {'>'}
                        </button>
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