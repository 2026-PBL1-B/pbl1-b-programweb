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
    // const [isOpen, setIsOpen] = useState(false); // メニューの開閉状態を管理 
    // const dropdownRef = useRef(null); // メニューの外側をクリックしたか判定するため

    // メニューの外側をクリックしたら閉じる処理
    // useEffect(() => {
        // function handleClickOutside(event) {
            // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // setIsOpen(false);
            // }
        // }
        // document.addEventListener("mousedown", handleClickOutside);
        // return () => {
            // document.removeEventListener("mousedown", handleClickOutside);
        // };
    // }, [dropdownRef]);

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

    return (
        <div className="filter-sort-bar">
            {/* カスタムドロップダウンメニュー */}
            {/* <div className="custom-dropdown" ref={dropdownRef}> 
                    <button 
                        className="dropdown-toggle" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {displayText} ▼
                    </button>
                    
                    {isOpen && (
                        <div className="dropdown-menu">
                            {availableTags.map(tag => (
                                <label key={tag.id} className="dropdown-item">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedTagNames.includes(tag.name)}
                                        onChange={() => handleTagChange(tag.name)}
                                    />
                                    {tag.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            */}
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
                    <div className="modal-content">

                        <div className="modal-header">
                            <h2>タグを選択</h2>

                            <button
                                className="close-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tag-list">
                            {[...availableTags]
                                .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
                                .map((tag) => (
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