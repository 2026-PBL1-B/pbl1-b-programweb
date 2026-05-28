import React, { useState, useRef, useEffect } from 'react';
import { grades, departments } from '../domain/GradeDepartment';
import '../css/GradeDepartmentSelect.css'; 

// カスタムドロップダウン（クリップボード風）
function ClipboardSelect({ value, onChange, options, placeholder = '選択しない' }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    // 外側をクリックしたら閉じる
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 現在の表示ラベルを取得
    const selectedLabel = value === '' 
        ? placeholder 
        : (options.find(o => (o.value ?? o) === value)?.label ?? value);

    const handleSelect = (optValue) => {
        onChange(optValue);
        setIsOpen(false);
    };

    return (
        <div className="clipboard-select-wrapper" ref={ref}>
            {/* 未選択時は手書き風の通常ボックス */}
            <button
                type="button"
                className={`clipboard-select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedLabel}</span>
                <span className="clipboard-select-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* クリックで開くクリップボード風パネル */}
            {isOpen && (
                <div className="clipboard-dropdown-panel">
                    {/* クリップ金具 */}
                    <div className="clipboard-clip">
                        <div className="clipboard-clip-pin"></div>
                    </div>
                    {/* 白い紙部分 */}
                    <div className="clipboard-dropdown-paper">
                        {/* 「選択しない」オプション */}
                        <div
                            className={`clipboard-option ${value === '' ? 'selected' : ''}`}
                            onClick={() => handleSelect('')}
                        >
                            {placeholder}
                        </div>
                        {options.map((option) => {
                            const optValue = option.value ?? option;
                            const optLabel = option.label ?? option;
                            return (
                                <div
                                    key={optValue}
                                    className={`clipboard-option ${value === optValue ? 'selected' : ''}`}
                                    onClick={() => handleSelect(optValue)}
                                >
                                    {optLabel}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function GradeDepartmentSelect({ grade, setGrade, department, setDepartment }) {
    return (
        <div className="grade-department-container">
            {/* 学科 */}
            <div className="select-group">
                <label className="select-label">学科:</label>
                <ClipboardSelect
                    value={department}
                    onChange={setDepartment}
                    options={departments.map(d => ({ value: d, label: d }))}
                    placeholder="選択しない"
                />
            </div>

            {/* 学年 */}
            <div className="select-group">
                <label className="select-label">学年:</label>
                <ClipboardSelect
                    value={grade || ''}
                    onChange={setGrade}
                    options={grades}
                    placeholder="選択しない"
                />
            </div>
        </div>
    );
}

export default GradeDepartmentSelect;