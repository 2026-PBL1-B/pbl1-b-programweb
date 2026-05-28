// src/components/TagFilterSortBar.jsx
import React, { useState } from 'react'; //useRef,useEffectは使わないため削除
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

    const [searchText, setSearchText] = useState(""); // ユーザーが入力した検索文字

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

    // 3列のGridに合わせて、3の倍数（例：21や24）に変更します
    // クリップボードの縦幅に合わせてお好みの数値に調整してください
    const tagsPerPage = 30;

    // const sortedTags = [...availableTags].sort((a, b) => a.name.localeCompare(b.name, 'ja')); //タグを日本語順でソート
    
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


    const totalPages = Math.ceil(sortedTags.length / tagsPerPage); //総ページ数の計算

    const startIndex = (currentPage - 1) * tagsPerPage; //現在のページの開始インデックス
    const endIndex = startIndex + tagsPerPage; //現在のページの終了インデックス

    const currentTags = sortedTags.slice(startIndex, endIndex); //現在のページに表示するタグの配列
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
                    {/* クラスに clipboard-board を追加して木の板にします */}
                    <div className="modal-content clipboard-board">
                        
                        {/* 金具部分を追加 */}
                        <div className="clipboard-clip"></div>

                        {/* 紙の部分を追加し、既存のコンテンツを囲みます */}
                        <div className="clipboard-paper">
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
                                        setCurrentPage(1);
                                    }}
                                    className="tag-search-input"
                                />
                            </div>

                            <div className="tag-list">
                                {currentTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            className={
                                                selectedTagNames.includes(tag.name)
                                                    ? 'tag-button active'
                                                    : 'tag-button'
                                            }
                                            onClick={() => handleTagChange(tag.name)}
                                        >
                                            {tag.name}
                                        </button>
                                ))}
                            </div>
                            
                            {/* ページネーション */}
                            <div className="pagination">
                                <button
                                    className="page-arrow"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage -1)}
                                >
                                    {'<'}
                                </button>

                                <span>
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    className="page-arrow"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    {'>'}
                                </button>
                            </div>
                        </div> {/* // clipboard-paper の終わり */}
                    </div> {/* // modal-content の終わり */}
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