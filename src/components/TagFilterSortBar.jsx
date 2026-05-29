// src/components/TagFilterSortBar.jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import '../css/TagFilterSortBar.css';

function TagFilterSortBar({ 
    availableTags, 
    selectedTagNames,
    setSelectedTagNames,
    sortOrder, 
    setSortOrder 
}) {

    const [isModalOpen, setIsModalOpen] = useState(false);  //モーダルの開閉状態を管理
    const [currentPage, setCurrentPage] = useState(1); // 現在のページ数の管理
    const [pageStarts, setPageStarts] = useState([0]); // 各ページの開始インデックス
    const [maxVisible, setMaxVisible] = useState(-1); // 現在のページで実際に見えている数 (-1は計測前)
    const [pageCapacity, setPageCapacity] = useState(0); // 1ページに最大いくつ入るかの目安
    const containerRef = useRef(null);

    const [searchText, setSearchText] = useState(""); // ユーザーが入力した検索文字

    // モーダルが開かれた時の初期化
    useEffect(() => {
        if (isModalOpen) {
            setPageStarts([0]);
            setCurrentPage(1);
            setPageCapacity(0);
            setMaxVisible(-1);
        }
    }, [isModalOpen]);

    // 検索ワードやタグ一覧が変わったらリセット
    useEffect(() => {
        if (isModalOpen) {
            setPageStarts([0]);
            setCurrentPage(1);
            setPageCapacity(0);
            setMaxVisible(-1);
        }
    }, [searchText, availableTags]);

    // ウィンドウサイズが変わったらリセット
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

    // チェックボックスがクリックされた時の処理
    const handleTagChange = (tagName) => {
        if (selectedTagNames.includes(tagName)) {
            // すでに選択されていれば、配列から取り除く
            setSelectedTagNames(selectedTagNames.filter(t => t !== tagName));
        } else {
            // 選択されていなければ、配列に追加する
            setSelectedTagNames([...selectedTagNames, tagName]);
        }
    };

    // ボタンに表示するテキスト
    const displayText = selectedTagNames.length === 0 
        ? "すべてのタグ" 
        : `${selectedTagNames.length}個のタグを選択中`;

    const filteredTags = availableTags.filter((tag) =>
        tag.name.toLowerCase().includes(
            searchText.toLowerCase()
        )
    );

    const sortedTags =
        [...filteredTags]
            .sort((a, b) =>
            a.name.localeCompare(
                b.name,
                'ja'
            )
    );

    const startIndex = pageStarts[currentPage - 1];
    // 多めに取得して、入りきらない分は隠す＆次のページの開始位置にする
    // 1ページに最大100個あれば十分と想定
    const currentTags = sortedTags.slice(startIndex, startIndex + 100);

    useLayoutEffect(() => {
        if (!isModalOpen || !containerRef.current || maxVisible !== -1) return;

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
            // 余裕を持って判定 (padding等考慮)
            if (tagBottom <= containerBottom + 2) { 
                fitCount = i + 1;
            } else {
                break;
            }
        }
        setMaxVisible(fitCount);

        // 1ページに最大いくつ入るか（キャパシティ）を保存
        if (fitCount < tags.length) {
            setPageCapacity(fitCount);
        } else if (pageCapacity === 0 && fitCount > 0) {
            setPageCapacity(fitCount);
        }
    }, [isModalOpen, currentTags, currentPage, maxVisible, pageCapacity]);

    const handleNextPage = () => {
        const nextStart = startIndex + maxVisible;
        if (maxVisible > 0 && nextStart < sortedTags.length) {
            setPageStarts([...pageStarts, nextStart]);
            setCurrentPage(currentPage + 1);
            setMaxVisible(-1); // 次のページのために再計測
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setMaxVisible(-1); // 前のページのために再計測
        }
    };

    // 合計ページ数の推定 (正確には出せないが、目安として)
    const totalPagesEstimate = pageCapacity > 0 
        ? Math.ceil(sortedTags.length / pageCapacity) 
        : 1;

    return (
        <div className="filter-sort-bar">
            
            {/* タグモーダルを開くボタン */}
            <button
                className="tag-open-button"
                onClick={() => setIsModalOpen(true)}
            >
                {displayText}
            </button>

            {/* モーダル本体 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content clipboard-modal">
                        {/* クリップ金具 */}
                        <div className="clipboard-clip">
                            <div className="clipboard-clip-pin"></div>
                        </div>

                        {/* 紙部分 */}
                        <div className="clipboard-modal-paper">
                            <div className="modal-header">
                                <h2>タグを選択</h2>

                                <button
                                    className="close-button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="search-area">
                                <input
                                    type="text"
                                    placeholder="タグ名で検索"
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                    }}
                                    className="tag-search-input"
                                />
                            </div>

                            <div className="tag-list" ref={containerRef}>
                                {currentTags.map((tag, index) => {
                                    const isVisible = maxVisible === -1 || index < maxVisible;
                                    return (
                                        <button
                                            key={tag.id}
                                            className={
                                                selectedTagNames.includes(tag.name)
                                                    ? 'tag-button active'
                                                    : 'tag-button'
                                            }
                                            onClick={() => handleTagChange(tag.name)}
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
                                    className="page-arrow"
                                    disabled={startIndex + maxVisible >= sortedTags.length}
                                    onClick={handleNextPage}
                                >
                                    {'>'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 並び替えボタン */}
            <button 
                className="primary-button"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
                {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
            </button>
        </div>
    );
}

export default TagFilterSortBar;